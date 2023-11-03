import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../model/task';
import { TaskService } from '../../service/task.service';
import { Folder } from '../../model/folder';
import { FolderService } from '../../service/folder.service';
import { MainService } from '../../service/main.service';

@Component({
  selector: 'app-todo-item-window',
  templateUrl: './todo-item-window.component.html',
  styleUrls: ['./todo-item-window.component.scss'],
})
export class TodoItemWindowComponent implements OnInit {
  
  inputData: any;
  foldersList: { id: number, name: string}[] = [];
  todoItemForm = this.buildr.group({
    name: this.buildr.control(''),
    folder_id: this.buildr.control(0)
  });

  constructor(private dialog: MatDialog, private ref: MatDialogRef<TodoItemWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder, private taskService: TaskService, private folderService: FolderService, private mainService: MainService) {
  }

  ngOnInit(): void {
    this.inputData = this.data;
    this.todoItemForm.setValue({ name: this.inputData.taskItem.description, folder_id: this.inputData.taskItem.folder_id })
    this.getFolders();
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  saveItem() {
    let taskItem: Task = { id: this.inputData.taskItem.id, folder_id: this.todoItemForm.value.folder_id, description: this.todoItemForm.value.name, list:'t', position: 0, done:false };

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

  getFolders(): void {
    this.foldersList = [];
      this.folderService.getAll().subscribe(
        (data: Folder[]) => {
          data.forEach((folderItem) => {
              this.foldersList.push(folderItem);
          });
          //console.log('Folders list loaded');
        },
        (err) => ( this.mainService.openErrorStatusBar("Error: " + err) )
    );
  }
  
}
