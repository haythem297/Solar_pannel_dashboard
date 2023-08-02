import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private Http: HttpClient) { }
  ReturnUrl: string;

  SubmitPasswordReset(Model){
    return this.Http.post<any>(environment.ApiUrl + 'api/users/submit-password-reset.php', JSON.stringify(Model))
      .pipe(map(Response => {
        return Response;
      }),
      catchError((error) => {
        return throwError(error.error);
      }));
  }

  UserLogin(Model) {
    return this.Http.post<any>(environment.ApiUrl + 'api/users/login.php', JSON.stringify(Model))
      .pipe(map(AdminModel => {
        if (AdminModel && AdminModel.token) {
          this.saveToke(AdminModel.token);
          localStorage.setItem('CurrentUser', JSON.stringify(AdminModel));
          localStorage.setItem('id', AdminModel.id)
          localStorage.setItem('firstname', AdminModel.firstname)
          localStorage.setItem('lastname', AdminModel.lastname)
          localStorage.setItem('email', AdminModel.email)
          localStorage.setItem('role', AdminModel.role)
          return AdminModel;
        }
      }),
      catchError((error) => {
        return throwError(error.error.message);
      }))
  }

  saveNewUser(Model){
    return this.Http.post<any>(environment.ApiUrl + 'api/users/create.php', JSON.stringify(Model))
    .pipe(map(result => {
      if (result) {
        return result;
      }
    }),
    catchError((error) => {
      return throwError(error.error);
    })); 
  }

  saveUpdateUser(Model):any{
    return this.Http.put<any>(environment.ApiUrl + 'api/users/update.php', JSON.stringify(Model))
    .pipe(map(result => {
      if (result) {
        return result;
      }
    }),
    catchError((error) => {
      return throwError(error.error);
    }));
  }
  
  deleteUser(id):any{
    const data = {id_user:id};
    return this.Http.post<any>(environment.ApiUrl + 'api/users/delete.php',JSON.stringify(data))
    .pipe(map(result => {
      if (result) {
        return result;
      }
    }),
    catchError((error) => {
      return throwError(error.error);
    }));
  }

  LogOutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('CurrentUser');
    localStorage.clear();
  }
  
  Isloggin() {
    if (this.getToken() != null) {
      return true;
    } else { return false; }
  }

  saveToke(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  errorHandle(error){
    let errormgs = '';
    if (error.error instanceof ErrorEvent){
      errormgs = error.error.message;
    }else{
      errormgs = `Error Code :${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errormgs);
  }

  getAllUsers():Observable<any> {
    return this.Http.get(environment.ApiUrl+'api/users/list.php').pipe(retry(1),catchError(this.errorHandle)); 
  }

  conutUsers():Observable<any>{
    return this.Http.get(environment.ApiUrl+'api/users/count.php').pipe(retry(1),catchError(this.errorHandle)); 
  }

  conutPasswordsReset():Observable<any>{
    return this.Http.get(environment.ApiUrl+'api/users/count_passwords_reset.php').pipe(retry(1),catchError(this.errorHandle)); 
  }

  getAllPasswordResetRequests():Observable<any> {
    return this.Http.get(environment.ApiUrl+'api/users/reset-requests.php').pipe(retry(1),catchError(this.errorHandle)); 
  }

  getConfigsMqtt():Observable<any>{
    return this.Http.get(environment.ApiUrl+'api/configs/fetch.php').pipe(retry(1),catchError(this.errorHandle));
  }

  saveConfigsMqtt(Model):any{
    return this.Http.post<any>(environment.ApiUrl + 'api/configs/save.php', JSON.stringify(Model))
    .pipe(map(result => {
      if (result) {
        return result;
      }
    }),
    catchError((error) => {
      return throwError(error.error);
    })); 
  }

  resetPasswordUser(id){
    let data = {idUser:id}
    return this.Http.post<any>(environment.ApiUrl + 'api/users/reset-password-user.php', JSON.stringify(data))
      .pipe(map(Response => {
        return Response;
      }),
      catchError((error) => {
        return throwError(error.error);
      }));
  }

  test():Observable<any>{
    return this.Http.get(environment.ApiUrl+'api/test.php').pipe(retry(1),catchError(this.errorHandle));
  }
}
