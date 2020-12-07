import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {
    NgbModal,
    NgbActiveModal,
    NgbModalRef,
    NgbPopover,
    NgbAccordion
} from '@ng-bootstrap/ng-bootstrap';
import {find, map, findIndex, cloneDeep, extend} from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

import {ContentField} from './models/content_field.model';
import {ContentType} from './models/content_type.model';
import {FieldType} from './models/field-type.model';
import {QueryOptions} from '../models/query-options';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {SortData} from '../components/sorting-dnd.conponent';
import {AppModalContentAbstractComponent} from '../components/app-modal-content.abstract';
import {ContentTypesService} from './services/content_types.service';
import {SystemNameService} from '../services/system-name.service';
import {CollectionsService} from './services/collections.service';
import {FieldTypesService} from './services/field-types.service';
import {FormFieldsErrors, FormFieldsOptions} from '../models/form-fields-options.interface';

@Component({
    selector: 'app-content-type-modal-content',
    templateUrl: 'templates/modal-content_type.html'
})
export class ContentTypeModalContentComponent extends AppModalContentAbstractComponent<ContentType> implements OnInit, OnDestroy {

    @ViewChild('addCollectionBlock', { static: true }) elementAddCollectionBlock;
    @ViewChild('addGroupBlock', { static: true }) elementAddGroupBlock;
    @ViewChild('accordion', { static: true }) accordion;
    @ViewChild('blockFieldList') blockFieldList;
    modalRef: NgbModalRef;
    
    private _secondFormFieldsErrors: FormFieldsErrors = {};
    model = new ContentType(0, '', '', '', 'products', [], ['General', 'Service'], true, false);
    fieldModel = new ContentField(0, '', '', '', '', {}, '', {}, '');
    sortData: SortData[] = [];
    sortingfieldName = '';
    fld_submitted = false;
    errorFieldMessage: string;
    action = 'add_field';
    currentFieldName = '';
    collections: string[] = ['products'];
    secondForm: FormGroup;
    fieldTypes: FieldType[];
    fieldTypeProperties = {
        input: [],
        output: []
    };
    
    formFields: FormFieldsOptions[] = [
        {
            name: 'title',
            validators: [Validators.required]
        },
        {
            name: 'name',
            validators: [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]
        },
        {
            name: 'description',
            validators: []
        },
        {
            name: 'collection',
            validators: [Validators.required]
        },
        {
            name: 'newCollection',
            validators: [Validators.pattern('[A-Za-z0-9_-]+')]
        },
        {
            name: 'isCreateByUsersAllowed',
            validators: []
        },
        {
            name: 'isActive',
            validators: []
        }
    ];
    
    secondFormFields: FormFieldsOptions[] = [
        {
            name: 'title',
            validators: [Validators.required]
        },
        {
            name: 'name',
            validators: [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]
        },
        {
            name: 'description',
            validators: []
        },
        {
            name: 'inputType',
            validators: [Validators.required]
        },
        {
            name: 'outputType',
            validators: [Validators.required]
        },
        {
            name: 'group',
            validators: [Validators.required]
        },
        {
            name: 'newGroup',
            validators: []
        },
        {
            name: 'required',
            validators: []
        },
        {
            name: 'showInTable',
            validators: []
        },
        {
            name: 'showOnPage',
            validators: []
        },
        {
            name: 'showInList',
            validators: []
        },
        {
            name: 'isFilter',
            validators: []
        }
    ];
    
    set secondFormErrors(formFieldsErrors: FormFieldsErrors) {
        for (const key in formFieldsErrors) {
            if (formFieldsErrors.hasOwnProperty(key)) {
                const control = this.getControl(this.form, null, key);
                if (control) {
                    control.setErrors({incorrect: true});
                }
            }
        }
        this._secondFormFieldsErrors = formFieldsErrors;
    }
    
    get secondFormErrors() {
        return this._secondFormFieldsErrors;
    }
    
    constructor(
        public fb: FormBuilder,
        public activeModal: NgbActiveModal,
        public translateService: TranslateService,
        public systemNameService: SystemNameService,
        public dataService: ContentTypesService,
        public elRef: ElementRef,
        private fieldTypesService: FieldTypesService,
        private collectionsService: CollectionsService,
        private modalService: NgbModal
    ) {
        super(fb, activeModal, translateService, systemNameService, dataService, elRef);
    }
    
    onAfterInit(): void {
        this.buildForm('secondForm', this.secondFormFields, this.secondFormErrors, 'fieldModel');
        this.onValueChanged('secondForm', this.secondFormErrors);
        
        this.getFieldTypes();
        this.getCollectionsList();
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
            this.secondForm.get(`${type}Type`).setValue(fieldTypeName);
        } else {
            fieldTypeName = this.secondForm.get(`${type}Type`).value;
        }
        this.fieldModel[`${type}Type`] = fieldTypeName;
        const fieldType = find(this.fieldTypes, {name: fieldTypeName});
        if (!fieldType) {
            this.fieldTypeProperties[type] = [];
            return;
        }
        const modelPropertiesField = `${type}Properties`;
        const propNames = map(fieldType[`${type}Properties`], 'name');
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
            this.selectFieldTypeProperties('output', fieldTypeName);
        }
    }
    
    addCollectionToggle(addCollectionField: HTMLInputElement, event?: MouseEvent): void {
        this.displayToggle(this.elementAddCollectionBlock.nativeElement);
        addCollectionField.value = '';
        this.onValueChanged();
        addCollectionField.focus();
    }

    /** Add collection */
    addCollection(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        const fieldName = 'newCollection';
        const control = this.form.get(fieldName);
        if (!control.valid || !control.value) {
            return false;
        }
        this.formErrors[fieldName] = '';
        const value = control.value;

        if (this.collections.indexOf(value) > -1) {
            this.getControl(this.form, null, fieldName).setErrors({exists: 'COLLECTION_EXISTS'});
            this.formErrors[fieldName] = this.getLangString('COLLECTION_EXISTS');
            return false;
        }
        this.collections.push(value);
        this.model.collection = value;
        this.getControl(this.form, null, fieldName).setValue(value);
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

        const confirm = () => {
            this.loading = true;
            this.collectionsService.deleteItemByName(this.model.collection)
                .subscribe((data) => {
                    const index = this.collections.indexOf(this.model.collection);
                    if (index > -1) {
                        this.collections.splice(index, 1);
                        this.model.collection = this.collections[0] || '';
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
    addGroup(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        const fieldName = 'newGroup';
        const control = this.secondForm.get(fieldName);
        if (!control || !control.valid || !control.value) {
            return false;
        }
        this.errorFieldMessage = '';
        this.secondFormErrors[fieldName] = '';
        const value = control.value;
        const index = this.model.groups.indexOf(value);
        if (index > -1) {
            this.getControl(this.secondForm, null, fieldName).setErrors({exists: 'GROUP_ALREADY_EXISTS'});
            this.secondFormErrors[fieldName] = this.getLangString('GROUP_ALREADY_EXISTS');
            return false;
        }
        this.model.groups.push(value);
        this.fieldModel.group = value;
        this.getControl(this.secondForm, null, 'group').setValue(this.fieldModel.group);
        this.elementAddGroupBlock.nativeElement.style.display = 'none';
        return true;
    }

    /** Delete group */
    deleteGroup() {
        const currentGroupName = this.secondForm.get('group').value;
        let index = findIndex(this.model.fields, {group: currentGroupName});
        this.errorFieldMessage = '';
        if (index > -1) {
            this.errorFieldMessage = this.getLangString('YOU_CANT_DELETE_NOTEMPTY_GROUP');
            return;
        }
        index = this.model.groups.indexOf(currentGroupName);
        if (index > -1) {
            this.model.groups.splice(index, 1);
        }
    }
    
    editField(field: ContentField, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields');
        this.action = 'edit_field';
        this.fieldModel = cloneDeep(field);
        const newFormValue = {};
        this.secondFormFields.forEach((opt) => {
            newFormValue[opt.name] = field[opt.name] || null;
        });
        this.secondForm.setValue(newFormValue);
        this.selectFieldTypeProperties('input');
        this.selectFieldTypeProperties('output');
        this.currentFieldName = this.fieldModel.name;
        this.fld_submitted = false;
    }
    
    copyField(field: ContentField, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields');
        this.action = 'add_field';
        this.fieldModel = cloneDeep(field);
        this.fieldModel.name = '';
        this.secondForm.setValue(this.fieldModel);
        this.currentFieldName = '';
        this.fld_submitted = false;
    }
    
    deleteField(field: ContentField, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
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
        this.secondForm.reset();
        this.fieldModel = new ContentField(0, '', '', '', '', {}, '', {}, '');
    }

    /** Cancel edit field */
    editFieldCancel(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields', true);
        this.resetFieldForm();
        this.onValueChanged('secondForm', this.secondFormErrors);
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
    submitField(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.errorFieldMessage = '';
        this.fld_submitted = true;
        if (!this.secondForm.valid) {
            this.formGroupMarkTouched(this.secondForm);
            this.onValueChanged('secondForm', this.secondFormErrors);
            this.fld_submitted = false;
            return;
        }
        const data = cloneDeep(Object.assign({}, this.secondForm.value, {
            inputProperties: this.fieldModel.inputProperties,
            outputProperties: this.fieldModel.outputProperties
        }));
        let index = findIndex(this.model.fields, {name: data.name});
        if (index > -1 && this.currentFieldName !== data.name) {
            this.errorFieldMessage = this.getLangString('FIELD_NAME_EXISTS');
            return;
        }
        this.toggleAccordion(this.accordion, 'accordion-content-type-fields', true);
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

    sortingApply(items?: any): void {
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
    
    getSaveRequest(data: ContentType): Observable<ContentType> {
        if (data.id) {
            return this.dataService.update(data);
        } else {
            return this.dataService.create(data);
        }
    }
    
    getFormData(): ContentType {
        if (this.sortData.length > 0) {
            this.sortingApply();
        }
        const data = this.form.value as ContentType;
        data.id = this.model.id || 0;
        data.groups = this.model.groups;
        data.fields = this.model.fields;
        return data;
    }

    toggleAccordion(accordion: NgbAccordion, panelId: string, display?: boolean): void {
        const isOpened = accordion.activeIds.indexOf(panelId) > -1;
        if (isOpened && display) {
            return;
        }
        accordion.toggle(panelId);
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
