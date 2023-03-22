import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ListService } from 'src/app/services/list.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' 

@Component({
  selector: 'app-update-list',
  templateUrl: './update-list.component.html',
  styleUrls: ['./update-list.component.scss']
})
export class UpdateListComponent {

  public form: FormGroup;
  public currentListEditing;
  
  constructor(
    private listService: ListService, 
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]]
    })
    this.currentListEditing = this.data.lists.find((list: any) => list._id === this.data.currentListId )
  }

  updateList(title: string) {
    let {currentListId} = this.data;
    this.listService.updateList(title, currentListId).subscribe((response: any) => {
      this.dialogRef.close();
    });
  }
}
