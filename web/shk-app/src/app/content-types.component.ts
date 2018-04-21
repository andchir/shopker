import { Component, OnInit, Input, ViewChild, Injectable, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

import { FieldTypesService } from './field-types.component';
import { ContentField } from './models/content_field.model';
import { ContentType } from './models/content_type.model';
import { FieldType } from "./models/field-type.model";
import { FieldTypeProperty } from './models/field-type-property.model';
import { QueryOptions } from './models/query-options';
import { PageTableAbstractComponent } from './page-table.abstract';
import { ModalContentAbstractComponent } from './modal.abstract';

import { ContentTypesService } from './services/content_types.service';
import { CollectionsService } from './services/collections.service';
import { SystemNameService } from './services/system-name.service';

@Component({
    selector: 'content-type-modal-content',
    templateUrl: 'templates/modal-content_types.html',
    providers: [ ContentTypesService, FieldTypesService, CollectionsService, SystemNameService ]
})
export class ContentTypeModalContent extends ModalContentAbstractComponent<ContentType> {

    @ViewChild('addCollectionBlock') elementAddCollectionBlock;
    @ViewChild('addGroupBlock') elementAddGroupBlock;
    modalRef: NgbModalRef;

    constructor(
        public fb: FormBuilder,
        public dataService: ContentTypesService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        private fieldTypesService: FieldTypesService,
        private collectionsService: CollectionsService,
        private modalService: NgbModal
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);
    }

    model = new ContentType(0, '', '', '', 'products', [], ['General','Service'], true);
    fieldModel = new ContentField(0, '', '', '', '', {}, '', {}, '', false, false, false);
    fld_submitted: boolean = false;
    errorFieldMessage: string;
    action: string = 'add_field';
    currentFieldName = '';
    collections: string[] = ['products'];
    fieldForm: FormGroup;
    fieldTypes: FieldType[];
    fieldTypeProperties = {
        input: [],
        output: []
    };

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
        newCollection: {
            value: '',
            validators: [Validators.pattern('[A-Za-z0-9_-]+')],
            messages: {
                pattern: 'The name must contain only Latin letters and numbers.',
                exists: 'Collection with the same name already exists.'
            }
        },
        isActive: {
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
        inputType: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Input type is required.'
            }
        },
        outputType: {
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
        newGroup: {
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
        showInTable: {
            value: '',
            validators: [],
            messages: {}
        },
        showInList: {
            value: '',
            validators: [],
            messages: {}
        },
        isFilter: {
            value: '',
            validators: [],
            messages: {}
        }
    };

    /** On initialize */
    ngOnInit(): void {
        ModalContentAbstractComponent.prototype.ngOnInit.call(this);
        this.getFieldTypes();
        this.getCollectionsList();
    }

    buildForm(): void {
        ModalContentAbstractComponent.prototype.buildForm.call(this);

        let controls = this.buildControls(this.fieldsFormOptions, 'fieldModel', 'fld_');
        this.fieldForm = this.fb.group(controls);
        this.fieldForm.valueChanges
            .subscribe(() => this.onValueChanged('fieldForm', 'fld_'));
    }

    /** Get field types */
    getFieldTypes(): void {
        let options = new QueryOptions('title', 'asc', 0, 0, 1);
        this.fieldTypesService.getListPage(options)
            .subscribe(
                data => {
                    this.fieldTypes = data.items;
                },
                error =>  this.errorMessage = error
            );
    }

    /** Get collections list */
    getCollectionsList(): void {
        this.collectionsService.getList()
            .subscribe(data => {
                    if(data.length > 0){
                        this.collections = data;
                    }
                }
            );
    }

    /**
     * Select field type properties
     * @param {string} type
     * @param {string} fieldTypeName
     */
    selectFieldTypeProperties(type: string, fieldTypeName?: string): void {
        if(fieldTypeName){
            this.fieldModel[type + 'Type'] = fieldTypeName;
        }
        let fieldType = _.find(this.fieldTypes, {name: this.fieldModel[type + 'Type']});
        if(!fieldType){
            this.fieldTypeProperties[type] = [];
            return;
        }

        const modelPropertiesField = type + 'Properties';
        const propNames = _.map(fieldType[type + 'Properties'], 'name');
        this.fieldTypeProperties[type].splice(0);

        fieldType[type + 'Properties'].forEach((v, i) => {
            this.fieldTypeProperties[type].push(v);
        });

        for (let prop in this.fieldModel[modelPropertiesField]) {
            if (this.fieldModel[modelPropertiesField].hasOwnProperty(prop)) {
                if (propNames.indexOf(prop) === -1) {
                    delete this.fieldModel[modelPropertiesField][prop];
                }
            }
        }

        for (let i in this.fieldTypeProperties[type]) {
            if (this.fieldTypeProperties[type].hasOwnProperty(i)) {
                let fldName = this.fieldTypeProperties[type][i].name;
                if (typeof this.fieldModel[modelPropertiesField][fldName] == 'undefined') {
                    this.fieldModel[modelPropertiesField][fldName] = this.fieldTypeProperties[type][i].default_value;
                }
            }
        }
        if (type == 'input' && !this.fieldModel.outputType) {
            this.selectFieldTypeProperties('output', this.fieldModel.inputType);
        }
    }

    /** Add collection */
    addCollection(){
        const fieldName = 'newCollection';
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
                .subscribe((data) => {
                    let index = this.collections.indexOf(this.model.collection);
                    if(index > -1){
                        this.collections.splice(index, 1);
                        this.model.collection = this.collections[0];
                    }
                    popover.close();
                    this.loading = false;
                }, (err) => {
                    this.errorMessage = err.error || 'Error.';
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
        const fieldName = 'newGroup';
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
        this.fieldModel = _.cloneDeep(field);
        let newFormValue = {};
        for (const key in this.fieldsFormOptions) {
            if (!this.fieldsFormOptions.hasOwnProperty(key)) {
                continue;
            }
            newFormValue[key] = field[key] || '';
        }
        this.fieldForm.setValue(newFormValue);
        this.currentFieldName = this.fieldModel.name;
        this.fld_submitted = false;
    }

    /**
     * Copy field
     * @param field
     */
    copyField(field: ContentField) {
        this.action = 'add_field';
        this.fieldModel = _.cloneDeep(field);
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
        this.fieldModel = new ContentField(0, '', '', '', '', {}, '', {}, '', false, false, false);
    }

    /** Cancel edit field */
    editFieldCancel(){
        this.resetFieldForm();
        this.onValueChanged('fieldForm', 'fld_');
    }

    /** Change field order index */
    fieldMove(index: number, direction: string): void{
        if((direction == 'up' && index === 0)
            || (direction == 'down' && index === this.model.fields.length - 1)){
            return;
        }
        let newIndex = direction == 'up' ? index - 1 : index + 1;
        let field = this.model.fields[index];

        this.model.fields.splice(index, 1);
        this.model.fields.splice(newIndex, 0, field);
    }

    /** Submit field */
    submitField() {
        this.fld_submitted = true;
        if (!this.fieldForm.valid) {
            this.onValueChanged('fieldForm', 'fld_');
            this.fld_submitted = false;
            return;
        }
        let data = _.cloneDeep(this.fieldModel);
        data.inputProperties = _.extend({}, this.fieldModel.inputProperties);
        data.outputProperties = _.extend({}, this.fieldModel.outputProperties);

        let index = _.findIndex(this.model.fields, {name: data.name});
        if (index > -1 && this.currentFieldName != data.name) {
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }

        if (this.action == 'add_field') {
            this.model.fields.push(data);
        }
        else if (this.action == 'edit_field') {
            index = _.findIndex(this.model.fields, {name: this.currentFieldName});
            if (index > -1) {
                this.model.fields[index] = data;
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

        this.loading = true;
        this.saveRequest()
            .subscribe(() => this.closeModal(),
                err => {
                    this.errorMessage = err.error || 'Error.';
                    this.submitted = false;
                    this.loading = false;
                });
    }
}

@Component({
    selector: 'shk-content-types',
    templateUrl: 'templates/catalog-content_types.html',
    providers: [ ContentTypesService ]
})
export class ContentTypesComponent extends PageTableAbstractComponent<ContentType> {

    title: string = 'Типы контента';
    queryOptions: QueryOptions = new QueryOptions('name', 'asc', 1, 10, 0, 0);

    constructor(
        dataService: ContentTypesService,
        activeModal: NgbActiveModal,
        modalService: NgbModal
    ) {
        super(dataService, activeModal, modalService);
    }

    tableFields = [
        {
            name: 'id',
            sortName: 'id',
            title: 'ID',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'title',
            sortName: 'title',
            title: 'TITLE',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'name',
            sortName: 'name',
            title: 'SYSTEM_NAME',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'collection',
            sortName: 'collection',
            title: 'COLLECTION',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'isActive',
            sortName: 'isActive',
            title: 'STATUS',
            outputType: 'boolean',
            outputProperties: {}
        }
    ];

    getModalContent(){
        return ContentTypeModalContent;
    }

}