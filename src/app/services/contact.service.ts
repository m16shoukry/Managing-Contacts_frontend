import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = `${environment.remoteServiceBaseUrl}/contacts`;

  constructor(private http: HttpClient) {}

  createContact(data: {}): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, data);
  }

  listContacts(queryParams: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: queryParams });
  }

  updateContact(contactId: string, data: {}): Observable<any> {
    return this.http.put(`${this.apiUrl}/${contactId}`, data);
  }

  deleteContact(contactId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${contactId}`);
  }

  lockContact(contactId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${contactId}/lock`, {});
  }
}
