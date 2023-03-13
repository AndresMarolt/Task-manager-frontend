import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ListService } from 'src/app/services/list.service';
import { TaskService } from 'src/app/services/task.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' 
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  public form: FormGroup;
  listsSubscription: Subscription;
  tasksSubscription: Subscription;
  
  constructor(
    private listService: ListService,
    private taskService: TaskService,
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<NewTaskComponent>, 
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public listId: any
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]]
    })
  };
  
  ngOnInit(): void {
    console.log(this.listId);
  }

  createNewTask(title: string) {
    this.taskService.createListTasks(this.listId, title).subscribe((response: any) => {
      this.taskService.getTasks(this.listId);
      // console.log(this.taskService.getTasks(this.listId));
      this.dialogRef.close();
    });
  }
}
