<?php
// db_connect.php
$servername = "localhost";
$username = "root";        // ค่า default ของ XAMPP
$password = "";            // ค่า default ของ XAMPP (ว่างไว้)
$dbname = "chamoung";        // ชื่อ Database ของคุณ

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname);

// เช็คว่าต่อติดไหม
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// ตั้งค่าภาษาไทย
$conn->set_charset("utf8");
?>

