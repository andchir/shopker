import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {CatalogRoutingModule} from './catalog-routing.module';
import {CatalogComponent} from './catalog.component';
import {CatalogCategoryComponent} from './catalog-category.component';
import {ContentTypesComponent} from './content-types.component';
import {FieldTypesComponent} from './field-types.component';
import {ModalFieldTypeComponent} from './modal-field-type.component';
import {ModalContentTypeComponent} from './modal-content-type.component';
import {ModalProductComponent} from './modal-product.component';
import {ModalContentTypeFieldComponent} from './modal-content-type-field';
import {ModalContentTypeFieldsSortingComponent} from './modal-content-type-fields-sorting';
import {ModalContentTypeFieldsExportComponent} from './modal-content-type-fields-export';
import {CategoriesMenuComponent} from '../components/categories-menu.component';
import {ModalCategoryComponent} from './modal-category';

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
        CategoriesMenuComponent,

        ModalFieldTypeComponent,
        ModalContentTypeComponent,
        ModalContentTypeFieldComponent,
        ModalContentTypeFieldsSortingComponent,
        ModalContentTypeFieldsExportComponent,
        ModalCategoryComponent,
        ModalProductComponent
    ],
    providers: [],
    entryComponents: [
        ModalFieldTypeComponent,
        ModalContentTypeComponent,
        ModalContentTypeFieldComponent,
        ModalContentTypeFieldsSortingComponent,
        ModalContentTypeFieldsExportComponent,
        ModalCategoryComponent,
        ModalProductComponent
    ]
})
export class CatalogModule {
}
