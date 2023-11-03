import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Folder } from '../../model/folder';
import { FolderService } from '../../service/folder.service';
import { MainService } from '../../service/main.service';

@Component({
  selector: 'app-todo-folder-window',
  templateUrl: './todo-folder-window.component.html',
  styleUrls: ['./todo-folder-window.component.scss']
})
export class TodoFolderWindowComponent implements OnInit {

  inputData: any;
  todoFolderForm = this.buildr.group({
    name: this.buildr.control('')
  });

  constructor(private dialog: MatDialog, private ref: MatDialogRef<TodoFolderWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder, private folderService: FolderService, private mainService: MainService) {

  }

  ngOnInit(): void {
    this.inputData = this.data;
    this.todoFolderForm.setValue({ name: this.inputData.taskFolder.name })
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  saveFolder() {
    let taskFolder: Folder = { id: this.inputData.taskFolder.id, name: this.todoFolderForm.value.name };

    this.folderService.store(taskFolder).subscribe(
      (res: Task) => {
        // Inform the user
        this.mainService.openSuccessStatusBar("Created successfully");
      },
      (err) => (this.mainService.openErrorStatusBar("Error: " + err.message))
    );

    this.todoFolderForm.reset();
    this.closePopup();
  }

}
