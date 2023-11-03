import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../model/task';
import { TaskService } from '../service/task.service';
import { TodoItemWindowComponent } from '../components/todo-item-window/todo-item-window.component';
import { Folder } from '../model/folder';
import { FolderService } from '../service/folder.service';
import { TodoFolderWindowComponent } from '../components/todo-folder-window/todo-folder-window.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent implements OnInit {

  todoForm !: FormGroup;
  
  tasksList: Task[] = [];
  inprogressList: Task[] = [];
  doneList: Task[] = [];
  foldersList: { id: number, name: string}[] = [];
  currentFolder: 0;

  constructor(private fb: FormBuilder, private taskService: TaskService, private folderService: FolderService, 
	private dialog: MatDialog, private mainService: MainService) { }

  ngOnInit(): void {
    this.getFolders();
    this.getTasks(0);
    this.todoForm = this.fb.group({
      item : ['', Validators.required]
    })
  }

  deleteTask(item:Task, i:number, listId:string) {
    const message = `Are you sure you want to delete this item?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.taskService.delete(item.id).subscribe(
          (res) => {
            if (listId=="t") {
            this.tasksList.splice(i,1);
            }
            if (listId=="p") {
            this.inprogressList.splice(i,1);
            }
            if (listId=="d") {
            this.doneList.splice(i,1);
            }
            //console.log('Deleted successfully');
          },
          (err) => ( this.mainService.openErrorStatusBar("Error: " + err) )
        );
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.taskService.updateItemListData(event.item.data.id, event.container.id, event.currentIndex).subscribe(
      (res) => {
        if (event.container.id=="list-todo") {
          this.tasksList[event.currentIndex].list='t';
          let pos = 0;
          this.tasksList.forEach((taskItem) => {
            taskItem.position = pos++;
          });
          this.taskService.updateItemPositions(this.tasksList).subscribe(
            (res) => {},
            (err) => ( this.mainService.openErrorStatusBar("Error: " + err) )
          );
        }
        if (event.container.id=="list-inprogress") {
          this.inprogressList[event.currentIndex].list='p';
          let pos = 0;
          this.inprogressList.forEach((taskItem) => {
            taskItem.position = pos++;
          });
          this.taskService.updateItemPositions(this.inprogressList).subscribe(
            (res) => {},
            (err) => ( this.mainService.openErrorStatusBar("Error: " + err) )
          );
        }
        if (event.container.id=="list-done") {
          this.doneList[event.currentIndex].list='d';
          let pos = 0;
          this.doneList.forEach((taskItem) => {
            taskItem.position = pos++;
          });
          this.taskService.updateItemPositions(this.doneList).subscribe(
            (res) => {},
            (err) => ( this.mainService.openErrorStatusBar("Error: " + err) )
          );
        }
        //console.log('Updated successfully');
      },
      (err) => ( this.mainService.openErrorStatusBar("Error: " + err) )
    );

  }

  getTasks(id: any): void {
    this.tasksList = [];
    this.inprogressList = [];
    this.doneList = [];
    this.taskService.getAllByFolder(id).subscribe(
      (data: Task[]) => {
        data.forEach((taskItem) => {
          if (taskItem.list=='t') {
            this.tasksList.push(taskItem);
          }
          if (taskItem.list=='p') {
            this.inprogressList.push(taskItem);
          }
          if (taskItem.list=='d') {
            this.doneList.push(taskItem);
          }
        });
        //console.log('List loaded');
      },
      (err) => ( this.mainService.openErrorStatusBar("Error: " + err) )
    );
  }

  addItem() {
    let newTask: Task = { id: null, folder_id: 0, description: "", list: 't', position: 0, done: false };
    this.openItemPopup(0, 'Add new todo item', TodoItemWindowComponent, newTask);
  }

  editItem(item:Task, i:number, listId:string) {
    this.taskService.get(item.id).subscribe(item => {
      let taskItem: any = item["data"];
      let taskData: Task = { id: taskItem.id, folder_id: taskItem.folder_id, description: taskItem.description, list: 't', position: 0, done: false };
      this.openItemPopup(0, 'Update todo item', TodoItemWindowComponent, taskData);
    });
  }

  openItemPopup(code: any, title: any, component: any, item:Task) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      data: {
        title: title,
        taskItem: item
      }
    });
    _popup.afterClosed().subscribe(item => {
		this.getTasks(this.currentFolder);
    })
  }

  addFolder() {
    let newFolder: Folder = { id: null, name: "" };
    this.openFolderPopup(0, 'Add new todo folder', TodoFolderWindowComponent, newFolder);
  }

  editFolder(folderId:any) {
    this.folderService.get(folderId).subscribe(item => {
      let folderItem: any = item["data"];
      let folderData: Folder = { id: folderItem.id, name: folderItem.name };
      this.openFolderPopup(0, 'Update todo folder', TodoFolderWindowComponent, folderData);
    });
  }

  openFolderPopup(code: any, title: any, component: any, folder:Folder) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      data: {
        title: title,
        taskFolder: folder
      }
    });
    _popup.afterClosed().subscribe(item => {
		this.getFolders();
    })
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

  showFolderItems(id: any) {
    this.currentFolder = id;
    this.getTasks(this.currentFolder);
  }

}
