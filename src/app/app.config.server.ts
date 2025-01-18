import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { accountConfig } from './features/account/account.config';
import { appMainConfig } from './features/main/main.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const config = mergeApplicationConfig(
  appConfig,
  serverConfig,
  accountConfig,
  appMainConfig
);
