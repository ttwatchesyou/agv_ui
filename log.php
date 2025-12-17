<?php
// get_food.php
header("Content-Type: application/json; charset=UTF-8");
require 'db_connect.php'; // เรียกไฟล์เชื่อมต่อฐานข้อมูลตัวเดิม

// SQL ที่คุณต้องการ
$sql = "SELECT `id_tb`, `id_food` FROM `log` WHERE state = 0";

$result = $conn->query($sql);

$foodList = array();

if ($result->num_rows > 0) {
    // วนลูปเก็บข้อมูลทีละแถวลงใน Array
    while($row = $result->fetch_assoc()) {
        $foodList[] = $row;
    }
}

// ส่งข้อมูลกลับเป็น JSON
echo json_encode($foodList);

$conn->close();
?>