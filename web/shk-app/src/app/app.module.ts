import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbActiveModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule, TreeNode } from 'primeng/primeng';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateCustomLoader } from './services/translateLoader';

import { AppComponent, AlertModalContent, ConfirmModalContent } from './app.component';
import { NotFoundComponent } from './not-found.component';
import { ModalOrderContent, OrdersComponent } from './orders.component';
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
import { SelectParentDropdownComponent } from './select-parent-dropdown.component';

import { FilterFieldByGroup } from './pipes/filter-field-by-group.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';
import { FilterArrayPipe } from './pipes/filter-array-pipe';

import { AppSettings } from './services/app-settings.service';
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
        HttpClientModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        EditorModule,
        CalendarModule,
        ChipsModule,
        ColorPickerModule,
        TreeModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateCustomLoader
            }
        })
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
        SelectParentDropdownComponent,

        FilterFieldByGroup,
        OrderByPipe,
        FilterArrayPipe,

        AlertModalContent,
        ConfirmModalContent,
        ProductModalContent,
        ContentTypeModalContent,
        CategoriesModalComponent,
        FieldTypeModalContent,
        ModalOrderContent
    ],
    providers: [
        AppSettings,
        ProductsService,
        ContentTypesService,
        CategoriesService,
        NgbActiveModal,
        NgbTooltipConfig
    ],
    entryComponents: [
        AlertModalContent,
        ConfirmModalContent,
        ProductModalContent,
        ContentTypeModalContent,
        CategoriesModalComponent,
        FieldTypeModalContent,
        ModalOrderContent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
