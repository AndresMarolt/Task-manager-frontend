import { Injectable } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Task } from '../interfaces/task';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private tasksSubject: BehaviorSubject<any> = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<any> = this.tasksSubject.asObservable();
  
  constructor(private webReqService: WebRequestService, private route: ActivatedRoute) {}

  getTasks(listId: string): void {
    this.webReqService.get(`lists/${listId}/tasks`).subscribe(tasks => {
      this.tasksSubject.next(tasks);
    });
  }

  createListTasks(listId: string, title: string) {
    return this.webReqService.post(`lists/${listId}/tasks`, {title});
  }

  completeTask(task: Task) {
    let isCompleted = task.completed ? true : false; 
    return this.webReqService.patch(`lists/${task.listId}/tasks/${task._id}`, {
      completed: !isCompleted
    })
  }

  deleteTask(listId: string, taskId: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  updateTask(listId: string, taskId: string, title: string) {
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title })
  }
}
