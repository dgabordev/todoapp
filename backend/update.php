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
  $id    = mysqli_real_escape_string($con, (int)$request->data->id);
  $description = mysqli_real_escape_string($con, trim($request->data->description));

  // Update.
  $sql = "UPDATE `todolist` SET `name`='$description' WHERE `id` = '{$id}' LIMIT 1";

  if(mysqli_query($con, $sql)) {
    http_response_code(204);
  } else {
    return http_response_code(422);
  }  
}
