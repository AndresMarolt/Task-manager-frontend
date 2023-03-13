import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TaskService } from 'src/app/services/task.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' 

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent {

  public form: FormGroup;
  public currentTaskEditing: any;
  
  constructor(
    private taskService: TaskService, 
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]]
    })

    this.currentTaskEditing = data.task;
  }

  updateTask(title: string) {
    let {currentListId, task} = this.data;
    this.taskService.updateTask(currentListId, task._id, title).subscribe((response: any) => {
      this.taskService.getTasks(currentListId);
      this.dialogRef.close();
    });
  }
}
