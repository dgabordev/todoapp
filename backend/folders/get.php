<?php
/**
 * Returns the specified folder
 */
require '../connect.php';

// Extract, validate and sanitize the id.
$id = ($_GET['id'] !== null && (int)$_GET['id'] > 0)? mysqli_real_escape_string($con, (int)$_GET['id']) : false;

if(!$id) {
  return http_response_code(400);
}

$sql = "SELECT id, name FROM folderlist WHERE `id` ='{$id}' LIMIT 1";

if($result = mysqli_query($con,$sql)) {
  $folder = [];
  $row = mysqli_fetch_assoc($result);

  $folder['id'] = $row['id'];
  $folder['name'] = $row['name'];

  echo json_encode(['data'=>$folder]);
} else {
  http_response_code(404);
}
