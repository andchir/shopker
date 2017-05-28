import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service'
import { Category } from "./models/category.model";
import * as _ from "lodash";

@Component({
    selector: 'category-modal-content',
    templateUrl: 'templates/modal_category.html',
    providers: [ CategoriesService ]
})
export class CategoriesComponent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    @Input() isItemCopy;
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    model: Category = new Category(0,0,'','','');

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
        private categoriesService: CategoriesService,
        public activeModal: NgbActiveModal
    ) {}

    /** On initialize */
    ngOnInit(): void {
        this.buildForm();
        if( this.itemId ){
            this.getModelData();
        }
    }

    getModelData(){
        this.loading = true;
        this.categoriesService.getItem( this.itemId )
            .then(item => {
                if( this.isItemCopy ){
                    item.id = 0;
                    item.name = '';
                }
                this.model = item;
                this.loading = false;
            });
    }

    buildForm(): void {
        this.form = this.fb.group({
            title: [this.model.title, [Validators.required]],
            name: [this.model.name, [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: [this.model.description, []]
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

        if( this.model.id ){

            this.categoriesService.editItem( this.model.id, this.model )
                .then((res) => {
                    if( res.success ){
                        this.closeModal();
                    } else {
                        if( res.msg ){
                            this.errorMessage = res.msg;
                        }
                    }
                });

        } else {

            this.categoriesService.createItem( this.model )
                .then((res) => {
                    if( res.success ){
                        this.closeModal();
                    } else {
                        if( res.msg ){
                            this.errorMessage = res.msg;
                        }
                    }
                });
        }
    }

    closeModal() {
        let reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close( { reason: reason, data: this.model } );
    }

}
