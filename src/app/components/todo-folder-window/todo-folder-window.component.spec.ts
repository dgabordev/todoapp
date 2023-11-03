import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoFolderWindowComponent } from './todo-folder-window.component';

describe('TodoFolderWindowComponent', () => {
  let component: TodoFolderWindowComponent;
  let fixture: ComponentFixture<TodoFolderWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoFolderWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoFolderWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
