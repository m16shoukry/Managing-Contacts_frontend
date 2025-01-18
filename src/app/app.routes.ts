import { Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { ErrorComponent } from './components/error/error.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'account',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import(`./features/account/account.routes`).then(
        (routes) => routes.routes
      ),
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(`./features/main/main.routes`).then((routes) => routes.routes),
  },
  {
    path: '',
    redirectTo: '/app/contacts',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: ErrorComponent,
  },
];
