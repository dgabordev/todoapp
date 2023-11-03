<?php
/**
 * Returns the list of tasks.
 */
require 'connect.php';

$folder_id = (isset($_GET['folder_id']) && (int)$_GET['folder_id'] > 0) ? mysqli_real_escape_string($con, (int)$_GET['folder_id']) : 0;
    
$tasks = [];

$where = "id>0";
if ($folder_id>0) {
  $where .= " AND folder_id=".$folder_id;
}
$sql = "SELECT id, folder_id, name, list FROM todolist WHERE $where ORDER BY position ASC";

if($result = mysqli_query($con,$sql)) {
  $cr = 0;
  while($row = mysqli_fetch_assoc($result)) {
    $tasks[$cr]['id'] = $row['id'];
    $tasks[$cr]['folder_id'] = $row['folder_id'];
    $tasks[$cr]['description'] = $row['name'];
    $tasks[$cr]['list'] = $row['list'];
    $cr++;
  }
  echo json_encode(['data'=>$tasks]);
} else {
  http_response_code(404);
}
