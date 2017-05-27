import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: 'templates/modal_product.html'
})
export class ProductModalContent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) {}

    /** On initialize */
    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.form = this.fb.group({
            title: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: ['', []]
        });
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    /**
     * On form value changed
     * @param data
     */
    onValueChanged(data?: any){
        if (!this.form) { return; }

        console.log( data );

    }

    onSubmit() {

        this.submitted = true;


    }
}

@Component({
    selector: 'category-modal-content',
    templateUrl: 'templates/modal_category.html'
})
export class CategoryModalContent {
    @Input() modalTitle;
    @Input() itemId;
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;

    form: FormGroup;
    formErrors = {
        name: '',
        title: ''
    };
    validationMessages = {
        title: {
            required: 'Title is required.'
        },
        name: {
            required: 'Name is required.',
            pattern: 'The name must contain only Latin letters.'
        }
    };

    constructor(
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) {}

    /** On initialize */
    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.form = this.fb.group({
            title: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: ['', []]
        });
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    /**
     * On form value changed
     * @param data
     */
    onValueChanged(data?: any): void {
        if (!this.form) { return; }
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = this.form.get(field);
            if (control && (control.dirty || this.submitted) && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onSubmit() {

        this.submitted = true;

        if( !this.form.valid ){
            this.onValueChanged();
            return;
        }

        console.log( 'onSubmit', this.form.value );

    }

}

@Component({
    selector: 'shk-catalog',
    templateUrl: 'templates/page_catalog.html'
})
export class CatalogComponent implements OnInit {
    title = 'Каталог';
    modalRef: NgbModalRef;
    loading: boolean = false;

    constructor(
        private modalService: NgbModal,
        private titleService: Title
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
    }

    modalOpen( itemId?: number ) {
        this.modalRef = this.modalService.open(ProductModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add product';
        this.modalRef.componentInstance.itemId = itemId || 0;
    }

    openModalCategory( itemId?: number ): void {
        this.modalRef = this.modalService.open(CategoryModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add category';
        this.modalRef.componentInstance.itemId = itemId || 0;
    }

    public setTitle( newTitle: string ): void {
        this.titleService.setTitle( newTitle );
    }

}