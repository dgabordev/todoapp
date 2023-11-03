<?php
require 'connect.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
  // Extract the data.
  $request = json_decode($postdata);

  // Validate.
  if(trim($request->data->description) === '') {
    return http_response_code(400);
  }

  // Sanitize.
  $id = mysqli_real_escape_string($con, (int)$request->data->id);
  $description = mysqli_real_escape_string($con, trim($request->data->description));
  $folder_id = mysqli_real_escape_string($con, (int)$request->data->folder_id);

  // Store.
  if ($id > 0) {
    $sql = "UPDATE `todolist` SET `name`='$description', `folder_id`='$folder_id' WHERE `id` = '{$id}' LIMIT 1";
  } else {
    $sql = "INSERT INTO `todolist`(`id`,`folder_id`,`name`,`list`,`date_added`) VALUES (null, '{$folder_id}', '{$description}', 't', NOW())";
  }

  if(mysqli_query($con,$sql)) {
    http_response_code(201);
    $task = [
      'description' => $description,
      'done' => false,
      'id'   => mysqli_insert_id($con)
    ];
    echo json_encode(['data'=>$task]);
  } else {
    http_response_code(422);
  }
}
