import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {CatalogRoutingModule} from './catalog-routing.module';
import {CatalogComponent} from './catalog.component';
import {CatalogCategoryComponent} from './catalog-category.component';
import {ContentTypeModalContent, ContentTypesComponent} from './content-types.component';
import {FieldTypeModalContent, FieldTypesComponent} from './field-types.component';
import {ListRecursiveComponent} from '../list-recursive.component';
import {SelectParentDropdownComponent} from './select-parent-dropdown.component';

import {CategoriesListComponent, CategoriesMenuComponent, CategoriesModalComponent} from './categories.component';
import {ProductModalContent} from './product.component';

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
        SelectParentDropdownComponent,
        CategoriesMenuComponent,

        CategoriesModalComponent,
        ProductModalContent,
        ContentTypeModalContent,
        FieldTypeModalContent
    ],
    providers: [
        ProductsService,
        FieldTypesService,
        SystemNameService,
        ContentTypesService,
        CollectionsService,
        CategoriesService,
        FilesService
    ],
    entryComponents: [
        CategoriesModalComponent,
        ProductModalContent,
        ContentTypeModalContent,
        FieldTypeModalContent
    ]
})
export class CatalogModule {
}
