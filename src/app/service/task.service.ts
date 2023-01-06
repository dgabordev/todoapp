import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  baseUrl = 'http://localhost/todoapp/api';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${this.baseUrl}/list`).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }
 
  store(task: Task) {
    return this.http.post(`${this.baseUrl}/store`, { data: task }).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  update(task: Task) {
    return this.http.put(`${this.baseUrl}/update`, { data: task });
  }

  delete(id: any) {
    const params = new HttpParams().set('id', id.toString());

    return this.http.delete(`${this.baseUrl}/delete`, { params: params });
  }

  updateItemListData(taskId: number, listId: string, position: number) {
      return this.http.put(`${this.baseUrl}/updateItemListData`, { taskId: taskId, listId: listId, position: position});
  }

  updateItemPositions(tasks: Task[]) {
    return this.http.put(`${this.baseUrl}/updateItemPositions`, { tasks: tasks});
  }

}
