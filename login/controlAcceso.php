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
    //Conectar a la ddbb
    $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
    $conn = new PDO("mysql:host=$host;dbname=$database", $user, $password, $opciones);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_SESSION['usuario'])) {
        $login = false;

        // Comprobar datos para tabla usuarios (usuarios)
        $sql = "SELECT * FROM usuarios WHERE nombre = :nombre";
        $stmt = $conn->prepare($sql);
        $stmt->execute(['nombre' => $_SESSION['usuario']['nombre']]);
        $fila = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($fila) {
            $login = true;
            $admin = false;
        }

        // Comprobar datos para tabla empleados (administradores)
        $sql1 = "SELECT * FROM empleados WHERE nombre = :nombre";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->execute(['nombre' => $_SESSION['usuario']['nombre']]);
        $fila1 = $stmt1->fetch(PDO::FETCH_ASSOC);
        if ($fila1) {
            $login = true;
            $admin = true;
        }
    }
    echo json_encode(['login' => $login, 'admin' => $admin]);

} catch (PDOException $e) {
    echo json_encode('Error de conexión: ' . $e->getMessage());
}
