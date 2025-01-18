import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponseDto } from '../models/login/LoginResponseDto';
import { AppConsts } from '../shared/utils/AppConsts';
import moment from 'moment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.remoteServiceBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  onLoginSuccess(result: LoginResponseDto): void {
    const tokenExpireDate = new Date(
      new Date().getTime() + 1000 * result.expireInSeconds!
    );
    this.setToken(result.token, tokenExpireDate);
  }

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  setToken(token: string, expiresAt: Date) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(
        AppConsts.authorization.encrptedAuthTokenName,
        token
      );
      localStorage.setItem(
        AppConsts.authorization.tokenExpiration,
        JSON.stringify(expiresAt.valueOf())
      );
    }
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(
        AppConsts.authorization.encrptedAuthTokenName
      );
    }
    return null;
  }

  getTokenExpiration(): moment.Moment {
    if (this.isLocalStorageAvailable()) {
      const expiration = localStorage.getItem(
        AppConsts.authorization.tokenExpiration
      );
      if (expiration) {
        return moment(JSON.parse(expiration));
      }
    }
    return moment(0);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpiration();
    return !!token && moment().isBefore(expiration);
  }

  logout(): void {
    this.clearLocalStorage();
    this.router.navigate(['/login']);
  }

  clearLocalStorage(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(AppConsts.authorization.encrptedAuthTokenName);
      localStorage.removeItem(AppConsts.authorization.tokenExpiration);
    }
  }
}
