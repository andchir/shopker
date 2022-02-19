import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';

import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from './services/content_types.service';
import {TranslateService} from '@ngx-translate/core';
import {ProductsService} from './services/products.service';
import {Product} from './models/product.model';
import {QueryOptions} from '../models/query-options';
import {Category} from './models/category.model';
import {ContentType} from './models/content_type.model';
import {ModalProductComponent} from './modal-product.component';
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/catalog-category.component.html',
    providers: [DialogService, ConfirmationService, ProductsService]
})
export class CatalogCategoryComponent extends AppTablePageAbstractComponent<Product> implements OnInit, OnDestroy {

    queryOptions: QueryOptions = new QueryOptions(1, 12, 'id', 'desc');
    items: Product[] = [];
    cols: TableField[] = [];
    currentCategory: Category;
    currentContentType: ContentType;
    categoryId: number;
    
    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: ProductsService,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }

    ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                params => {
                    this.categoryId = params.get('categoryId')
                        ? parseInt(params.get('categoryId'), 10)
                        : 0;
                    console.log(this.categoryId);
                }
            );
    }

    getData(event?: any): void {
        console.log('getData');
    }

    getModalComponent() {
        return ModalProductComponent;
    }
}
