import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbActiveModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule, CalendarModule } from 'primeng/primeng';

import { AppComponent, AlertModalContent, ConfirmModalContent } from './app.component';
import { NotFoundComponent } from './not-found.component';
import { OrdersComponent } from './orders.component';
import { CatalogComponent } from './catalog.component';
import { CatalogCategoryComponent } from './catalog-category.component';
import { ProductModalContent } from './product.component';
import { CategoriesMenuComponent, CategoriesModalComponent, CategoriesListComponent } from './categories.component';
import { ContentTypesComponent, ContentTypeModalContent } from './content-types.component';
import { FieldTypesComponent, FieldTypeModalContent } from './field-types.component';
import { StatisticsComponent } from './stat.component';
import { SettingsComponent } from './settings.component';
import { ListRecursiveComponent } from './list-recursive.component';
import { TableComponent } from './table.component';
import { InputFieldRenderComponent } from './render-input-field';
import { OutputFieldComponent } from './render-output-field';

import { FilterFieldByGroup } from './pipes/filter-field-by-group.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';
import { FilterArrayPipe } from './pipes/filter-array-pipe';

import { ProductsService } from './services/products.service';
import { ContentTypesService } from './services/content_types.service';
import { CategoriesService } from './services/categories.service';
import { AppRoutingModule }     from './app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        EditorModule,
        CalendarModule
    ],
    declarations: [
        AppComponent,
        NotFoundComponent,
        OrdersComponent,
        CategoriesMenuComponent,
        CatalogComponent,
        CatalogCategoryComponent,
        ContentTypesComponent,
        FieldTypesComponent,
        StatisticsComponent,
        SettingsComponent,
        ListRecursiveComponent,
        TableComponent,
        CategoriesListComponent,
        InputFieldRenderComponent,
        OutputFieldComponent,

        FilterFieldByGroup,
        OrderByPipe,
        FilterArrayPipe,

        AlertModalContent,
        ConfirmModalContent,
        ProductModalContent,
        ContentTypeModalContent,
        CategoriesModalComponent,
        FieldTypeModalContent
    ],
    providers: [ ProductsService, ContentTypesService, CategoriesService, NgbActiveModal, NgbTooltipConfig ],
    entryComponents: [
        AlertModalContent,
        ConfirmModalContent,
        ProductModalContent,
        ContentTypeModalContent,
        CategoriesModalComponent,
        FieldTypeModalContent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
