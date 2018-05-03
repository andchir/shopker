import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateCustomLoader} from './services/translateLoader';

import {AppComponent, AlertModalContent, ConfirmModalContent} from './app.component';

import {NotFoundComponent} from './not-found.component';
// import {CatalogComponent} from './catalog.component';
// import {CatalogCategoryComponent} from './catalog-category.component';
// import {ProductModalContent} from './product.component';
// import {CategoriesMenuComponent, CategoriesModalComponent, CategoriesListComponent} from './categories.component';
// import {ContentTypesComponent, ContentTypeModalContent} from './content-types.component';
// import {FieldTypesComponent, FieldTypeModalContent} from './field-types.component';
import {StatisticsComponent} from './stat.component';
import {ListRecursiveComponent} from './list-recursive.component';
import {SelectParentDropdownComponent} from './select-parent-dropdown.component';

// import {FilterFieldByGroupPipe} from './pipes/filter-field-by-group.pipe';
// import {OrderByPipe} from './pipes/orderby.pipe';
// import {FilterArrayPipe} from './pipes/filter-array-pipe';
// import {DateFromObjectPipe} from './pipes/date-from-object.pipe';
// import {UserRoleColorPipe, UserRoleNamePipe} from './pipes/user-role.pipe';

import {SharedModule} from './shared.module';
import {AppSettings} from './services/app-settings.service';
import {ProductsService} from './services/products.service';
import {ContentTypesService} from './services/content_types.service';
import {CategoriesService} from './services/categories.service';
import {AppRoutingModule}     from './app-routing.module';

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
        //OrdersModule,
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
        //CategoriesMenuComponent,
        //CatalogComponent,
        //CatalogCategoryComponent,
        //ContentTypesComponent,
        //FieldTypesComponent,
        StatisticsComponent,
        //SettingsComponent,
        //ListRecursiveComponent,
        //CategoriesListComponent,
        //SelectParentDropdownComponent,

        AlertModalContent,
        ConfirmModalContent,
        //ProductModalContent,
        //ContentTypeModalContent,
        //CategoriesModalComponent,
        //FieldTypeModalContent
    ],
    providers: [
        AppSettings,
        ProductsService,
        ContentTypesService,
        CategoriesService
    ],
    entryComponents: [
        AlertModalContent,
        ConfirmModalContent,
        //ProductModalContent,
        //ContentTypeModalContent,
        //CategoriesModalComponent,
        //FieldTypeModalContent
    ],
    exports: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
