import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ListService } from 'src/app/services/list.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' 

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent {

  public form: FormGroup;
  
  constructor(
    private listService: ListService, 
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<NewListComponent>,
    ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]]
    })
  }

  createNewList(title: string) {
    this.listService.createList(title).subscribe((response: any) => {
      this.dialogRef.close();
    });
  }
}
