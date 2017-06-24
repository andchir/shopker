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
import { ProductsService } from "./services/products.service";

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
        private modalService: NgbModal,
        private titleService: Title,
        private categoriesService: CategoriesService,
        private productsService: ProductsService
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
    }

    openCategory( category: Category ): void {
        this.currentCategory = _.clone( category );
        this.titleService.setTitle( this.title + ' / ' + this.currentCategory.title );
        this.getProducts();
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0,0,'root', '','','');
        this.titleService.setTitle( this.title );
        this.getProducts();
    }

    getProducts(): void{
        this.loading = true;
        this.productsService.getList(this.currentCategory.id)
            .subscribe(
                items => {
                    this.items = items;
                    this.loading = false;
                },
                error =>  this.errorMessage = <any>error
            );
    }

    modalProductOpen( itemId?: number ) {
        this.modalRef = this.modalService.open(ProductModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add product';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.category = this.currentCategory;
        this.modalRef.result.then((result) => {
            if( result.reason && result.reason == 'edit' ){

            } else {
                this.getProducts();
            }
        }, (reason) => {

        });
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
