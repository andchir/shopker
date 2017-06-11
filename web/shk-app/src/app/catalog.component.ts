import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductModalContent } from './product.component';
import { Category } from "./models/category.model";
import { Product } from "./models/product.model";
import * as _ from "lodash";

@Component({
    selector: 'shk-catalog',
    templateUrl: 'templates/page_catalog.html'
})
export class CatalogComponent implements OnInit {
    title = 'Каталог';
    errorMessage: string = '';
    modalRef: NgbModalRef;
    loading: boolean = false;
    categories: Category[] = [];
    currentCategory: Category;
    items: Product[] = [];
    selectedIds: number[] = [];

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private titleService: Title,
        private categoriesService: CategoriesService,
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
    }

    openCategory( category: Category ): void {
        this.currentCategory = _.clone( category );
        this.titleService.setTitle( this.title + ' / ' + this.currentCategory.title );
        this.getProducts();
    }

    //TODO: delete if not used
    getCategory( categoryId: number ): void {
        if( categoryId ){
            this.categoriesService.getItem( categoryId )
                .then(item => {
                    this.currentCategory = item;
                    this.titleService.setTitle( this.title + ' / ' + this.currentCategory.title );
                });
        } else {
            this.openRootCategory();
        }
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0,0,'root', '','','');
        this.titleService.setTitle( this.title );
        this.getProducts();
    }

    getProducts(): void{

        this.loading = true;

        console.log( 'getProducts', this.currentCategory.id );

    }

    modalProductOpen( itemId?: number ) {
        this.modalRef = this.modalService.open(ProductModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add product';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.categoryContentTypeName = this.currentCategory.content_type;
    }

    public setTitle( newTitle: string ): void {
        this.titleService.setTitle( newTitle );
    }

    selectAll( event ): void{
        this.selectedIds = [];
        if( event.target.checked ){
            for( let item of this.items ){
                this.selectedIds.push( item.id );
            }
        }
    }

}
