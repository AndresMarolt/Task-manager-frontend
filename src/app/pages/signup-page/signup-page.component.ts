import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {

  public form: FormGroup;
  public errorText: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSignupClick(formData: any): any {
    const {email, password} = formData;
    this.authService.signup(email, password).subscribe((res: HttpResponse<any>) => {
      if(res.status === 200) {
        this.router.navigate(['/lists']).then(() => window.location.reload());
      } 
    }, (err) => {
      this.errorText = 'User already exists';
      setTimeout(() => {
        this.errorText = '';
      }, 3000);
    })
  }
}