<?php
require 'connect.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
  // Extract the data.
  $request = json_decode($postdata);

  // Validate.
  if(trim($request->taskId) === '' || trim($request->listId) === '' || trim($request->position) === '') {
    return http_response_code(400);
  }
    
  // Sanitize.
  $taskId = mysqli_real_escape_string($con, (int)$request->taskId);
  $listId = mysqli_real_escape_string($con, trim($request->listId));
  $position = mysqli_real_escape_string($con, (int)$request->position);

  $listName = "t";
  if ($listId=="list-todo") $listName = "t";
  if ($listId=="list-inprogress") $listName = "p";
  if ($listId=="list-done") $listName = "d";

  // Update.
  $sql = "UPDATE `todolist` SET `list`='$listName', position={$position} WHERE `id` = '{$taskId}' LIMIT 1";

  if(mysqli_query($con, $sql)) {
    http_response_code(204);
  } else {
    return http_response_code(422);
  }  
}
