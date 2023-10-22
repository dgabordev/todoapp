import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemWindowComponent } from './todo-item-window.component';

describe('TodoItemWindowComponent', () => {
  let component: TodoItemWindowComponent;
  let fixture: ComponentFixture<TodoItemWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoItemWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoItemWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
