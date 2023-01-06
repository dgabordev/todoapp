import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../model/task';
import { TaskService } from '../service/task.service';

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

  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private taskService: TaskService) { }

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

  addTask() {
    let newTask: Task = { id:null, description: this.todoForm.value.item, list:'t', position: 0, done:false};

    this.taskService.store(newTask).subscribe(
      (res: Task) => {
        // Update the list of cars
        this.tasksList.push({
          id: res.id,
          description: res.description,
          list: "t",
          position: 0,
          done: false
        });
    
        // Inform the user
        this.showSuccessMessage('Created successfully');
      },
      (err) => (this.showErrorMessage(err.message))
    );

    this.todoForm.reset();
  }

  updateTask() {
    let updatedTask: Task = { id:this.updateItemId, description: this.todoForm.value.item, list:this.updateItemList, position: 0, done:false};
    if (this.updateItemList=="d") {
      updatedTask.done = true;
    }
    this.taskService.update(updatedTask).subscribe(
      (res) => {
        if (this.updateItemList=="t") {
          this.tasksList[this.updateItemIndex] = updatedTask;
        }
        if (this.updateItemList=="p") {
          this.inprogressList[this.updateItemIndex] = updatedTask;
        }
        if (this.updateItemList=="d") {
          this.doneList[this.updateItemIndex] = updatedTask;
        }
        this.showSuccessMessage('Updated successfully');
        this.updateItemIndex = undefined;
        this.isEditEnabled = false;
        },
      (err) => (this.showErrorMessage(err))
      );
      this.todoForm.reset();
  }

  deleteTask(item:Task, i:number, listId:string) {
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

}
