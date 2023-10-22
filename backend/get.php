<?php
/**
 * Returns the specified task
 */
require 'connect.php';

// Extract, validate and sanitize the id.
$id = ($_GET['id'] !== null && (int)$_GET['id'] > 0)? mysqli_real_escape_string($con, (int)$_GET['id']) : false;

if(!$id) {
  return http_response_code(400);
}

$sql = "SELECT id, name, list FROM todolist WHERE `id` ='{$id}' LIMIT 1";

if($result = mysqli_query($con,$sql)) {
  $task = [];
  $row = mysqli_fetch_assoc($result);

  $task['id'] = $row['id'];
  $task['description'] = $row['name'];
  $task['list'] = $row['list'];

  echo json_encode(['data'=>$task]);
} else {
  http_response_code(404);
}
