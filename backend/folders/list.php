<?php
/**
 * Returns the list of folders.
 */
require '../connect.php';
    
$folders = [];
$sql = "SELECT id, name FROM folderlist ORDER BY name ASC";

if($result = mysqli_query($con,$sql)) {
  $cr = 0;
  while($row = mysqli_fetch_assoc($result)) {
    $folders[$cr]['id'] = $row['id'];
    $folders[$cr]['name'] = $row['name'];
    $cr++;
  }
  echo json_encode(['data'=>$folders]);
} else {
  http_response_code(404);
}
