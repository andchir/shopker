import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContentTypesService } from './services/content_types.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContentField } from './models/content_field.model';
import { ContentType } from './models/content_type.model';
import { ConfirmModalContent } from './app.component';
import * as _ from "lodash";

@Component({
    selector: 'content-type-modal-content',
    templateUrl: 'templates/modal_content_types.html',
    providers: [ ContentTypesService ]
})
export class ContentTypeModalContent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    @ViewChild('addCollectionBlock') elementAddCollectionBlock;
    @ViewChild('addGroupBlock') elementAddGroupBlock;

    model = new ContentType('','','','','products',[],['Содержание', 'Служебное']);
    submitted: boolean = false;
    fieldSubmitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    action: string = 'add_field';
    currentFieldName = '';
    collections = ['products'];
    contentTypeForm: FormGroup;
    fieldForm: FormGroup;
    formErrors = {
        contentType: {
            name: '',
            title: '',
            new_collection: ''
        },
        field: {
            name: '',
            title: '',
            input_type: '',
            output_type: '',
            group: '',
            new_group: ''
        }
    };
    validationMessages = {
        contentType: {
            title: {
                required: 'Title is required.'
            },
            name: {
                required: 'Name is required.',
                pattern: 'The name must contain only Latin letters.'
            },
            new_collection: {
                pattern: 'The collection name must contain only Latin letters.',
                exists: 'Collection with the same name already exists.'
            }
        },
        field: {
            title: {
                required: 'Title is required.'
            },
            name: {
                required: 'Name is required.',
                pattern: 'The name must contain only Latin letters.'
            },
            input_type: {
                required: 'Input type is required.'
            },
            output_type: {
                required: 'Output type is required.'
            },
            group: {
                required: 'Group is required.'
            },
            new_group: {
                exists: 'Group with the same name already exists.'
            }
        }
    };

    constructor(
        private fb: FormBuilder,
        private contentTypesService: ContentTypesService,
        public activeModal: NgbActiveModal
    ) {}

    /** On initialize */
    ngOnInit(): void {
        this.buildForm();
        if( this.itemId ){
            this.getModelData();
        }
    }

    /** Build form groups */
    buildForm(): void {
        this.contentTypeForm = this.fb.group({
            title: [this.model.title, [Validators.required]],
            name: [this.model.name, [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: [this.model.description, []],
            collection: [this.model.collection, [Validators.required]],
            new_collection: ['', [Validators.pattern('[A-Za-z0-9_-]+')]]
        });
        this.contentTypeForm.valueChanges
            .subscribe(data => this.onValueChanged('contentType', data));

        this.fieldForm = this.fb.group({
            title: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: ['', []],
            input_type: ['', [Validators.required]],
            output_type: ['', [Validators.required]],
            group: ['', [Validators.required]],
            new_group: ['', []]
        });
        this.fieldForm.valueChanges
            .subscribe(data => this.onValueChanged('field', data));
    }

    displayToggle(element: HTMLElement){
        element.style.display = element.style.display == 'none' ? 'block' : 'none';
    }

    /**
     * On form value changed
     * @param type
     * @param data
     */
    onValueChanged(type: string, data?: any){
        if (!this.contentTypeForm) { return; }
        const form = type == 'contentType'
            ? this.contentTypeForm
            : this.fieldForm;
        const isSubmitted = type == 'contentType'
            ? this.submitted
            : this.fieldSubmitted;

        for (const field in this.formErrors[type]) {
            this.formErrors[type][field] = '';
            const control = form.get(field);
            if (control && (control.dirty || isSubmitted) && !control.valid) {
                const messages = this.validationMessages[type][field];
                for (const key in control.errors) {
                    this.formErrors[type][field] += messages[key] + ' ';
                }
            }
        }
    }

    getModelData(){
        this.loading = true;
        this.contentTypesService.getItem( this.itemId )
            .then(item => {
                this.model = item;
                this.loading = false;
            });
    }

    addCollection(){
        const fieldName = 'new_collection';
        const control = this.contentTypeForm.get(fieldName);
        if( !control.valid ){
            return false;
        }
        this.formErrors.contentType[fieldName] = '';
        const value = control.value;
        let exists = false;
        for (let name of this.collections) {
            if(value == name){
                exists = true;
                break;
            }
        }
        if( exists ){
            this.formErrors.contentType[fieldName] += this.validationMessages.contentType[fieldName].exists;
            return false;
        }
        this.collections.push( value );
        this.elementAddCollectionBlock.nativeElement.style.display = 'none';
        return true;
    }

    deleteCollection(){

        console.log( 'deleteCollection' );

    }

    addGroup(){
        const fieldName = 'new_group';
        const control = this.fieldForm.get(fieldName);
        if( !control || !control.valid || !control.value ){
            return false;
        }
        this.formErrors.field[fieldName] = '';
        const value = control.value;
        let index = this.model.groups.indexOf(value);
        if( index > -1 ){
            this.formErrors.field[fieldName] += this.validationMessages.field[fieldName].exists;
            return false;
        }
        this.model.groups.push( value );
        this.elementAddGroupBlock.nativeElement.style.display = 'none';
        return true;
    }

    deleteGroup(){

        console.log( 'deleteGroup' );

    }

    editField(field: ContentField){
        this.fieldForm.setValue( _.clone( field ) );
        this.currentFieldName = field.name;
        this.fieldSubmitted = false;
        this.action = 'edit_field';
    }

    deleteField(field: ContentField){
        let index = _.findIndex( this.model.fields, {name: field.name} );
        if( index == -1 ){
            this.errorMessage = 'Field not found.';
            return;
        }
        this.model.fields.splice(index, 1);
    }

    resetFieldForm(){
        this.errorMessage = '';
        this.fieldSubmitted = false;
        this.currentFieldName = '';
        this.action = 'add_field';
        this.fieldForm.reset();
    }

    editFieldCancel(){
        this.resetFieldForm();
        this.onValueChanged('field');
    }

    submitField(){
        this.fieldSubmitted = true;

        if( !this.fieldForm.valid ){
            this.onValueChanged('field');
            return;
        }

        let data = this.fieldForm.value;
        let index = _.findIndex( this.model.fields, {name: data.name} );
        if( index > -1 && this.currentFieldName != data.name ){
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }

        if( this.action == 'add_field' ){
            this.model.fields.push( _.clone( data ) );
        }
        else if( this.action == 'edit_field' ){
            index = _.findIndex( this.model.fields, {name: this.currentFieldName} );
            if( index > -1 ){
                this.model.fields[index] = _.clone( data );
            }
        }
        this.resetFieldForm();
    }

    onSubmit() {

        this.submitted = true;

        if( !this.contentTypeForm.valid ){
            this.onValueChanged('contentType');
            return;
        }
        if( this.model.fields.length == 0 ){
            this.errorMessage = 'You have not created any fields.';
            return;
        }

        this.contentTypesService.createItem( this.model )
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

    closeModal() {
        this.activeModal.close();
    }
}

@Component({
    selector: 'shk-content-types',
    templateUrl: 'templates/page_content_types.html'
})
export class ContentTypesComponent implements OnInit {
    errorMessage: string;
    items: ContentType[] = [];
    title: string = 'Типы товаров';
    modalRef: NgbModalRef;
    loading: boolean = false;

    constructor(private contentTypesService: ContentTypesService, private modalService: NgbModal) {}

    ngOnInit(): void { this.getList(); }

    getList(): void {
        this.loading = true;
        this.contentTypesService.getList()
            .then(
                items => {
                    this.items = items;
                    this.loading = false;
                },
                error => this.errorMessage = <any>error);
    }

    modalOpen( itemId ): void {
        this.modalRef = this.modalService.open(ContentTypeModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add content type';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.result.then((result) => {
            this.getList();
        }, (reason) => {
            //console.log( 'reason', reason );
        });
    }

    modalClose(): void {
        this.modalRef.close();
    }

    deleteItemConfirm( itemId ): void{
        this.modalRef = this.modalService.open(ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then((result) => {
            if( result == 'accept' ){
                this.deleteItem( itemId );
            }
        }, (reason) => {
            //console.log( 'reason', reason );
        });
    }

    deleteItem( itemId ): void{
        this.contentTypesService.deleteItem( itemId )
            .then((res) => {
                if( res.success ){
                    this.getList();
                } else {
                    if( res.msg ){
                        //this.errorMessage = res.msg;
                    }
                }
            });
    }

}