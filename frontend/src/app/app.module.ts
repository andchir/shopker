import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateCustomLoader} from './services/translateLoader';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './shared.module';

import {
    AlertModalContentComponent,
    ConfirmModalContentComponent,
    ModalConfirmTextComponent
} from './components/modal-confirm-text.component';

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
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateCustomLoader
            }
        })
    ],
    declarations: [
        AppComponent,
        AlertModalContentComponent,
        ConfirmModalContentComponent,
        ModalConfirmTextComponent,
    ],
    providers: [],
    entryComponents: [
        AlertModalContentComponent,
        ConfirmModalContentComponent,
        ModalConfirmTextComponent,
    ],
    exports: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
