<?php

session_start();

$host = "localhost";
$user = "dwec_alumnos";
$password = "dwec_alumnos";
$database = "informtienda";

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 2040 05:00:00 GMT');
header("Content-Type: application/json");

try {
    $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
    $conn = new PDO("mysql:host=$host;dbname=$database", $user, $password, $opciones);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_POST['nombre']) && isset($_POST['password'])) {
        $nombre = $_POST['nombre'];
        $psw = $_POST['password'];

        $sql = "SELECT * FROM usuarios WHERE nombre = :nombre";
        $stmt = $conn->prepare($sql);
        $stmt->execute(['nombre' => $nombre]);
        $fila = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($fila) {
            if ($psw === $fila["password"]) {
                // Contraseña coincide
                require "Usuario.class.php";
                $_SESSION['admin'] = false;
                $_SESSION['usuario'] = $fila;
                // Añadir 'success' al objeto de respuesta
                echo json_encode(['success' => true, 'usuario' => '']);
            }
        }

        $sql1 = "SELECT * FROM empleados WHERE nombre = :nombre";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->execute(['nombre' => $_POST['nombre']]);
        $fila1 = $stmt1->fetch(PDO::FETCH_ASSOC);

        if ($fila1) {
            if ($psw === $fila1["password"]) {
                // Contraseña coincide
                require "Empleado.class.php";
                $_SESSION['usuario'] = true;
                $_SESSION['usuario'] = $fila1;
                // Añadir 'success' al objeto de respuesta
                echo json_encode(['success' => true, 'empleado' => '']);
            }
        }
        echo json_encode(['success' => false, 'error' => 'Datos incorrectos']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Faltan datos']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]);
}
?>