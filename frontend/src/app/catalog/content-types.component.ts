import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {find, map, findIndex, cloneDeep, extend} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {FormFieldInterface} from '../models/form-field.interface';
import {ContentField} from './models/content_field.model';
import {ContentType} from './models/content_type.model';
import {FieldType} from './models/field-type.model';
import {FieldTypeProperty} from './models/field-type-property.model';
import {QueryOptions} from '../models/query-options';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {ModalContentAbstractComponent} from '../modal.abstract';

import {ContentTypesService} from './services/content_types.service';
import {SystemNameService} from '../services/system-name.service';
import {CollectionsService} from './services/collections.service';
import {FieldTypesService} from './services/field-types.service';
import {SortData} from '../components/sorting-dnd.conponent';

@Component({
    selector: 'app-content-type-modal-content',
    templateUrl: 'templates/modal-content_type.html'
})
export class ContentTypeModalContentComponent extends ModalContentAbstractComponent<ContentType> implements OnInit {

    @ViewChild('addCollectionBlock', { static: true }) elementAddCollectionBlock;
    @ViewChild('addGroupBlock', { static: true }) elementAddGroupBlock;
    @ViewChild('accordion', { static: true }) accordion;
    @ViewChild('blockFieldList', { static: false }) blockFieldList;
    modalRef: NgbModalRef;

    model = new ContentType(0, '', '', '', 'products', [], ['General', 'Service'], true);
    fieldModel = new ContentField(0, '', '', '', '', {}, '', {}, '', false, false, false);
    sortData: SortData[] = [];
    sortingfieldName = '';
    fld_submitted = false;
    errorFieldMessage: string;
    action = 'add_field';
    currentFieldName = '';
    collections: string[] = ['products'];
    fieldForm: FormGroup;
    fieldTypes: FieldType[];
    fieldTypeProperties = {
        input: [],
        output: []
    };

    formFields: FormFieldInterface = {
        name: {
            fieldLabel: 'SYSTEM_NAME',
            value: '',
            validators: [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')],
            messages: {
                pattern: 'The name must contain only Latin letters and numbers.'
            }
        },
        title: {
            fieldLabel: 'TITLE',
            value: '',
            validators: [Validators.required],
            messages: {}
        },
        description: {
            fieldLabel: 'DESCRIPTION',
            value: '',
            validators: [],
            messages: {}
        },
        collection: {
            fieldLabel: 'COLLECTION',
            value: '',
            validators: [Validators.required],
            messages: {}
        },
        newCollection: {
            fieldLabel: 'COLLECTION',
            value: '',
            validators: [Validators.pattern('[A-Za-z0-9_-]+')],
            messages: {
                pattern: 'The name must contain only Latin letters and numbers.',
                exists: 'Collection with the same name already exists.'
            }
        },
        isActive: {
            fieldLabel: 'ACTIVE',
            value: '',
            validators: [],
            messages: {}
        }
    };

    fieldsFormOptions = {
        title: {
            fieldLabel: 'TITLE',
            value: '',
            validators: [Validators.required],
            messages: {}
        },
        name: {
            fieldLabel: 'SYSTEM_NAME',
            value: '',
            validators: [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')],
            messages: {
                pattern: 'The name must contain only Latin letters.'
            }
        },
        description: {
            fieldLabel: 'DESCRIPTION',
            value: '',
            validators: [],
            messages: {}
        },
        inputType: {
            fieldLabel: 'INPUT_TYPE',
            value: '',
            validators: [Validators.required],
            messages: {}
        },
        outputType: {
            fieldLabel: 'OUTPUT_TYPE',
            value: '',
            validators: [Validators.required],
            messages: {}
        },
        group: {
            fieldLabel: 'GROUP',
            value: '',
            validators: [Validators.required],
            messages: {}
        },
        newGroup: {
            fieldLabel: 'GROUP',
            value: '',
            validators: [],
            messages: {}
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

    constructor(
        public fb: FormBuilder,
        public dataService: ContentTypesService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        public translateService: TranslateService,
        public elRef: ElementRef,
        private fieldTypesService: FieldTypesService,
        private collectionsService: CollectionsService,
        private modalService: NgbModal
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig, translateService, elRef);
    }

    /** On initialize */
    ngOnInit(): void {
        super.ngOnInit();
        this.getFieldTypes();
        this.getCollectionsList();
    }

    buildForm(): void {
        super.buildForm();

        const controls = this.buildControls(this.fieldsFormOptions, 'fieldModel', 'fld_');
        this.fieldForm = this.fb.group(controls);
        this.fieldForm.valueChanges
            .subscribe(() => this.onValueChanged('fieldForm', 'fld_'));
    }

    /** Get field types */
    getFieldTypes(): void {
        const options = new QueryOptions('title', 'asc', 0, 0, 1);
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
                    if (data.length > 0) {
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
        if (fieldTypeName) {
            this.fieldModel[type + 'Type'] = fieldTypeName;
        }
        const fieldType = find(this.fieldTypes, {name: this.fieldModel[type + 'Type']});
        if (!fieldType) {
            this.fieldTypeProperties[type] = [];
            return;
        }

        const modelPropertiesField = type + 'Properties';
        const propNames = map(fieldType[type + 'Properties'], 'name');
        this.fieldTypeProperties[type].splice(0);

        fieldType[type + 'Properties'].forEach((v, i) => {
            this.fieldTypeProperties[type].push(v);
        });

        for (const prop in this.fieldModel[modelPropertiesField]) {
            if (this.fieldModel[modelPropertiesField].hasOwnProperty(prop)) {
                if (propNames.indexOf(prop) === -1) {
                    delete this.fieldModel[modelPropertiesField][prop];
                }
            }
        }

        for (const i in this.fieldTypeProperties[type]) {
            if (this.fieldTypeProperties[type].hasOwnProperty(i)) {
                const fldName = this.fieldTypeProperties[type][i].name;
                if (typeof this.fieldModel[modelPropertiesField][fldName] === 'undefined') {
                    this.fieldModel[modelPropertiesField][fldName] = this.fieldTypeProperties[type][i].default_value;
                }
            }
        }
        if (type === 'input' && !this.fieldModel.outputType) {
            this.selectFieldTypeProperties('output', this.fieldModel.inputType);
        }
    }

    /** Add collection */
    addCollection() {
        const fieldName = 'newCollection';
        const control = this.form.get(fieldName);
        if (!control.valid || !control.value) {
            return false;
        }
        this.formErrors[fieldName] = '';
        const value = control.value;

        if (this.collections.indexOf(value) > -1) {
            this.formErrors[fieldName] += this.validationMessages[fieldName].exists;
            return false;
        }
        this.collections.push(value);
        this.model.collection = value;
        this.elementAddCollectionBlock.nativeElement.style.display = 'none';
        return true;
    }

    /** Delete collection */
    deleteCollection(popover: NgbPopover) {
        if (!this.model.collection) {
            return;
        }

        if (popover.isOpen()) {
            popover.close();
            return;
        }

        let popoverContent: any;
        popover.placement = 'top';
        popover.popoverTitle = this.getLangString('CONFIRM');

        const confirm = function() {
            this.loading = true;
            this.collectionsService.deleteItemByName(this.model.collection)
                .subscribe((data) => {
                    const index = this.collections.indexOf(this.model.collection);
                    if (index > -1) {
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
    addGroup() {
        const fieldName = 'newGroup';
        const control = this.fieldForm.get(fieldName);
        if (!control || !control.valid || !control.value) {
            return false;
        }
        this.formErrors['fld_' + fieldName] = '';
        const value = control.value;
        const index = this.model.groups.indexOf(value);
        if ( index > -1 ) {
            this.formErrors['fld_' + fieldName] += this.validationMessages['fld_' + fieldName].exists;
            return false;
        }
        this.model.groups.push(value);
        this.fieldModel.group = value;
        this.elementAddGroupBlock.nativeElement.style.display = 'none';
        return true;
    }

    /** Delete group */
    deleteGroup() {
        const currentGroupName = this.fieldForm.get('group').value;
        let index = findIndex(this.model.fields, {group: currentGroupName});
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
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields');
        this.action = 'edit_field';
        this.fieldModel = cloneDeep(field);
        const newFormValue = {};
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
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields');
        this.action = 'add_field';
        this.fieldModel = cloneDeep(field);
        this.fieldModel.name = '';
        this.fieldForm.setValue(this.fieldModel);
        this.currentFieldName = '';
        this.fld_submitted = false;
    }

    /**
     * Delete field
     * @param field
     */
    deleteField(field: ContentField) {
        const index = findIndex( this.model.fields, {name: field.name} );
        if (index === -1 ) {
            this.errorMessage = 'Field not found.';
            return;
        }
        this.model.fields.splice(index, 1);
    }

    /** Reset field form */
    resetFieldForm() {
        this.action = 'add_field';
        this.errorMessage = '';
        this.errorFieldMessage = '';
        this.fld_submitted = false;
        this.currentFieldName = '';
        this.fieldForm.reset();
        this.fieldModel = new ContentField(0, '', '', '', '', {}, '', {}, '', false, false, false);
    }

    /** Cancel edit field */
    editFieldCancel() {
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields', true);
        this.resetFieldForm();
        this.onValueChanged('fieldForm', 'fld_');
    }

    /** Change field order index */
    fieldMove(index: number, direction: string): void {
        if ((direction === 'up' && index === 0)
            || (direction === 'down' && index === this.model.fields.length - 1)) {
                return;
        }
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const field = this.model.fields[index];

        this.model.fields.splice(index, 1);
        this.model.fields.splice(newIndex, 0, field);
    }

    /** Submit field */
    submitField() {
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields', true);
        this.fld_submitted = true;
        if (!this.fieldForm.valid) {
            this.onValueChanged('fieldForm', 'fld_');
            this.fld_submitted = false;
            return;
        }
        const data = cloneDeep(this.fieldModel);
        data.inputProperties = extend({}, this.fieldModel.inputProperties);
        data.outputProperties = extend({}, this.fieldModel.outputProperties);

        let index = findIndex(this.model.fields, {name: data.name});
        if (index > -1 && this.currentFieldName !== data.name) {
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }

        if (this.action === 'add_field') {
            this.model.fields.push(data);
        } else if (this.action === 'edit_field') {
            index = findIndex(this.model.fields, {name: this.currentFieldName});
            if (index > -1) {
                this.model.fields[index] = data;
            }
        }
        this.resetFieldForm();
    }

    getFieldTypeProperty(inputType: string|null, propertyName: string): string|null {
        if (!inputType) {
            return null;
        }
        let output = null;
        const index = findIndex(this.fieldTypes, {name: inputType});
        if (index > -1 && typeof this.fieldTypes[index][propertyName] !== 'undefined') {
            output = this.fieldTypes[index][propertyName];
        }
        return output;
    }

    sortingInit(sortingFieldName: string, filterFieldName: string, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.sortingfieldName = sortingFieldName;
        let filteredData;
        if (filterFieldName) {
            filteredData = this.model.fields.filter((field) => {
                return field[filterFieldName];
            });
        } else {
            filteredData = this.model.fields;
        }
        if (sortingFieldName) {
            filteredData.sort(function(a, b) {
                return a[sortingFieldName] - b[sortingFieldName]
            });
        }
        this.sortData = [];
        filteredData.forEach((data) => {
            this.sortData.push({
                name: data['name'],
                title: data['title']
            });
        });
        this.blockFieldList.nativeElement.style.display = 'none';
    }

    sortingApply(): void {
        if (this.sortingfieldName) {
            this.sortData.forEach((field, index) => {
                const ind = this.model.fields.findIndex((fld) => {
                    return fld.name === field.name;
                });
                if (ind > -1) {
                    this.model.fields[ind][this.sortingfieldName] = index;
                }
            });
        } else {
            const sortedNames = this.sortData.map((item) => {
                return item['name'];
            });
            this.model.fields.sort(function(a, b) {
                return sortedNames.indexOf(a['name']) - sortedNames.indexOf(b['name']);
            });
        }
        this.sortingReset();
    }

    sortingReset(): void {
        const index = findIndex(this.model.fields, {name: this.currentFieldName});
        if (index > -1) {
            this.action = 'edit_field';
        } else {
            this.action = 'add_field';
        }
        this.sortData.splice(0, this.sortData.length);
        this.sortingfieldName = '';
        this.blockFieldList.nativeElement.style.display = 'block';
    }

    save(autoClose = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.submitted = true;
        if (this.sortData.length > 0) {
            this.sortingApply();
        }
        setTimeout(() => {
            if (!this.form.valid) {
                this.onValueChanged('form');
                this.submitted = false;
                return;
            }
            this.loading = true;
            this.saveRequest()
                .subscribe({
                    next: (res) => {
                        if (autoClose) {
                            this.closeModal();
                        } else if (res && res['id']) {
                            this.model.id = res['id'];
                            this.onAfterGetData();
                            this.isEditMode = true;
                        }
                        this.closeReason = 'updated';
                        this.loading = false;
                        this.submitted = false;
                    },
                    error: err => {
                        this.errorMessage = err.error || 'Error.';
                        this.submitted = false;
                        this.loading = false;
                    }
                });
        }, 1);
    }
}

@Component({
    selector: 'app-shk-content-types',
    templateUrl: 'templates/catalog-content_types.html'
})
export class ContentTypesComponent extends PageTableAbstractComponent<ContentType> {

    title = 'Типы контента';
    queryOptions: QueryOptions = new QueryOptions('name', 'asc', 1, 10, 0, 0);

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

    constructor(
        public dataService: ContentTypesService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public translateService: TranslateService
    ) {
        super(dataService, activeModal, modalService, translateService);
    }

    getModalContent() {
        return ContentTypeModalContentComponent;
    }

    getModalElementId(itemId?: number): string {

        // if (this.isEditMode) {
        //     this.modalTitle = ` ${this.getLangString('CONTENT_TYPE')} #${this.itemId}`;
        // }

        return ['modal', 'content_type', itemId || 0].join('-');
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false, modalId = ''): void {
        super.setModalInputs(itemId, isItemCopy, modalId);
        this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy
            ? `${this.getLangString('CONTENT_TYPE')} #${itemId}`
            : this.getLangString('ADD_CONTENT_TYPE');
    }
}
