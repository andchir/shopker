import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ContentTypesService } from './services/content_types.service';
import { FieldTypesService } from './field-types.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContentField } from './models/content_field.model';
import { ContentType } from './models/content_type.model';
import { FieldType } from "./models/field-type.model";
import { FieldTypeProperty } from './models/field-type-property.model';
import { QueryOptions } from './models/query-options';
import { ConfirmModalContent } from './app.component';
import * as _ from "lodash";

@Component({
    selector: 'content-type-modal-content',
    templateUrl: 'templates/modal_content_types.html',
    providers: [ ContentTypesService, FieldTypesService ]
})
export class ContentTypeModalContent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    @Input() isItemCopy;
    @ViewChild('addCollectionBlock') elementAddCollectionBlock;
    @ViewChild('addGroupBlock') elementAddGroupBlock;

    model = new ContentType('','','','','products',[],['Содержание', 'Служебное'], true);
    fieldModel = new ContentField('', '', '', '', '', [], '', [], '', false, false);
    submitted: boolean = false;
    fieldSubmitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    errorFieldMessage: string;
    action: string = 'add_field';
    currentFieldName = '';
    collections = ['products'];
    contentTypeForm: FormGroup;
    fieldForm: FormGroup;
    fieldTypes: FieldType[];
    inputFieldTypeProperties: FieldTypeProperty[] = [];
    outputFieldTypeProperties: FieldTypeProperty[] = [];
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
        private fieldTypesService: FieldTypesService,
        private activeModal: NgbActiveModal,
        tooltipConfig: NgbTooltipConfig
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
    }

    /** On initialize */
    ngOnInit(): void {
        this.buildForm();
        this.getFieldTypes();
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
            title: [this.fieldModel.title, [Validators.required]],
            name: [this.fieldModel.name, [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: [this.fieldModel.description, []],
            input_type: [this.fieldModel.input_type, [Validators.required]],
            output_type: [this.fieldModel.output_type, [Validators.required]],
            is_filter: [this.fieldModel.is_filter, []],
            required: [this.fieldModel.required, []],
            group: [this.fieldModel.group, [Validators.required]],
            new_group: ['', []]
        });
        this.fieldForm.valueChanges
            .subscribe(data => this.onValueChanged('field', data));
    }

    /** Get field types */
    getFieldTypes(): void {
        let options = new QueryOptions('name', 'asc', 0, 0, 1);
        this.fieldTypesService.getList(options)
            .subscribe(
                res => {
                    this.fieldTypes = res.data;
                },
                error =>  this.errorMessage = <any>error
            );
    }

    /**
     * Select fild type properties
     * @param type
     */
    selectFieldTypeProperties(type: string): void {
        let fieldType = _.find(this.fieldTypes, {name: this.fieldModel[type]});
        if(!fieldType){
            if(type == 'input_type'){
                this.inputFieldTypeProperties = [];
            }
            else if(type == 'output_type'){
                this.outputFieldTypeProperties = [];
            }
            return;
        }
        if(type == 'input_type'){
            this.inputFieldTypeProperties = _.clone(fieldType.inputProperties);
        }
        else if(type == 'output_type'){
            this.outputFieldTypeProperties = _.clone(fieldType.outputProperties);
        }
    }

    /** Element display toggle */
    displayToggle(element: HTMLElement, display?: boolean): void {
        display = display || element.style.display == 'none';
        element.style.display = display ? 'block' : 'none';
    }

    /**
     * On form value changed
     * @param type
     * @param data
     */
    onValueChanged(type: string, data?: any): void{
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

    /** Get model data */
    getModelData(){
        this.loading = true;
        this.contentTypesService.getItem( this.itemId )
            .then(item => {
                if( this.isItemCopy ){
                    item.id = '';
                    item.name = '';
                }
                this.model = item;
                this.loading = false;
            });
    }

    /** Add collection */
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

    /** Delete collection */
    deleteCollection(){

        console.log( 'deleteCollection' );

    }

    /** Add group */
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

    /** Delete group */
    deleteGroup(){
        let currentGroupName = this.fieldForm.get('group').value;
        let index = _.findIndex( this.model.fields, {group: currentGroupName} );
        this.errorFieldMessage = '';
        if( index > -1 ){
            this.errorFieldMessage = 'You can\'t delete a group because it is not empty.';
            return;
        }
        index = this.model.groups.indexOf( currentGroupName );
        if( index > -1 ){
            this.model.groups.splice(index, 1);
        }
    }

    /**
     * Edit field
     * @param field
     */
    editField(field: ContentField) {
        this.fieldModel = _.clone(field);
        this.fieldForm.setValue(_.omit(this.fieldModel, ['id', 'input_type_options', 'output_type_options']));
        this.currentFieldName = this.fieldModel.name;
        this.fieldSubmitted = false;
        this.action = 'edit_field';
    }

    /**
     * Copy field
     * @param field
     */
    copyField(field: ContentField) {
        this.fieldModel = _.clone(field);
        this.fieldModel.name = '';
        this.fieldForm.setValue(this.fieldModel);
        this.currentFieldName = '';
        this.fieldSubmitted = false;
        this.action = 'add_field';
    }

    /**
     * Delete field
     * @param field
     */
    deleteField(field: ContentField){
        let index = _.findIndex( this.model.fields, {name: field.name} );
        if( index == -1 ){
            this.errorMessage = 'Field not found.';
            return;
        }
        this.model.fields.splice(index, 1);
    }

    /** Reset field form */
    resetFieldForm(){
        this.errorMessage = '';
        this.errorFieldMessage = '';
        this.fieldSubmitted = false;
        this.currentFieldName = '';
        this.action = 'add_field';
        this.fieldForm.reset();
    }

    /** Cancel edit field */
    editFieldCancel(){
        this.resetFieldForm();
        this.onValueChanged('field');
    }

    /** Submit field */
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

    /** Submit Content type form */
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

        if( this.model.id ){

            this.contentTypesService.editItem( this.model.id, this.model )
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
        else {

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
    }

    /** Close modal */
    closeModal() {
        this.activeModal.close();
    }
}

@Component({
    selector: 'shk-content-types',
    templateUrl: 'templates/page-content_types.html'
})
export class ContentTypesComponent implements OnInit {
    errorMessage: string;
    items: ContentType[] = [];
    title: string = 'Типы товаров';
    modalRef: NgbModalRef;
    loading: boolean = false;
    selectedIds: string[] = [];

    //TODO: get from settings
    tableFields = [
        {
            name: 'name',
            title: 'Системное имя',
            output_type: 'text'
        },
        {
            name: 'title',
            title: 'Название',
            output_type: 'text'
        },
        {
            name: 'collection',
            title: 'Коллекция',
            output_type: 'text'
        },
        {
            name: 'published',
            title: 'Статус',
            output_type: 'boolean'
        }
    ];

    constructor(
        private contentTypesService: ContentTypesService,
        private modalService: NgbModal,
        private titleService: Title
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
        this.getList();
    }

    public setTitle( newTitle: string ) {
        this.titleService.setTitle( newTitle );
    }

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

    modalOpen( itemId?: number, isItemCopy?: boolean ): void {
        this.modalRef = this.modalService.open(ContentTypeModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy
            ? 'Edit content type'
            : 'Add content type';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.result.then((result) => {
            this.getList();
        }, (reason) => {
            //console.log( 'reason', reason );
        });
    }

    copyItem( itemId: number ): void {
        this.modalOpen( itemId, true );
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

        });
    }

    deleteItem( itemId: string ): void{
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

    selectAll( event ): void{
        this.selectedIds = [];
        if( event.target.checked ){
            for( let item of this.items ){
                this.selectedIds.push( item.id );
            }
        }
    }

    setSelected( event, itemId: string ): void{
        const index = this.selectedIds.indexOf( itemId );
        if( event.target.checked ){
            if( index == -1 ){
                this.selectedIds.push( itemId );
            }
        } else if( index > -1 ){
            this.selectedIds.splice( index, 1 );
        }
    }

    getIsSelected( itemId: string ): boolean{
        return this.selectedIds.lastIndexOf( itemId ) > -1;
    }

    actionRequest(actionValue : [string, number]): void {
        switch(actionValue[0]){
            case 'edit':
                this.modalOpen(actionValue[1]);
                break;
            case 'copy':
                this.modalOpen(actionValue[1], true);
                break;
            case 'delete':
                this.deleteItemConfirm(actionValue[1]);
                break;
        }
    }
}