import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

import { Category } from "./models/category.model";
import { ProductsService } from "./services/products.service";
import { PageTableAbstractComponent } from './page-table.abstract'
import { ProductModalContent } from './product.component';
import { ContentType } from './models/content_type.model';
import { ContentTypesService } from './services/content_types.service';

@Component({
    selector: 'catalog-category',
    templateUrl: 'templates/catalog-category.html',
    providers: [ProductsService]
})
export class CatalogCategoryComponent extends PageTableAbstractComponent {

    title: string = 'Каталог';
    currentCategory: Category;
    currentContentType: ContentType;
    tableFields = [];

    constructor(
        dataService: ProductsService,
        activeModal: NgbActiveModal,
        modalService: NgbModal,
        titleService: Title,
        private contentTypesService: ContentTypesService
    ) {
        super(dataService, activeModal, modalService, titleService);
    }

    ngOnInit(): void {
        this.setTitle(this.title);
    }

    updateTableConfig(): void {
        if(!this.currentContentType){
            return;
        }
        this.tableFields = [
            {
                name: 'id',
                title: 'ID',
                output_type: 'number',
                output_properties: {}
            }
        ];
        this.currentContentType.fields.forEach((field) => {
            if (field.show_in_table) {
                this.tableFields.push({
                    name: field.name,
                    title: field.title,
                    output_type: field.output_type,
                    output_properties: field.output_properties
                });
            }
        });
    }

    getModalContent() {
        return ProductModalContent;
    }

    getContentType(): Promise<any> {
        return this.contentTypesService
            .getItemByName(this.currentCategory.content_type_name);
    }

    openCategory(category: Category): void {
        if (!category.id) {
            this.items = [];
            this.tableFields = [];
            return;
        }
        this.loading = true;
        this.currentCategory = _.clone(category);
        this.titleService.setTitle(this.title + ' / ' + this.currentCategory.title);
        this.dataService.setRequestUrl('admin/products/' + this.currentCategory.id);
        this.getContentType()
            .then((res) => {
                this.loading = false;
                if (res.success) {
                    this.currentContentType = res.data as ContentType;
                    this.updateTableConfig();
                    this.getList();
                }
            });
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0, false, 0, 'root', '', '', '', true);
        this.titleService.setTitle(this.title);
        this.dataService.setRequestUrl('admin/products/' + this.currentCategory.id);
        this.getList();
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false): void {
        PageTableAbstractComponent.prototype.setModalInputs.call(this, itemId, isItemCopy);
        this.modalRef.componentInstance.category = this.currentCategory;
    }

}
