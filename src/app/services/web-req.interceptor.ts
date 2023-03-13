import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError, tap, empty, Subject} from 'rxjs'
import {catchError, switchMap} from 'rxjs/operators'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // HANDLE THE REQUEST
    request = this.addAuthHeader(request);
    
    // CALL next() AND HANDLE THE RESPONSE
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401) {
          return this.refreshAccessToken()
            .pipe(
              switchMap(() => {
                request = this.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError((err: any) => {
                this.authService.logout();
                return empty();
              })
          )
        }
        
        return throwError(() => error);
      })
    )
  }

  addAuthHeader(request: HttpRequest<any>) {
    // GET THE ACCESS TOKEN
    const token = this.authService.getAccessToken();
    if(token) {
      // APPEND THE ACCESS TOKEN TO THE REQUEST HEADER
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }
  
  refreshAccessToken() {
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        	// console.log("Access token refreshed");
      })
    )
  }
}
