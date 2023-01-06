<?php
/**
 * Returns the list of tasks.
 */
require 'connect.php';
    
$tasks = [];
$sql = "SELECT id, name, list FROM todolist ORDER BY position ASC";

if($result = mysqli_query($con,$sql)) {
  $cr = 0;
  while($row = mysqli_fetch_assoc($result)) {
    $tasks[$cr]['id'] = $row['id'];
    $tasks[$cr]['description'] = $row['name'];
    $tasks[$cr]['list'] = $row['list'];
    $cr++;
  }
  echo json_encode(['data'=>$tasks]);
} else {
  http_response_code(404);
}
