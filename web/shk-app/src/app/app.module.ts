import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent, ConfirmModalContent } from './app.component';
import { OrdersComponent } from './orders.component';
import { CatalogComponent, ProductModalContent } from './catalog.component';
import { CategoriesComponent } from './categories.component';
import { ContentTypesComponent, ContentTypeModalContent } from './content_types.component';
import { StatisticsComponent } from './stat.component';
import { SettingsComponent } from './settings.component';

import { ContentTypesService } from './services/content_types.service';
import { CategoriesService } from './services/categories.service';
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
        CategoriesComponent,
        ConfirmModalContent
    ],
    providers: [ ContentTypesService, CategoriesService ],
    entryComponents: [ ConfirmModalContent, ProductModalContent, ContentTypeModalContent, CategoriesComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
