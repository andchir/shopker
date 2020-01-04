import {Component, OnInit, Input} from '@angular/core';
import {NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {clone} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {Category} from './models/category.model';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {ProductModalContentComponent} from './product.component';
import {ContentType} from './models/content_type.model';
import {Product} from './models/product.model';
import {QueryOptions} from '../models/query-options';

import {ProductsService} from './services/products.service';
import {ContentTypesService} from './services/content_types.service';

@Component({
    selector: 'app-catalog-category',
    templateUrl: 'templates/catalog-category.html',
    providers: [ProductsService]
})
export class CatalogCategoryComponent extends PageTableAbstractComponent<Product> implements OnInit {

    static title = 'CATEGORY';

    queryOptions: QueryOptions = new QueryOptions('id', 'desc', 1, 10, 0, 0);
    currentCategory: Category;
    currentContentType: ContentType;
    tableFields = [];

    constructor(
        public dataService: ProductsService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public translateService: TranslateService,
        private contentTypesService: ContentTypesService
    ) {
        super(dataService, activeModal, modalService, translateService);
    }

    ngOnInit(): void {

    }

    updateTableConfig(): void {
        if (!this.currentContentType) {
            return;
        }
        this.tableFields = [];
        this.currentContentType.fields.forEach((field) => {
            if (field.showInTable) {
                this.tableFields.push({
                    name: field.name,
                    sortName: field.name,
                    title: field.title,
                    outputType: field.outputType,
                    outputProperties: field.outputProperties
                });
            }
        });
        this.tableFields.unshift({
            name: 'id',
            sortName: 'id',
            title: 'ID',
            outputType: 'text',
            outputProperties: {}
        });
        this.tableFields.push({
            name: 'isActive',
            sortName: 'isActive',
            title: 'STATUS',
            outputType: 'boolean',
            outputProperties: {}
        });
    }

    getModalContent() {
        return ProductModalContentComponent;
    }

    getContentType(): Observable<ContentType> {
        return this.contentTypesService
            .getItemByName(this.currentCategory.contentTypeName);
    }

    openCategory(category: Category): void {
        this.currentCategory = clone(category);
        if (!this.currentCategory.contentTypeName) {
            this.items = [];
            this.tableFields = [];
            this.currentCategory.id = 0;
            return;
        }
        this.dataService.setRequestUrl('/admin/products/' + this.currentCategory.id);
        this.loading = true;
        this.queryOptions.page = 1;
        this.getContentType()
            .subscribe((data) => {
                this.currentContentType = data;
                this.loading = false;
                this.updateTableConfig();
                this.getList();
            }, () => {
                this.items = [];
                this.tableFields = [];
                this.currentCategory.id = 0;
            });
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0, false, 0, 'root', '', '', '', true);
        this.dataService.setRequestUrl('/admin/products/' + this.currentCategory.id);
        this.getList();
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false, modalId = ''): void {
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef.componentInstance.modalTitle = isEditMode
            ? `${this.getLangString('PAGE')} #${itemId}`
            : this.getLangString('ADD');
        this.modalRef.componentInstance.modalId = modalId;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = isEditMode;
        this.modalRef.componentInstance.category = Object.assign({}, this.currentCategory);
    }

    getModalElementId(itemId?: number): string {
        return ['modal', 'product', itemId || 0].join('-');
    }
}
