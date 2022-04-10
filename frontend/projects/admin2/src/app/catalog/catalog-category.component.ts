import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {take, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {OverlayPanel} from 'primeng/overlaypanel';
import {TranslateService} from '@ngx-translate/core';

import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from './services/content_types.service';
import {ProductsService} from './services/products.service';
import {Product} from './models/product.model';
import {QueryOptions} from '../models/query-options';
import {Category} from './models/category.model';
import {ContentType} from './models/content_type.model';
import {ModalProductComponent} from './modal-product.component';
import {CategoriesService} from './services/categories.service';
import {ModalCategoryComponent} from './modal-category';

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/catalog-category.component.html',
    providers: [DialogService, ConfirmationService, ProductsService]
})
export class CatalogCategoryComponent extends AppTablePageAbstractComponent<Product> implements OnInit, OnDestroy {
    
    @ViewChild('panelTopMenu') panelTopMenu: OverlayPanel;
    
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
            .subscribe({
                next: params => {
                    this.categoryId = params.get('categoryId')
                        ? parseInt(params.get('categoryId'), 10)
                        : 0;
                    this.openCategory();
                },
                error: (e) => {
                    console.log(e);
                }
            });
        this.openCategory();
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
        this.loading = true;
        this.dataService.setRequestUrl(`/admin/products/${this.categoryId}`);
        this.categoriesService.getItem(this.categoryId)
            .subscribe({
                next: (data) => {
                    this.currentCategory = data;
                    this.currentContentType = data.contentType;
                    this.updateTableConfig();
                    setTimeout(this.getData.bind(this), 1);
                },
                error: () => {
                    this.loading = false;
                }
            });
    }

    getData(event?: any): void {
        if (!this.currentContentType) {
            this.loading = false;
            return;
        }
        super.getData();
    }

    getModalComponent() {
        return ModalProductComponent;
    }

    openModal(item: Product, event?: MouseEvent): void {
        this.panelTopMenu.hide();
        super.openModal(item, event);
    }

    updateTableConfig(): void {
        if (!this.currentContentType) {
            return;
        }
        this.cols = [];
        this.currentContentType.fields.forEach((field) => {
            if (field.showInTable) {
                this.cols.push({
                    field: field.name,
                    header: field.title,
                    outputType: field.outputType,
                    outputProperties: field.outputProperties
                });
            }
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

    onCategoryUpdated(category: Category): void {
        if (!category || !category.title) {
            return;
        }
        this.currentCategory.title = category.title;
        this.panelTopMenu.hide();
    }

    openCategoryModal(itemId?: number, isItemCopy: boolean = false): void {
        const data = {
            id: itemId
        };
        const ref = this.dialogService.open(ModalCategoryComponent, {
            header: typeof itemId !== 'undefined'
                ? (itemId ? this.getLangString('CATEGORY') + ` #${itemId}` : this.getLangString('ROOT_FOLDER'))
                : this.getLangString('ADD_NEW_CATEGORY'),
            width: '800px',
            data
        });
        ref.onClose
            .pipe(take(1))
            .subscribe({
                next: (result) => {
                    if (result !== 'canceled') {
                        if (result && result.title) {
                            this.currentCategory.title = result.title;
                        }
                    }
                }
            });
    }

    openModalCategory(itemId?: number, isItemCopy: boolean = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        setTimeout(() => {
            this.openCategoryModal(itemId, isItemCopy);
        }, 1);
    }

    onMenuAction(data: any): void {
        const action = data[0];
        const itemId = data[1];
        switch (action) {
            case 'new':
                this.openCategoryModal();
                break;
            case 'edit':
                this.openModalCategory(itemId);
                break;
            case 'clone':
                this.openModalCategory(itemId, true);
                break;
        }
        this.panelTopMenu.hide();
    }
}
