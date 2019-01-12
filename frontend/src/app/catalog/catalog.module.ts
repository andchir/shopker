import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {CatalogRoutingModule} from './catalog-routing.module';
import {CatalogComponent} from './catalog.component';
import {CatalogCategoryComponent} from './catalog-category.component';
import {ContentTypeModalContentComponent, ContentTypesComponent} from './content-types.component';
import {FieldTypeModalContentComponent, FieldTypesComponent} from './field-types.component';
import {ListRecursiveComponent} from '../list-recursive.component';

import {CategoriesListComponent, CategoriesMenuComponent, CategoriesModalComponent} from './categories.component';
import {ProductModalContentComponent} from './product.component';

import {ProductsService} from './services/products.service';
import {SystemNameService} from '../services/system-name.service';
import {ContentTypesService} from './services/content_types.service';
import {CollectionsService} from './services/collections.service';
import {CategoriesService} from './services/categories.service';
import {FilesService} from './services/files.service';
import {FieldTypesService} from './services/field-types.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CatalogRoutingModule
    ],
    declarations: [
        CatalogComponent,
        CatalogCategoryComponent,
        ContentTypesComponent,
        FieldTypesComponent,
        ListRecursiveComponent,
        CategoriesListComponent,
        CategoriesMenuComponent,

        CategoriesModalComponent,
        ProductModalContentComponent,
        ContentTypeModalContentComponent,
        FieldTypeModalContentComponent
    ],
    providers: [
        ProductsService,
        FieldTypesService,
        CollectionsService,
        FilesService
    ],
    entryComponents: [
        CategoriesModalComponent,
        ProductModalContentComponent,
        ContentTypeModalContentComponent,
        FieldTypeModalContentComponent
    ]
})
export class CatalogModule {
}
