import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  base_URL = environment.BASE_URL;


  constructor(private http: HttpClient) { }


  // post UUID for token
  getUUID(endpoint: string, uuid: any) {
    return this.http.post(this.base_URL + endpoint, uuid)
  }


  // post add form
  postAddForm(endpoint: string, reqBody: any) {
    return this.http.post(this.base_URL + endpoint, reqBody)
  }
}
