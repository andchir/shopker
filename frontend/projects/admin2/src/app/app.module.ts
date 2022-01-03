import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_BASE_HREF, CommonModule} from '@angular/common';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateCustomLoader} from '@app/services/translateLoader';

import {SharedModule} from './shared.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateCustomLoader
            }
        })
    ],
    entryComponents: [
        
    ],
    providers: [{
        provide: APP_BASE_HREF, useValue: '/admin/'
    }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
