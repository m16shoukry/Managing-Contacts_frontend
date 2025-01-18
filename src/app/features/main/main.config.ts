import {
  ApplicationConfig,
  importProvidersFrom,
  mergeApplicationConfig,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MainModule } from './main.module';
import { routes } from './main.routes';

const mainConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(MainModule)],
};

export const appMainConfig = mergeApplicationConfig(mainConfig);
