<?php
require '../connect.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
  // Extract the data.
  $request = json_decode($postdata);

  // Validate.
  if(trim($request->data->name) === '') {
    return http_response_code(400);
  }

  // Sanitize.
  $id = mysqli_real_escape_string($con, (int)$request->data->id);
  $name = mysqli_real_escape_string($con, trim($request->data->name));

  // Store.
  if ($id > 0) {
    $sql = "UPDATE `folderlist` SET `name`='$name' WHERE `id` = '{$id}' LIMIT 1";
  } else {
    $sql = "INSERT INTO `folderlist`(`id`,`name`,`date_added`) VALUES (null, '{$name}', NOW())";
  }

  if(mysqli_query($con,$sql)) {
    http_response_code(201);
    $folder = [
      'name' => $name,
      'id'   => mysqli_insert_id($con)
    ];
    echo json_encode(['data'=>$folder]);
  } else {
    http_response_code(422);
  }
}
