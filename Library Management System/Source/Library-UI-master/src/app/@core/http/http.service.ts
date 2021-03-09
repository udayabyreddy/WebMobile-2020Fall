import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiEndPoint = 'http://localhost:3000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) {}

  getData(apiURL: string): Observable<any> {
    const finalUrl = this.apiEndPoint + apiURL;
    return this.http
      .get<any>(finalUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  postData(apiURL: string, body: any | null): Observable<any> {
    const finalUrl = this.apiEndPoint + apiURL;
    return this.http
      .post<any>(finalUrl, body, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  putData(apiURL: string, body: any): Observable<any> {
    const finalUrl = this.apiEndPoint + apiURL;
    return this.http
      .put<any>(finalUrl, body, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteData(apiURL: string): Observable<any> {
    const finalUrl = this.apiEndPoint + apiURL;
    return this.http
      .delete<any>(finalUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);

    return throwError(errorMessage);
  }
}
