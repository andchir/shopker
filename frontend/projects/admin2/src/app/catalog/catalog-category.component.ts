import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {take, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
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
import {SelectParentDropdownComponent} from '../components/select-parent-dropdown.component';

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/catalog-category.component.html',
    providers: [DialogService, ProductsService]
})
export class CatalogCategoryComponent extends AppTablePageAbstractComponent<Product> implements OnInit, OnDestroy {
    
    @ViewChild('selectParentInput') selectParentInput: SelectParentDropdownComponent;
    
    queryOptions: QueryOptions = new QueryOptions(1, 12, 'id', 'desc');
    items: Product[] = [];
    cols: TableField[] = [];
    currentCategory: Category;
    currentContentType: ContentType;
    categoryId: number;
    categoriesTree: TreeNode[] = [];
    currentCategoryNode: TreeNode;
    loadingCategories = false;
    
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
        this.getCategoriesTree();
    }

    getContentType(): Observable<ContentType> {
        return this.contentTypesService
            .getItemByName(this.currentCategory.contentTypeName);
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

    getItemData(item: Product): {[name: string]: number|string} {
        return {
            id: item ? item.id : 0,
            parentId: this.categoryId
        };
    }

    openModal(item: Product, event?: MouseEvent): void {
        super.openModal(item, event, 'modal-margin-left');
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

    getCategoriesTree(): void {
        this.loadingCategories = true;
        this.categoriesService.getTree()
            .subscribe({
                next: (res) => {
                    this.categoriesTree = res;
                    if (!this.currentCategoryNode) {
                        // this.currentCategoryNode = SelectParentDropdownComponent.getTreeCurrentNode(this.categoriesTree, this.currentId);
                    }
                    this.loadingCategories = false;
                },
                error: () => {
                    this.loadingCategories = false;
                }
            });
    }

    onCategoryUpdated(categoryId: number): void {
        if (this.categoryId) {
            this.router.navigate(['/catalog', 'category', this.categoryId]);
            return;
        }
        this.router.navigate(['/catalog', 'category']);
    }

    openCategoryModal(itemId?: number, parentId?: number, isItemCopy = false): void {
        const data = {
            id: itemId,
            parentId,
            isItemCopy
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
                        if (this.selectParentInput) {
                            this.selectParentInput.getCategoriesTree();
                        }
                    }
                }
            });
        setTimeout(() => {
            if (window.document.querySelector('.p-component-overlay')) {
                (window.document.querySelector('.p-component-overlay') as HTMLElement)
                    .classList.add('modal-margin-left');
            }
        }, 1);
    }

    onMenuAction(data: any): void {
        const action = data[0];
        const itemId = data[1];
        const parentId = data[2] || 0;
        switch (action) {
            case 'new':
                this.openCategoryModal(null, itemId);
                break;
            case 'edit':
                this.openCategoryModal(itemId);
                break;
            case 'clone':
                this.openCategoryModal(itemId, null, true);
                break;
            case 'delete':
                this.confirmationService.confirm({
                    message: this.getLangString('YOU_SURE_YOU_WANT_DELETE'),
                    accept: () => {
                        this.deleteCategoryItem(itemId, parentId);
                    }
                });
                break;
            case 'root':
                this.categoryId = 0;
                break;
        }
    }

    deleteCategoryItem(itemId: number, parentId?: number): void {
        if (!itemId) {
            return;
        }
        this.loading = true;
        this.categoriesService.deleteItem(itemId)
            .subscribe({
                next: () => {
                    this.categoryId = parentId || 0;
                    if (this.selectParentInput) {
                        this.selectParentInput.getCategoriesTree();
                    }
                },
                error: (err) => {
                    if (err.error) {
                        this.messageService.add({
                            key: 'message',
                            severity: 'error',
                            detail: err.error
                        });
                    }
                    this.loading = false;
                }
            });
    }
}
