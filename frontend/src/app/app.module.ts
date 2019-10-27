import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppRoutingModule} from './app-routing.module';
import {TranslateCustomLoader} from './services/translateLoader';

import {AppComponent} from './app.component';
import {NotFoundComponent} from './not-found.component';
import {ModuleLoaderComponent} from './moduleloader/moduleloader.component';
import {SharedModule} from './shared.module';
import {AppSettings} from './services/app-settings.service';
import {FileManagerComponent} from './components/file-manager.component';
import {ModalFileContentComponent} from './components/modal-file.component';

import {
    AlertModalContentComponent,
    ConfirmModalContentComponent,
    ModalConfirmTextComponent
} from './components/modal-confirm-text.component';
import {ModalFileUploadContentComponent} from './components/modal-file-upload.component';

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
        ModuleLoaderComponent,
        AlertModalContentComponent,
        ConfirmModalContentComponent,
        FileManagerComponent,
        ModalFileContentComponent,
        ModalConfirmTextComponent,
        ModalFileUploadContentComponent
    ],
    providers: [],
    entryComponents: [
        AlertModalContentComponent,
        ConfirmModalContentComponent,
        ModalFileContentComponent,
        ModalConfirmTextComponent,
        ModalFileUploadContentComponent
    ],
    exports: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
