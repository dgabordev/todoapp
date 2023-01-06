<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {

  $postarray = json_decode($postdata, true);
  $tasks = $postarray['tasks'];

  foreach($tasks as $task) {
    $taskId = mysqli_real_escape_string($con, (int)$task['id']);
    $taskPosition = mysqli_real_escape_string($con, (int)$task['position']);

    $sql = "UPDATE `todolist` SET `position`={$taskPosition} WHERE `id` = '{$taskId}' LIMIT 1";
    mysqli_query($con, $sql);
  }

  http_response_code(204);

}
