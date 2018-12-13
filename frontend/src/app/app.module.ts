import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

import {AppComponent, AlertModalContentComponent, ConfirmModalContentComponent} from './app.component';
import {NotFoundComponent} from './not-found.component';
import {SharedModule} from './shared.module';
import {AppSettings} from './services/app-settings.service';
import {AppRoutingModule} from './app-routing.module';
import {TranslateCustomLoader} from './services/translateLoader';

import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeEn, 'en-EN');
registerLocaleData(localeRu, 'ru-RU');

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateCustomLoader
            }
        }),
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        NotFoundComponent,
        AlertModalContentComponent,
        ConfirmModalContentComponent,
    ],
    providers: [
        AppSettings
    ],
    entryComponents: [
        AlertModalContentComponent,
        ConfirmModalContentComponent,
    ],
    exports: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
