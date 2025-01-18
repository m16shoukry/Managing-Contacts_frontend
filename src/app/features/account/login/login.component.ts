import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorHandlerService } from '../../../services/error-handle/error-handle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastrModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible = false;

  private authService = inject(AuthService);
  private errorHandlerService = inject(ErrorHandlerService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  constructor() {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { userName, password } = this.loginForm.value;
    this.authService.login({ userName, password }).subscribe({
      next: (res: any) => {
        if (!res.isSuccess) {
          return this.errorHandlerService.handle(res);
        }

        const { token, expireInSeconds } = res.data;

        this.authService.onLoginSuccess({
          token,
          expireInSeconds,
        });

        this.toastr.success(res.message, '', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
          closeButton: true,
        });

        return this.router.navigate(['/app/contacts']);
      },
      error: (err) => {
        this.errorHandlerService.handle(err);
      },
    });
  }

  togglePasswordVisibility(field: string): void {
    const input = document.getElementById(field) as HTMLInputElement;
    this.passwordVisible = !this.passwordVisible;
    input.type = this.passwordVisible ? 'text' : 'password';
  }
}
