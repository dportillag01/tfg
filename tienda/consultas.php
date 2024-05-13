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
        case 'obtenerProductos':
            obtenerProductos();
            break;
        case 'obtenerReparaciones':
            obtenerReparaciones();
            break;
        default:
            echo "Acción no válida";
    }
}

function obtenerProductos()
{
    $conn = conectar();

    $sql = "SELECT productos.*, proveedores.nombre AS proveedor FROM productos INNER JOIN proveedores ON productos.fk_proveedor = proveedores.id";
    $resultado = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
}

function obtenerReparaciones()
{
    $conn = conectar();

    $sql = "SELECT reparaciones.*, empleados.nombre AS empleado FROM reparaciones INNER JOIN empleados ON reparaciones.fk_empleado = reparaciones.id";
    $resultado = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
}