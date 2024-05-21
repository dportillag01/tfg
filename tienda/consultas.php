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
        case 'obtenerProducto':
            obtenerProducto($_POST['id']);
            break;
        case 'obtenerReparaciones':
            obtenerReparaciones($_SESSION['usuario']['id']);
            break;
        case 'obtenerCarrito':
            obtenerCarrito($_SESSION['usuario']['id']);
            break;
        case 'añadirCarrito':
            añadirCarrito($_SESSION['usuario']['id'], $_POST['id'], $_POST['cantidad']);
            break;
        default:
            echo "Acción no válida";
    }
}

function obtenerProductos()
{
    $conn = conectar();

    $sql = "SELECT productos.* FROM productos";
    $resultado = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
}

function obtenerProducto($id)
{
    $conn = conectar();

    $sql = "SELECT 
            p.id AS 'producto.id',
            p.nombre AS 'producto.nombre',
            p.precio AS 'producto.precio',
            p.descripcion AS 'producto.descripcion',
            pr.id AS 'proveedor.id',
            pr.nif AS 'proveedor.nif',
            pr.nombre AS 'proveedor.nombre',
            pr.direccion AS 'proveedor.direccion',
            pr.email AS 'proveedor.email',
            GROUP_CONCAT(tp.telefono SEPARATOR ', ') AS 'telefonos.proveedor'
        FROM productos p
        JOIN proveedores pr ON p.fk_proveedor = pr.id
        LEFT JOIN telefonos_proveedores tp ON pr.id = tp.fk_proveedor
        WHERE p.id = $id";
    $resultado = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
}

function obtenerReparaciones($userId)
{
    $conn = conectar();

    $sql = "SELECT 
            reparaciones.*,
            empleados.nombre as empleado
        FROM reparaciones
        INNER JOIN ventas ON reparaciones.fk_venta = ventas.id
        INNER JOIN empleados ON reparaciones.fk_empleado = empleados.id
        WHERE ventas.fk_usuario = $userId";
    $resultado = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
}

function obtenerCarrito($userId) {
    $conn = conectar();

    $sql = "SELECT *
        FROM r_ventas_productos
        INNER JOIN productos ON r_ventas_productos.fk_producto = productos.id
        INNER JOIN ventas ON r_ventas_productos.fk_venta = ventas.id
        WHERE ventas.fk_usuario = $userId";
    $resultado = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($resultado);
}

function añadirCarrito($userId, $id_producto, $cantidad)
{
    $conn = conectar();

    try {
        $fecha_actual = date("Y-m-d");
        $f_entrega = date("Y-m-d", strtotime($fecha_actual . " +7 days"));

        $sqlInsert = "INSERT INTO ventas (f_entrega, fk_usuario) VALUES ('$f_entrega', $userId)";
        $conn->query($sqlInsert);
        $id_venta = $conn->lastInsertId();

        $sqlInsert = "INSERT INTO r_ventas_productos (fk_venta, fk_producto, cantidad) VALUES ($id_venta, $id_producto, $cantidad)";
        $conn->query($sqlInsert);
    } catch (Exception $e) {
        $response = "Error al insertar el registro: " . $e->getMessage();
        http_response_code(500);
        echo json_encode($response);
    }
}

function eliminarCarrito($id_venta)
{
    $conn = conectar();
    $response = [];

    try {
        $sql = "DELETE FROM r_ventas_productos WHERE id = $id_venta";
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