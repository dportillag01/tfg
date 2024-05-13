<?php

session_start();

$host = "localhost";
$user = "dwec_alumnos";
$password = "dwec_alumnos";
$database = "informtienda";

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 2040 05:00:00 GMT');
header('Content-Type: application/json');

try {
    conectar();
} catch (PDOException $e) {
    echo $e->getCode();
    $mensaje = $e->getMessage();
    echo 'Error en la conexión: ' . $mensaje;
    exit();
}

function conectar()
{
    global $host, $user, $password, $database;
    $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
    $conn = new PDO("mysql:host=$host;dbname=$database", $user, $password, $opciones);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
}

if (isset($_POST['accion'])) {
    switch ($_POST['accion']) {
        case 'obtenerTablas':
            obtenerTablas();
            break;
        case 'obtenerEstructuraTabla':
            obtenerEstructuraTabla($_POST['tabla']);
            break;
        case 'obtenerRegistros':
            obtenerRegistros($_POST['tabla']);
            break;
        case 'obtenerRegistro':
            obtenerRegistro($_POST['tabla'], $_POST['id']);
            break;
        case 'insertarRegistro':
            $formData = $_POST;
            insertarRegistro($_POST["tabla"], $formData);
            break;
        case 'actualizarRegistro':
            $formData = $_POST;
            actualizarRegistro($_POST['tabla'], $formData, $_POST['id']);
            break;
        case 'eliminarRegistro':
            eliminarRegistro($_POST['tabla'], $_POST['id']);
            break;
        case 'obtenerFK':
            obtenerFk($_POST['tabla'], $_POST['id']);
            break;
        default:
            echo "Acción no válida";
    }
}

function obtenerTablas()
{
    $conn = conectar();
    global $database;

    $sql = "SHOW TABLES FROM $database";
    $resultado = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
}

function obtenerEstructuraTabla($tabla)
{
    $conn = conectar();
    $estructura = array();

    $sql = "DESCRIBE $tabla";
    $resultado = $conn->query($sql);
    if ($resultado->rowCount() > 0) {
        while ($fila = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $tipo = $fila['Type'];
            $longitud = 0;
            if (strpos($tipo, '(') !== false) {
                $longitud = substr($tipo, strpos($tipo, '(') + 1, -1);
                $tipo = substr($tipo, 0, strpos($tipo, '('));
            }
            $estructura[] = [$fila['Field'], $tipo, $longitud];
        }
    }
    echo json_encode($estructura);
}

function obtenerRegistros($tabla)
{
    $conn = conectar();
    $registros = array();

    $sql = "SELECT * FROM $tabla";
    $resultado = $conn->query($sql);
    if ($resultado->rowCount() > 0) {
        while ($fila = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $registros[] = $fila;
        }
    }
    echo json_encode($registros);
}

function obtenerRegistro($tabla, $id)
{
    $conn = conectar();
    $registro = array();

    $sql = "SELECT * FROM $tabla WHERE id = $id";
    $resultado = $conn->query($sql);
    if ($resultado->rowCount() > 0) {
        while ($fila = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $registro[] = $fila;
        }
    }
    echo json_encode($registro);
}

function insertarRegistro($tabla, $data)
{
    $conn = conectar();

    $columnas = [];
    $valores = [];

    foreach ($data as $clave => $valor) {
        if ($clave !== 'accion' && $clave !== 'tabla' && $clave !== 'id') {
            $columnas[] = $clave;
            $valores[] = $valor === null ? 'NULL' : $conn->quote($valor);
        }
    }

    $columnasStr = implode(', ', $columnas);
    $valoresStr = implode(', ', $valores);

    try {
        $sqlMaxId = "SELECT MAX(Id) AS id FROM $tabla";
        $resultado = $conn->query($sqlMaxId)->fetch(PDO::FETCH_ASSOC);
        $id = $resultado["id"] + 1;

        $sqlInsert = "INSERT INTO $tabla (id, $columnasStr) VALUES ($id, $valoresStr)";
        $conn->query($sqlInsert);
    } catch (Exception $e) {
        $response = "Error al insertar el registro: " . $e->getMessage();
        http_response_code(500);
        echo json_encode($response);
    }
}

function actualizarRegistro($tabla, $data, $id)
{
    $conn = conectar();

    $columnas = [];
    foreach ($data as $clave => $valor) {
        if ($clave !== 'accion' && $clave !== 'tabla' && $clave !== 'id') {
            $columnas[] = "$clave = '$valor'";
        }
    }
    $columnasStr = implode(', ', $columnas);

    try {
        $sqlInsert = "UPDATE $tabla SET $columnasStr WHERE id = $id";
        $conn->query($sqlInsert);
    } catch (Exception $e) {
        $response = "Error al editar el registro: " . $e->getMessage();
        http_response_code(500);
        echo json_encode($response);
    }
}

function eliminarRegistro($tabla, $id)
{
    $conn = conectar();
    $response = [];

    try {
        $sql = "DELETE FROM $tabla WHERE id = $id";
        $conn->query($sql);
        $response = "Registro eliminado correctamente";
    } catch (Exception $e) {
        if ($e->getCode() == '23000' && strpos($e->getMessage(), '1451') !== false) {
            $response = "Error al eliminar el registro: El registro está siendo referenciado por otras tablas";
        } else {
            $response = "Error al eliminar el registro: " . $e->getMessage();
        }
        http_response_code(500);
    }

    echo json_encode($response);
}

function obtenerFk($tabla, $id)
{
    $conn = conectar();
    $data = [];

    if ($tabla == "usuario" || $tabla == "empleado" || $tabla == "producto") {
        $tabla = $tabla . "s";
        $sql = "SELECT id, nombre FROM $tabla";
    } else if ($tabla == "venta") {
        $tabla = $tabla . "s";
        $sql = "SELECT id, id as nombre FROM $tabla";
    } else if ($tabla == "proveedor" || $tabla == "reparacion") {
        $tabla = $tabla . "es";
        $sql = "SELECT id, nombre FROM $tabla";
    }

    if ($id != "0") {
        $sql = $sql . " WHERE id = '$id'";
    }

    $resultado = $conn->query($sql);
    if ($resultado->rowCount() > 0) {
        while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
    }
    echo json_encode($data);
}