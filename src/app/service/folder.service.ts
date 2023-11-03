import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Folder } from '../model/folder';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  
  baseUrl = 'http://localhost/todoapp/api/folders';

  constructor(private http: HttpClient) { }

  get(id: any) {
    const params = new HttpParams().set('id', id.toString());

    return this.http.get(`${this.baseUrl}/get`, { params: params });
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/list`).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }
 
  store(folder: Folder) {
    return this.http.post(`${this.baseUrl}/store`, { data: folder }).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  update(folder: Folder) {
    return this.http.put(`${this.baseUrl}/update`, { data: folder });
  }

  delete(id: any) {
    const params = new HttpParams().set('id', id.toString());

    return this.http.delete(`${this.baseUrl}/delete`, { params: params });
  }
}
