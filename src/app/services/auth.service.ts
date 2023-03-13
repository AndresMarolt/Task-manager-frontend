import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import {shareReplay, tap} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService, private httpClient: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.webService.signup(email, password)
      .pipe(
        shareReplay(),
        tap((response: HttpResponse<any>) => {
          // THE AUTH TOKENS WILL BE IN THE HEADER OF THIS RESPONSE
          this.setSession(response.body._id, response.headers.get('x-refresh-token'), response.headers.get('x-access-token'))
          console.log("SUCCESSFULLY SIGNED UP AND NOW LOGGED IN");
        })
      )
  }

  login(email: string, password: string) {
    return this.webService.login(email, password)
      .pipe(
        shareReplay(),
        tap((response: HttpResponse<any>) => {
          // THE AUTH TOKENS WILL BE IN THE HEADER OF THIS RESPONSE
          this.setSession(response.body._id, response.headers.get('x-refresh-token'), response.headers.get('x-access-token'))
          console.log("LOGGED IN");
        })
      )
  }

  logout() {
    this.deleteSession();
    this.router.navigate(['/login'])
  }

  removeSession() {
    return this.httpClient.delete(`${this.webService.ROOT_URL}/users/session`, {
      headers: {
        '_id': this.getUserId()!,
        'x-refresh-token': this.getRefreshToken()!
      }
    }).subscribe(() => {
      this.deleteSession();
      this.router.navigate(["/login"]);
    })
  }

  getAccessToken(): any {
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem('x-access-token', accessToken)
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token')
  }

  getUserId() {
    return localStorage.getItem('userId')
  }

  private setSession(userId: string, refreshToken: any, accessToken: any) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private deleteSession() {
    localStorage.removeItem('userId');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.httpClient.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken()!,
        '_id': this.getUserId()!
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token')!);
      })
    )
  }
}
