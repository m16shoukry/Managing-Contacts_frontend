import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = `${environment.remoteServiceBaseUrl}/contacts`;
  private lockStatusSubject: Subject<any> = new Subject<any>();
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  startContactLockSSE(): void {
    const token = this.authService.getToken();
    const eventSourceUrl = `${
      this.apiUrl
    }/contact-locks?token=${encodeURIComponent(token!)}`;

    this.eventSource = new EventSource(eventSourceUrl);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.lockStatusSubject.next(data);
      } catch (error) {
        console.error('Error parsing SSE event data:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.stopContactLockSSE();
    };
  }

  stopContactLockSSE(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  getLockStatusUpdates(): Observable<any> {
    return this.lockStatusSubject.asObservable();
  }
}
