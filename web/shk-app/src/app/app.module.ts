import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent, ConfirmModalContent } from './app.component';
import { OrdersComponent } from './orders.component';
import { CatalogComponent, ProductModalContent, CategoryModalContent } from './catalog.component';
import { ContentTypesComponent, ContentTypeModalContent } from './content_types.component';
import { StatisticsComponent } from './stat.component';
import { SettingsComponent } from './settings.component';

import { ContentTypesService } from './services/content_types.service';
import { AppRoutingModule }     from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//enableProdMode();
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        NgbModule.forRoot()
    ],
    declarations: [
        AppComponent,
        OrdersComponent,
        CatalogComponent,
        ContentTypesComponent,
        StatisticsComponent,
        SettingsComponent,
        ProductModalContent,
        ContentTypeModalContent,
        CategoryModalContent,
        ConfirmModalContent
    ],
    providers: [ ContentTypesService ],
    entryComponents: [ ConfirmModalContent, ProductModalContent, ContentTypeModalContent, CategoryModalContent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
