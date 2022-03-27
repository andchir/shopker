import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
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
import {CategoriesService} from './services/categories.service';

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
        private categoriesService: CategoriesService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.menuItems.push({
            label: this.getLangString('DISABLE_ENABLE'),
            icon: 'pi pi-times-circle',
            command: () => {
                this.blockSelected();
            }
        });
        this.route.paramMap
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                params => {
                    this.categoryId = params.get('categoryId')
                        ? parseInt(params.get('categoryId'), 10)
                        : 0;
                    this.openCategory();
                }
            );
    }

    getContentType(): Observable<ContentType> {
        return this.contentTypesService
            .getItemByName(this.currentCategory.contentTypeName);
    }

    openCategoryFromMenu(event): void {
        console.log('openCategoryFromMenu', event);
        // this.router.navigate(['/catalog/category', event.node['id']]);
    }

    openCategory(): void {
        this.dataService.setRequestUrl(`/admin/products/${this.categoryId}`);
        this.categoriesService.getItem(this.categoryId)
            .subscribe({
                next: (data) => {
                    this.currentCategory = data;
                    this.currentContentType = data.contentType;
                    this.updateTableConfig();
                    this.getData();
                },
                error: () => {
                    this.loading = false;
                }
            });
    }

    getData(event?: any): void {
        if (!this.currentContentType) {
            return;
        }
        super.getData();
    }

    getModalComponent() {
        return ModalProductComponent;
    }

    updateTableConfig(): void {
        if (!this.currentContentType) {
            return;
        }
        this.cols = [];
        this.currentContentType.fields.forEach((field) => {
            this.cols.push({
                field: field.name,
                header: field.title,
                outputType: field.outputType,
                outputProperties: field.outputProperties
            });
        });
        this.cols.unshift({
            field: 'id',
            header: 'ID',
            outputType: 'text-center',
            outputProperties: {}
        });
        this.cols.push({
            field: 'isActive',
            header: 'STATUS',
            outputType: 'boolean',
            outputProperties: {}
        });
    }
}
