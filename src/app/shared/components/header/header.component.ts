import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userProfileImage: string = '../../../../assets/images/';

  private authService = inject(AuthService);

  constructor() {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }
}
