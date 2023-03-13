import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { NewListComponent } from '../new-list/new-list.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog'
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Route } from '@angular/router';
import { NewTaskComponent } from '../new-task/new-task.component';
import { Subscription } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/interfaces/task';
import { List } from 'src/app/interfaces/list';
import { UpdateListComponent } from '../update-list/update-list.component';
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  currentListId: string;
  lists: List[];
  tasks: Task[];

  listId: string;
  listsSubscription: Subscription;
  tasksSubscription: Subscription;
  
  constructor(
    private listService: ListService, 
    private taskService: TaskService, 
    private authService: AuthService,
    public dialog: MatDialog, 
    private route: ActivatedRoute, 
    public router: Router
    ) {
    this.listsSubscription = this.listService.lists$.subscribe(lists => {
      this.lists = lists;
    })

    this.tasksSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      console.log("TASKS");
      console.log(this.tasks);
    })
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(p => {
      if(p.listId) {
        this.currentListId = p.listId;
        this.taskService.getTasks(this.currentListId);
      }
    })
  }

  openListsDialog(): void {
    this.dialog.open(NewListComponent, {
      data: this.currentListId
    });
  }

  openTasksDialog(): void { 
    this.dialog.open(NewTaskComponent, {
      data: this.currentListId
    });
  }

  onClickTask(args: any) {
    let {task, event} = args;
    if(event.target.classList.contains('task')) {
      this.taskService.completeTask(task).subscribe((res) => {
        this.taskService.getTasks(this.currentListId);
        console.log("Completed successfully!");
      })
    }

  }

  onTaskDeleteClick(taskId: any) {
    this.taskService.deleteTask(this.currentListId, taskId).subscribe(() => {
      this.taskService.getTasks(this.currentListId);
    })
  }

  onTaskEditClick(task: any) {
    this.dialog.open(UpdateTaskComponent, {
      data: {currentListId: this.currentListId, task}
    })
  }

  deleteList() {
    this.listService.deleteList(this.currentListId).subscribe(() => {
      
    })
  }

  onClickEditList() {
    this.dialog.open(UpdateListComponent, {
      data: {currentListId: this.currentListId, lists: this.lists}
    });
  }

  removeSession() {
    this.authService.removeSession();
  }
}
