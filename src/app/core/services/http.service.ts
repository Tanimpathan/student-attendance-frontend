import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Make a GET request
   * @param endpoint - The API endpoint
   * @param params - Optional query parameters
   * @param headers - Optional headers
   * @returns Observable of response
   */
  get<T>(endpoint: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params, headers });
  }

  /**
   * Make a POST request
   * @param endpoint - The API endpoint
   * @param body - The request body
   * @param headers - Optional headers
   * @returns Observable of response
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, { headers });
  }

  /**
   * Make a PUT request
   * @param endpoint - The API endpoint
   * @param body - The request body
   * @param headers - Optional headers
   * @returns Observable of response
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, { headers });
  }

  /**
   * Make a DELETE request
   * @param endpoint - The API endpoint
   * @param headers - Optional headers
   * @returns Observable of response
   */
  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { headers });
  }
}