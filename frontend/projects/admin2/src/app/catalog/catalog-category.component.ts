import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';

import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from './services/content_types.service';
import {FileEditService} from '../code-edit/services/file-edit.service';
import {TranslateService} from '@ngx-translate/core';
import {ProductsService} from './services/products.service';
import {Product} from './models/product.model';

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/catalog-category.component.html',
    providers: [DialogService, ConfirmationService, ProductsService]
})
export class CatalogCategoryComponent extends AppTablePageAbstractComponent<Product> implements OnInit, OnDestroy {

    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: ProductsService,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }

    getModalComponent() {
        return null;
    }
}
