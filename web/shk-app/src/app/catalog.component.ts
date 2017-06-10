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
    categoryId: number = 0;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private titleService: Title,
        private categoriesService: CategoriesService,
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );

        console.log( 'ngOnInit' );

        this.route.paramMap
            .subscribe(
                params => {
                    this.categoryId = params.get('categoryId')
                        ? parseInt( params.get('categoryId') )
                        : 0;
                    this.getCategory();
                    this.getProducts();
                }
            );
    }

    getCategory(): void {
        if( this.categoryId ){
            this.categoriesService.getItem( this.categoryId )
                .then(item => {
                    this.currentCategory = item;
                });
        } else {
            this.openRootCategory();
        }
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0,0,'root', '','','');
        //this.titleService.setTitle( this.rootTitle );
    }

    getProducts(): void{

        console.log( 'getProducts', this.categoryId );

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
