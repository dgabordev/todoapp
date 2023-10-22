import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../model/task';
import { TaskService } from '../../service/task.service';
import { MainService } from '../../service/main.service';

@Component({
  selector: 'app-todo-item-window',
  templateUrl: './todo-item-window.component.html',
  styleUrls: ['./todo-item-window.component.scss'],
})
export class TodoItemWindowComponent implements OnInit {

  inputData: any;
  todoItemForm = this.buildr.group({
    name: this.buildr.control(''),
    //email: this.buildr.control(''),
    //phone: this.buildr.control(''),
    //status: this.buildr.control(true)
  });

  constructor(private dialog: MatDialog, private ref: MatDialogRef<TodoItemWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder, private taskService: TaskService, private mainService: MainService) {

  }

  ngOnInit(): void {
    this.inputData = this.data;
    this.todoItemForm.setValue({ name: this.inputData.taskItem.description })
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  saveItem() {
    let taskItem: Task = { id: this.inputData.taskItem.id, description: this.todoItemForm.value.name, list:'t', position: 0, done:false };

    this.taskService.store(taskItem).subscribe(
      (res: Task) => {
        // Inform the user
        this.mainService.openSuccessStatusBar("Created successfully");
      },
      (err) => (this.mainService.openErrorStatusBar("Error: " + err.message))
    );

    this.todoItemForm.reset();
    this.closePopup();
  }

}
