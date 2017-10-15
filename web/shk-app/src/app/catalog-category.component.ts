import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

import { Category } from "./models/category.model";
import { ProductsService } from "./services/products.service";
import { PageTableAbstractComponent } from './page-table.abstract'
import { ProductModalContent } from './product.component';

@Component({
    selector: 'catalog-category',
    templateUrl: 'templates/catalog-category.html',
    providers: [ProductsService]
})
export class CatalogCategoryComponent extends PageTableAbstractComponent {

    title: string = 'Каталог';
    currentCategory: Category;

    constructor(dataService: ProductsService,
                activeModal: NgbActiveModal,
                modalService: NgbModal,
                titleService: Title) {
        super(dataService, activeModal, modalService, titleService);
    }

    //TODO: get from settings
    tableFields = [
        {
            name: 'id',
            title: 'ID',
            output_type: 'text',
            output_properties: {}
        },
        {
            name: 'name',
            title: 'Системное имя',
            output_type: 'text',
            output_properties: {}
        },
        {
            name: 'title',
            title: 'Название',
            output_type: 'text',
            output_properties: {}
        },
        {
            name: 'price',
            title: 'Цена',
            output_type: 'number',
            output_properties: {}
        },
        {
            name: 'is_active',
            title: 'Статус',
            output_type: 'boolean',
            output_properties: {}
        }
    ];

    ngOnInit(): void {
        this.setTitle(this.title);
    }

    getModalContent() {
        return ProductModalContent;
    }

    openCategory(category: Category): void {
        this.currentCategory = _.clone(category);
        this.titleService.setTitle(this.title + ' / ' + this.currentCategory.title);
        this.dataService.setRequestUrl('admin/products/' + this.currentCategory.id);
        this.getList();
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