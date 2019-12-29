import {Component, ElementRef, Injectable} from '@angular/core';
import {NgbModal, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';

import {FieldType} from './models/field-type.model';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {QueryOptions} from '../models/query-options';
import {FieldTypesService} from './services/field-types.service';
import {AppModalContentAbstractComponent} from '../components/app-modal-content.abstract';
import {FormFieldsOptions} from '../models/form-fields-options.interface';
import {SystemNameService} from '../services/system-name.service';

@Component({
    selector: 'app-field-type-modal-content',
    templateUrl: 'templates/modal-field_type.html'
})
export class FieldTypeModalContentComponent extends AppModalContentAbstractComponent<FieldType> {

    model = new FieldType(0, '', '', '', true, [], []);

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
            name: 'isActive',
            validators: []
        },
        {
            name: 'inputProperties',
            validators: [],
            children: [
                {
                    name: 'name',
                    validators: [Validators.required]
                },
                {
                    name: 'title',
                    validators: [Validators.required]
                },
                {
                    name: 'default_value',
                    validators: [Validators.required]
                }
            ]
        },
        {
            name: 'outputProperties',
            validators: [],
            children: [
                {
                    name: 'name',
                    validators: [Validators.required]
                },
                {
                    name: 'title',
                    validators: [Validators.required]
                },
                {
                    name: 'default_value',
                    validators: [Validators.required]
                }
            ]
        }
    ];

    constructor(
        public fb: FormBuilder,
        public activeModal: NgbActiveModal,
        public translateService: TranslateService,
        public dataService: FieldTypesService,
        public elRef: ElementRef,
        private systemNameService: SystemNameService
    ) {
        super(fb, activeModal, translateService, dataService, elRef);
    }

    generateName(model): void {
        const title = this.getControl(this.form, null, 'title').value || '';
        model.name = this.systemNameService.generateName(title);
        this.getControl(this.form, null, 'name').setValue(model.name);
    }

}

@Component({
    selector: 'app-shk-field-types',
    templateUrl: 'templates/catalog-field_types.html'
})
export class FieldTypesComponent extends PageTableAbstractComponent<FieldType> {

    title = 'Field types';
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
            name: 'isActive',
            sortName: 'isActive',
            title: 'STATUS',
            outputType: 'boolean',
            outputProperties: {}
        }
    ];

    constructor(
        public dataService: FieldTypesService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public translateService: TranslateService
    ) {
        super(dataService, activeModal, modalService, translateService);
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false, modalId = ''): void {
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef.componentInstance.modalTitle = itemId
            ? `${this.getLangString('FIELD_TYPE')} #${itemId}`
            : this.getLangString('ADD_FIELD_TYPE');
        this.modalRef.componentInstance.modalId = modalId;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = isEditMode;
    }

    getModalElementId(itemId?: number): string {
        return ['modal', 'field_type', itemId || 0].join('-');
    }

    getModalContent() {
        return FieldTypeModalContentComponent;
    }
}
