import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private http: HttpClient) { }

  create(endpoint: string, body: any) {
    return this.http.post(environment.apiUrl + endpoint, body);
  }

  read(endpoint: string, queryParams?: any) {
    if (queryParams) {
      let params = new HttpParams();
      Object.keys(queryParams).forEach(key => {
        params = params.append(key, queryParams[key]);
      });
      return this.http.get(environment.apiUrl + endpoint, { params });
    }

    return this.http.get(environment.apiUrl + endpoint);
  }

  update(endpoint: string, body: any) {
    return this.http.put(environment.apiUrl + endpoint, body);
  }

  delete(endpoint: string) {
    return this.http.delete(environment.apiUrl + endpoint);
  }
}
