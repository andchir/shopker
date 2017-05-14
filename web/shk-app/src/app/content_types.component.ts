import { Component, OnInit, Input } from '@angular/core';
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

    model = new ContentType('','','','',[],['Содержание', 'Служебное']);
    currentField = new ContentField(_.uniqueId(),'','','','','','');
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    action: string = 'add_field';
    contentTypeForm: FormGroup;
    fieldForm: FormGroup;
    formErrors = {
        'name': '',
        'title': ''
    };
    validationMessages = {
        'name': {
            'required': 'Name is required.',
            'pattern': 'The name must contain only Latin letters.'
        },
        'title': {
            'required': 'Title is required.'
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
            name: [this.model.name, [Validators.required, Validators.pattern('[A-Za-z_-]+')]],
            description: [this.model.description, []]
        });
        this.contentTypeForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

        this.fieldForm = this.fb.group({
            field_title: [this.currentField.title, [Validators.required]],
            field_name: [this.currentField.name, [Validators.required, Validators.pattern('[A-Za-z_-]+')]],
            field_description: [this.currentField.description, []],
            field_input_type: [this.currentField.inputType, [Validators.required]],
            field_output_type: [this.currentField.outputType, [Validators.required]],
            field_group: [this.currentField.group, [Validators.required]]
        });
        this.fieldForm.valueChanges
            .subscribe(data => this.onFieldValueChanged(data));
    }

    /**
     * On form value changed
     * @param data
     */
    onValueChanged(data?: any){
        if (!this.contentTypeForm) { return; }
        const form = this.contentTypeForm;
        const isSubmitted = this.submitted;

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && (control.dirty || isSubmitted) && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    /**
     * On field form value changed
     * @param data
     */
    onFieldValueChanged(data?: any){
        if (!this.fieldForm) { return; }
        const form = this.fieldForm;
        const isSubmitted = this.submitted;

        console.log( 'onFieldValueChanged', data );
    }

    getModelData(){
        this.loading = true;
        this.contentTypesService.getItem( this.itemId )
            .then(item => {
                this.model = item;
                this.loading = false;
            });
    }

    addGroup(newName: string){
        this.model.groups.push( newName );
    }

    deleteGroup(){

        console.log( 'deleteGroup' );

    }

    editField(field: ContentField){
        this.currentField = _.clone( field );
        this.action = 'edit_field';
    }

    deleteField(field: ContentField){
        let index = _.findIndex( this.model.fields, {id: field.id} );
        if( index == -1 ){
            this.errorMessage = 'Field not found.';
            return;
        }
        this.model.fields.splice(index, 1);
    }

    clearFieldData(){
        this.currentField.id = _.uniqueId();
        this.currentField.name = '';
        this.currentField.title = '';
        this.currentField.description = '';
        this.currentField.outputType = '';
        this.currentField.inputType = '';
        this.currentField.group = '';
    }

    editFieldSubmit(){
        let index = _.findIndex( this.model.fields, {id: this.currentField.id} );
        if( index == -1 ){
            this.errorMessage = 'Field not found.';
            return;
        }

        let isHaveEmpty = this.validateEmptyFieldData( this.currentField );
        if( isHaveEmpty ){
            this.errorMessage = 'All fields is required.';
            return;
        }

        this.errorMessage = '';
        this.model.fields[index] = _.clone( this.currentField );
        this.action = 'add_field';
        this.clearFieldData();
    }

    editFieldCancel(){
        this.action = 'add_field';
        this.clearFieldData();
    }

    validateEmptyFieldData(field: ContentField){
        let isHaveEmpty = false;
        _.forEach(this.currentField, function(value, key) {
            if( !value ){
                isHaveEmpty = true;
                return false;
            }
        });
        return isHaveEmpty;
    }

    addField(){

        let isHaveEmpty = this.validateEmptyFieldData( this.currentField );
        if( isHaveEmpty ){
            this.errorMessage = 'All fields is required.';
            return;
        }

        let index = _.findIndex( this.model.fields, {name: this.currentField.name} );

        if( index > -1 ){
            this.errorMessage = 'A field named "' + this.currentField.name + '" already exists.';
            return;
        }
        if( !this.currentField.id ){
            this.currentField.id = _.uniqueId();
        }

        this.errorMessage = '';
        this.model.fields.push( _.clone( this.currentField ) );
        this.clearFieldData();
    }

    onSubmit() {

        console.log( 'onSubmit', this.contentTypeForm.valid );

        this.submitted = true;

        if( !this.contentTypeForm.valid ){
            this.onValueChanged();
            return;
        }
        if( this.model.fields.length == 0 ){
            this.errorMessage = 'You have not created any fields.';
            return;
        }

        console.log( this.contentTypeForm.value );

        /*this.contentTypesService.createItem(this.model)
            .then((res) => {
                if( res.success ){
                    this.closeModal();
                } else {
                    if( res.msg ){
                        this.errorMessage = res.msg;
                    }
                }
            });*/
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