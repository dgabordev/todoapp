import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../model/task';
import { TaskService } from '../service/task.service';
import { TodoItemWindowComponent } from '../components/todo-item-window/todo-item-window.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

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
  
  updateItemIndex!: any;
  updateItemId!: any;
  updateItemList: string = "";

  isEditEnabled: boolean = false;

	editData: any;

  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private taskService: TaskService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTasks();
    this.todoForm = this.fb.group({
      item : ['', Validators.required]
    })
  }

  onEdit(item:Task, i:number, listId:string) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateItemIndex = i;
    this.updateItemId = item.id;
    this.updateItemList = listId;
    this.isEditEnabled = true;
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
					this.showSuccessMessage('Deleted successfully');
				},
				(err) => (this.showErrorMessage(err))
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
            (err) => (this.showErrorMessage(err))
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
            (err) => (this.showErrorMessage(err))
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
            (err) => (this.showErrorMessage(err))
          );
        }
        this.showSuccessMessage('Updated successfully');
      },
      (err) => (this.showErrorMessage(err))
    );

  }

  getTasks(): void {
	this.tasksList = [];
	this.inprogressList = [];
	this.doneList = [];
    this.taskService.getAll().subscribe(
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
        this.showSuccessMessage('List loaded');
      },
      (err) => (this.showErrorMessage(err))
    );
  }

  showSuccessMessage(msg:string) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage='', 3000);
  }

  showErrorMessage(msg:string) {
    console.log(msg);
    this.errorMessage = msg;
    setTimeout(() => this.errorMessage='', 5000);
  }

  addItem() {
    let newTask: Task = { id: null, description: "", list: 't', position: 0, done: false};
    this.openPopup(0, 'Add new todo item', TodoItemWindowComponent, newTask);
  }

  editItem(item:Task, i:number, listId:string) {
    this.updateItemIndex = i;
    this.updateItemId = item.id;
    this.updateItemList = listId;
	this.taskService.get(item.id).subscribe(item => {
		let taskItem: any = item["data"];
		let taskData: Task = { id: taskItem.id, description: taskItem.description, list: 't', position: 0, done: false};
		this.openPopup(0, 'Update todo item', TodoItemWindowComponent, taskData);
	});
  }

  openPopup(code: any, title: any, component: any, item:Task) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      //enterAnimationDuration: '1000ms',
      //exitAnimationDuration: '1000ms',
      data: {
        title: title,
        taskItem: item
      }
    });
    _popup.afterClosed().subscribe(item => {
		this.getTasks();
    })
  }

}
