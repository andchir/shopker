import {CompilerOptions, enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {getTranslationProviders} from './app/i18n-providers';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

getTranslationProviders().then(providers => {
    const options = { providers } as CompilerOptions;
    platformBrowserDynamic().bootstrapModule(AppModule, options);
});
