import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './account.routes';
import { AccountModule } from './account.module';

export const accountConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(AccountModule)],
};
