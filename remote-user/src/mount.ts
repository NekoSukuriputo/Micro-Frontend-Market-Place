import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'zone.js';

export const mount = (el: HTMLElement) => {
  const appRoot = document.createElement('app-root');
  el.appendChild(appRoot);
  
  const ref = bootstrapApplication(AppComponent, appConfig);
  ref.catch((err) => console.error(err));

  return () => {
    ref.then((appRef) => {
      appRef.destroy();
      appRoot.remove();
    });
  };
};
