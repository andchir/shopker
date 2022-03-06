import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';
import {ContentField} from './models/content_field.model';
import {FieldTypesService} from './services/field-types.service';
import {QueryOptions} from '../models/query-options';
import {FieldType} from './models/field-type.model';

@Component({
    selector: 'app-modal-content-type-field',
    templateUrl: 'templates/modal-content-type-field.html',
    providers: [FieldTypesService]
})
export class ModalContentTypeFieldComponent extends AppModalAbstractComponent<ContentType> implements OnInit, OnDestroy {

    @ViewChild('formEl') formEl: ElementRef;
    @ViewChild('panelAddGroup', { static: true }) panelAddGroup;

    errorMessage = '';
    model = new ContentType(0, '', '', '', '', [], [], true);
    fieldModel = new ContentField(0, '', '', '', '', {}, '', {}, '');
    form = new FormGroup({
        id: new FormControl('', []),
        title: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]),
        description: new FormControl('', []),
        inputType: new FormControl('', [Validators.required]),
        outputType: new FormControl('', [Validators.required]),
        group: new FormControl('', [Validators.required]),
        required: new FormControl(false, []),
        showInTable: new FormControl(false, []),
        showOnPage: new FormControl(false, []),
        showInList: new FormControl(false, []),
        isFilter: new FormControl(false, []),
    });
    fieldTypes: FieldType[];
    contentType: ContentType;
    groups: string[];
    fieldTypeProperties = {
        input: [],
        output: []
    };
    
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: ContentTypesService,
        private fieldTypesService: FieldTypesService,
        private translateService: TranslateService
    ) {
        super(ref, config, dataService);
    }

    ngOnInit(): void {
        this.fieldModel = this.config.data.field
            || new ContentField(0, '', '', '', 'text', {}, 'text', {}, '');
        this.contentType = this.config.data.contentType as ContentType;
        this.groups = this.contentType.groups.slice();
        super.ngOnInit();
        this.getFieldTypes();
    }

    getFieldTypes(): void {
        const options = new QueryOptions(1, 0, 'title', 'asc', 'title');
        this.fieldTypesService.getListPage(options)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    this.fieldTypes = res.items;
                    this.selectFieldTypeProperties('input');
                    this.selectFieldTypeProperties('output');
                },
                error: (err) => {
                    this.errorMessage = err;
                }
            });
    }

    openBlock(containerElement: HTMLElement, inputElement?: HTMLInputElement, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (containerElement.className.indexOf('hidden') === -1) {
            containerElement.classList.add('hidden');
            return;
        }
        containerElement.classList.remove('hidden');
        if (inputElement) {
            inputElement.focus();
        }
        this.errorMessage = '';
    }

    closeBlock(containerElement: HTMLElement, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        containerElement.classList.add('hidden');
    }

    deleteGroup(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const currentGroupName = this.form.controls['group'].value;
        const index = this.contentType.fields.findIndex((item) => {
            return item.group === currentGroupName;
        });
        this.errorMessage = '';
        if (index > -1) {
            this.errorMessage = this.getLangString('YOU_CANT_DELETE_NOTEMPTY_GROUP');
            return;
        }
        const groupIndex = this.groups.indexOf(currentGroupName);
        if (groupIndex > -1) {
            this.groups.splice(groupIndex, 1);
            this.form.controls['group'].setValue(this.groups[0] || null);
        }
    }

    addGroup(inputElement: HTMLInputElement, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        if (!inputElement.value) {
            inputElement.focus();
            return;
        }
        const value = inputElement.value;
        if (this.groups.indexOf(value) > -1) {
            this.errorMessage = this.getLangString('GROUP_ALREADY_EXISTS');
            return;
        }
        this.groups.push(value);
        this.form.controls['group'].setValue(value);
        inputElement.value = '';
        this.panelAddGroup.nativeElement.classList.add('hidden');
    }

    updateControls(): void {
        if (!this.fieldModel) {
            return;
        }
        const controls = this.form.controls;
        Object.keys(controls).forEach((key) => {
            if (typeof this.fieldModel[key] !== 'undefined') {
                if (Array.isArray(this.fieldModel[key]) && this.arrayFields[key]) {
                    this.fieldModel[key].forEach((value, index) => {
                        this.arrayFieldAdd(key, value);
                    });
                } else {
                    controls[key].setValue(this.fieldModel[key]);
                }
            }
        });
    }

    saveData(autoClose = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        if (!this.form.valid) {
            this.formGroupMarkTouched(this.form);
            this.focusFormError();
            return;
        }
        const data = Object.assign({}, this.form.value);
        data.inputProperties = Object.assign({}, this.fieldModel.inputProperties);
        data.outputProperties = Object.assign({}, this.fieldModel.outputProperties);
        this.ref.close(data);
    }

    selectFieldTypeProperties(type: string, fieldTypeName?: string): void {
        if (fieldTypeName) {
            this.form.controls[`${type}Type`].setValue(fieldTypeName);
        } else {
            fieldTypeName = this.form.controls[`${type}Type`].value;
        }
        const fieldTypeIndex = this.fieldTypes.findIndex((fType) => {
            return fType.name === fieldTypeName;
        });
        if (fieldTypeIndex === -1) {
            this.fieldTypeProperties[type] = [];
            return;
        }
        const fieldType = this.fieldTypes[fieldTypeIndex];
        const modelPropertiesField = `${type}Properties`;
        this.fieldTypeProperties[type].splice(0);
        fieldType[type + 'Properties'].forEach((v, i) => {
            this.fieldTypeProperties[type].push(v);
        });
        const propNames = fieldType[`${type}Properties`].map((prop) => {
            return prop.name;
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
        // if (type === 'input' && !this.model.outputType) {
        //     this.selectFieldTypeProperties('output', fieldTypeName);
        // }
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }
}
