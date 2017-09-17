import { Component, OnInit, Input, ViewChild, Injectable, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ContentTypesService } from './services/content_types.service';
import { FieldTypesService } from './field-types.component';
import { CollectionsService } from './services/collections.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContentField } from './models/content_field.model';
import { ContentType } from './models/content_type.model';
import { FieldType } from "./models/field-type.model";
import { FieldTypeProperty } from './models/field-type-property.model';
import { QueryOptions } from './models/query-options';
import { PageTableAbstractComponent, ModalContentAbstractComponent } from './page-table.abstract';
import * as _ from "lodash";

@Component({
    selector: 'content-type-modal-content',
    templateUrl: 'templates/modal-content_types.html',
    providers: [ ContentTypesService, FieldTypesService, CollectionsService ]
})
export class ContentTypeModalContent extends ModalContentAbstractComponent {

    @ViewChild('addCollectionBlock') elementAddCollectionBlock;
    @ViewChild('addGroupBlock') elementAddGroupBlock;
    modalRef: NgbModalRef;

    constructor(
        public fb: FormBuilder,
        public dataService: ContentTypesService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        private fieldTypesService: FieldTypesService,
        private collectionsService: CollectionsService,
        private modalService: NgbModal
    ) {
        super(fb, dataService, activeModal, tooltipConfig);
    }

    model: ContentType = new ContentType(0, '', '', '', 'products', [], ['Основное','Служебное'], true);
    fieldModel: ContentField = new ContentField('', '', '', '', '', [], '', [], '', false, false);
    fld_submitted: boolean = false;
    errorFieldMessage: string;
    action: string = 'add_field';
    currentFieldName = '';
    collections: any[] = ['products'];
    fieldForm: FormGroup;
    fieldTypes: FieldType[];
    inputFieldTypeProperties: FieldTypeProperty[] = [];
    outputFieldTypeProperties: FieldTypeProperty[] = [];

    formFields = {
        name: {
            value: '',
            validators: [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')],
            messages: {
                required: 'Name is required.',
                pattern: 'The name must contain only Latin letters and numbers.'
            }
        },
        title: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Title is required.'
            }
        },
        description: {
            value: '',
            validators: [],
            messages: {}
        },
        collection: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Title is required.'
            }
        },
        new_collection: {
            value: '',
            validators: [Validators.pattern('[A-Za-z0-9_-]+')],
            messages: {
                pattern: 'The name must contain only Latin letters and numbers.',
                exists: 'Collection with the same name already exists.'
            }
        },
        is_active: {
            value: '',
            validators: [],
            messages: {}
        }
    };

    fieldsFormOptions = {
        title: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Title is required.'
            }
        },
        name: {
            value: '',
            validators: [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')],
            messages: {
                required: 'Name is required.',
                pattern: 'The name must contain only Latin letters.'
            }
        },
        description: {
            value: '',
            validators: [],
            messages: {}
        },
        input_type: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Input type is required.'
            }
        },
        output_type: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Output type is required.'
            }
        },
        group: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Group is required.'
            }
        },
        new_group: {
            value: '',
            validators: [],
            messages: {
                exists: 'Group with the same name already exists.'
            }
        },
        required: {
            value: '',
            validators: [],
            messages: {}
        },
        show_in_table: {
            value: '',
            validators: [],
            messages: {}
        },
        is_filter: {
            value: '',
            validators: [],
            messages: {}
        }
    };

    buildForm(): void {
        ModalContentAbstractComponent.prototype.buildForm.call(this);

        let controls = this.buildControls(this.fieldsFormOptions, 'fieldModel', 'fld_');
        this.fieldForm = this.fb.group(controls);
        this.fieldForm.valueChanges
            .subscribe(() => this.onValueChanged('fieldForm', 'fld_'));
    }

    /** On initialize */
    ngOnInit(): void {
        ModalContentAbstractComponent.prototype.ngOnInit.call(this);
        this.getFieldTypes();
        this.getCollectionsList();
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

    /** Get collections list */
    getCollectionsList(): void {
        this.collectionsService.getList()
            .subscribe(
                res => {
                    if(res.data && res.data.length > 0){
                        this.collections = res.data;
                    }
                }
            );
    }

    /**
     * Select field type properties
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

    /** Add collection */
    addCollection(){
        const fieldName = 'new_collection';
        const control = this.form.get(fieldName);
        if(!control.valid){
            return false;
        }
        this.formErrors[fieldName] = '';
        const value = control.value;

        if( this.collections.indexOf(value) > -1){
            this.formErrors[fieldName] += this.validationMessages[fieldName].exists;
            return false;
        }
        this.collections.push(value);
        this.model.collection = value;
        this.elementAddCollectionBlock.nativeElement.style.display = 'none';
        return true;
    }

    /** Delete collection */
    deleteCollection(popover: NgbPopover){
        if(!this.model.collection){
            return;
        }

        if(popover.isOpen()){
            popover.close();
            return;
        }

        let popoverContent: any;
        //popover.container = 'body';
        popover.placement = 'top';
        popover.popoverTitle = 'Confirm';

        let confirm = function(){
            this.loading = true;
            this.collectionsService.deleteItemByName(this.model.collection)
                .then((res) => {
                    if(res.success){

                        let index = this.collections.indexOf(this.model.collection);
                        if(index > -1){
                            this.collections.splice(index, 1);
                            this.model.collection = this.collections[0];
                        }
                        popover.close();

                    } else {
                        if(res.msg){
                            popoverContent.message = res.msg;
                        }
                    }
                    this.loading = false;
                });
        };

        popoverContent = {
            p: popover,
            confirm: confirm.bind(this),
            message: ''
        };

        popover.open(popoverContent);
    }

    /** Add group */
    addGroup(){
        const fieldName = 'new_group';
        const control = this.fieldForm.get(fieldName);
        if( !control || !control.valid || !control.value ){
            return false;
        }
        this.formErrors['fld_'+fieldName] = '';
        const value = control.value;
        let index = this.model.groups.indexOf(value);
        if( index > -1 ){
            this.formErrors['fld_'+fieldName] += this.validationMessages['fld_'+fieldName].exists;
            return false;
        }
        this.model.groups.push(value);
        this.fieldModel.group = value;
        this.elementAddGroupBlock.nativeElement.style.display = 'none';
        return true;
    }

    /** Delete group */
    deleteGroup() {
        let currentGroupName = this.fieldForm.get('group').value;
        let index = _.findIndex(this.model.fields, {group: currentGroupName});
        this.errorFieldMessage = '';
        if (index > -1) {
            this.errorFieldMessage = 'You can\'t delete a group because it is not empty.';
            return;
        }
        index = this.model.groups.indexOf(currentGroupName);
        if (index > -1) {
            this.model.groups.splice(index, 1);
        }
    }

    /**
     * Edit field
     * @param field
     */
    editField(field: ContentField) {
        this.action = 'edit_field';
        this.fieldModel = _.clone(field);
        this.fieldForm.setValue(_.omit(this.fieldModel, ['id', 'input_type_options', 'output_type_options']));
        this.currentFieldName = this.fieldModel.name;
        this.fld_submitted = false;
    }

    /**
     * Copy field
     * @param field
     */
    copyField(field: ContentField) {
        this.action = 'add_field';
        this.fieldModel = _.clone(field);
        this.fieldModel.name = '';
        this.fieldForm.setValue(this.fieldModel);
        this.currentFieldName = '';
        this.fld_submitted = false;
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
        this.action = 'add_field';
        this.errorMessage = '';
        this.errorFieldMessage = '';
        this.fld_submitted = false;
        this.currentFieldName = '';
        this.fieldForm.reset();
    }

    /** Cancel edit field */
    editFieldCancel(){
        this.resetFieldForm();
        this.onValueChanged('fieldForm', 'fld_');
    }

    /** Submit field */
    submitField() {
        this.fld_submitted = true;

        if (!this.fieldForm.valid) {
            this.onValueChanged('fieldForm', 'fld_');
            this.fld_submitted = false;
            return;
        }

        let data = this.fieldForm.value;
        let index = _.findIndex(this.model.fields, {name: data.name});
        if (index > -1 && this.currentFieldName != data.name) {
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }

        if (this.action == 'add_field') {
            this.model.fields.push(_.clone(data));
        }
        else if (this.action == 'edit_field') {
            index = _.findIndex(this.model.fields, {name: this.currentFieldName});
            if (index > -1) {
                this.model.fields[index] = _.clone(data);
            }
        }
        this.resetFieldForm();
    }

    save() {
        this.submitted = true;

        if(!this.form.valid){
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }

        let callback = function(res: any){
            if(res.success){
                this.closeModal();
            } else {
                if(res.msg){
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };

        if(this.model.id){
            this.dataService.update(this.model).then(callback.bind(this));
        } else {
            this.dataService.create(this.model).then(callback.bind(this));
        }
    }
}

@Component({
    selector: 'shk-content-types',
    templateUrl: 'templates/page-content_types.html',
    providers: [ ContentTypesService ]
})
export class ContentTypesComponent extends PageTableAbstractComponent {

    title: string = 'Типы контента';

    constructor(
        dataService: ContentTypesService,
        activeModal: NgbActiveModal,
        modalService: NgbModal,
        titleService: Title
    ) {
        super(dataService, activeModal, modalService, titleService);
    }

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
            name: 'is_active',
            title: 'Статус',
            output_type: 'boolean'
        }
    ];

    getModalContent(){
        return ContentTypeModalContent;
    }

    // ngOnInit(): void {
    //     this.setTitle( this.title );
    //     this.getList();
    // }

    // getList(): void {
    //     this.loading = true;
    //     this.contentTypesService.getList()
    //         .subscribe(
    //             items => {
    //                 this.items = items;
    //                 this.loading = false;
    //             },
    //             error => this.errorMessage = <any>error);
    // }

    // modalOpen( itemId?: number, isItemCopy?: boolean ): void {
    //     this.modalRef = this.modalService.open(ContentTypeModalContent, {size: 'lg'});
    //     this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy
    //         ? 'Edit content type'
    //         : 'Add content type';
    //     this.modalRef.componentInstance.itemId = itemId || 0;
    //     this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
    //     this.modalRef.result.then((result) => {
    //         this.getList();
    //     }, (reason) => {
    //         //console.log( 'reason', reason );
    //     });
    // }
    //
    // copyItem( itemId: number ): void {
    //     this.modalOpen( itemId, true );
    // }
    //
    // modalClose(): void {
    //     this.modalRef.close();
    // }

    // deleteItemConfirm( itemId ): void{
    //     this.modalRef = this.modalService.open(ConfirmModalContent);
    //     this.modalRef.componentInstance.modalTitle = 'Confirm';
    //     this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
    //     this.modalRef.result.then((result) => {
    //         if( result == 'accept' ){
    //             this.deleteItem( itemId );
    //         }
    //     }, (reason) => {
    //
    //     });
    // }

    // deleteItem( itemId: number ): void{
    //     this.contentTypesService.deleteItem( itemId )
    //         .then((res) => {
    //             if( res.success ){
    //                 this.getList();
    //             } else {
    //                 if( res.msg ){
    //                     //this.errorMessage = res.msg;
    //                 }
    //             }
    //         });
    // }

    // selectAll( event ): void{
    //     this.selectedIds = [];
    //     if( event.target.checked ){
    //         for( let item of this.items ){
    //             this.selectedIds.push( item.id );
    //         }
    //     }
    // }
    //
    // setSelected( event, itemId: string ): void{
    //     const index = this.selectedIds.indexOf( itemId );
    //     if( event.target.checked ){
    //         if( index == -1 ){
    //             this.selectedIds.push( itemId );
    //         }
    //     } else if( index > -1 ){
    //         this.selectedIds.splice( index, 1 );
    //     }
    // }
    //
    // getIsSelected( itemId: string ): boolean{
    //     return this.selectedIds.lastIndexOf( itemId ) > -1;
    // }

    // actionRequest(actionValue : [string, number]): void {
    //     switch(actionValue[0]){
    //         case 'edit':
    //             this.modalOpen(actionValue[1]);
    //             break;
    //         case 'copy':
    //             this.modalOpen(actionValue[1], true);
    //             break;
    //         case 'delete':
    //             this.deleteItemConfirm(actionValue[1]);
    //             break;
    //     }
    // }
}