import {Component, Injectable} from '@angular/core';
import {NgbModal, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

import {FieldType} from './models/field-type.model';
import {FieldTypeProperty} from './models/field-type-property.model';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {ModalContentAbstractComponent} from '../modal.abstract';
import {QueryOptions} from '../models/query-options';

import {SystemNameService} from '../services/system-name.service';
import {FieldTypesService} from './services/field-types.service';

@Component({
    selector: 'app-field-type-modal-content',
    templateUrl: 'templates/modal-field_type.html'
})
export class FieldTypeModalContentComponent extends ModalContentAbstractComponent<FieldType> {

    model: FieldType = new FieldType(0, '', '', '', true, [], []);

    formFields = {
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
                pattern: 'The name must contain only Latin letters and numbers.'
            }
        },
        description: {
            fieldLabel: 'DESCRIPTION',
            value: '',
            validators: [],
            messages: {}
        },
        isActive: {
            fieldLabel: 'ACTIVE',
            value: true,
            validators: [],
            messages: {}
        }
    };

    constructor(
        public fb: FormBuilder,
        public dataService: FieldTypesService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        public translateService: TranslateService
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig, translateService);
    }

    addRow(type: string) {
        if (!this.model[type]) {
            this.model[type] = [];
        }
        this.model[type].push(new FieldTypeProperty('', '', ''));
    }

    deleteRow(index: number, type: string) {
        if (this.model[type].length < index + 1) {
            return;
        }
        this.model[type].splice(index, 1);
    }

    save() {
        this.submitted = true;

        if (!this.form.valid) {
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

    getModalContent() {
        return FieldTypeModalContentComponent;
    }

}
