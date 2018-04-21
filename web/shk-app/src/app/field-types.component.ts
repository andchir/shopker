import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbActiveModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { FieldType } from './models/field-type.model';
import { FieldTypeProperty } from './models/field-type-property.model';

import { DataService } from './services/data-service.abstract';
import { SystemNameService } from './services/system-name.service';
import { PageTableAbstractComponent } from './page-table.abstract';
import { ModalContentAbstractComponent } from './modal.abstract';
import { QueryOptions } from './models/query-options';

@Injectable()
export class FieldTypesService extends DataService<FieldType> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('field_types');
    }
}

@Component({
    selector: 'field-type-modal-content',
    templateUrl: 'templates/modal-field_type.html',
    providers: [ FieldTypesService, SystemNameService ]
})
export class FieldTypeModalContent extends ModalContentAbstractComponent<FieldType> {

    model: FieldType = new FieldType(0, '', '', '', true, [], []);

    formFields = {
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
                pattern: 'The name must contain only Latin letters and numbers.'
            }
        },
        description: {
            value: '',
            validators: [],
            messages: {}
        },
        isActive: {
            value: true,
            validators: [],
            messages: {}
        }
    };

    constructor(
        fb: FormBuilder,
        dataService: FieldTypesService,
        systemNameService: SystemNameService,
        activeModal: NgbActiveModal,
        tooltipConfig: NgbTooltipConfig
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);
    }

    addRow(type: string){
        if(!this.model[type]){
            this.model[type] = [];
        }
        this.model[type].push(new FieldTypeProperty('','',''));
    }

    deleteRow(index: number, type: string){
        if(this.model[type].length < index + 1){
            return;
        }
        this.model[type].splice(index, 1);
    }

    save(){
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
    selector: 'shk-field-types',
    templateUrl: 'templates/catalog-field_types.html',
    providers: [ FieldTypesService ]
})
export class FieldTypesComponent extends PageTableAbstractComponent<FieldType> {
    title: string = 'Field types';
    queryOptions: QueryOptions = new QueryOptions('name', 'asc', 1, 10, 0, 0);

    constructor(
        dataService: FieldTypesService,
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
            name: 'isActive',
            sortName: 'isActive',
            title: 'STATUS',
            outputType: 'boolean',
            outputProperties: {}
        }
    ];

    getModalContent(){
        return FieldTypeModalContent;
    }

}
