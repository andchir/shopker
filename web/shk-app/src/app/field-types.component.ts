import { Component, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { FieldType } from './models/field-type.model';
import { FieldTypeProperty } from './models/field-type-property.model';

import { DataService } from './services/data-service.abstract';
import { SystemNameService } from './services/system-name.service';
import { PageTableAbstractComponent, ModalContentAbstractComponent } from './page-table.abstract';

@Injectable()
export class FieldTypesService extends DataService {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/field_types');
    }

    extractData(res: Response): any {
        let body = res.json();
        if(body.data){
            if(Array.isArray(body.data)){
                body.data = body.data as FieldType[];
            } else {
                body.data = body.data as FieldType;
            }
        }
        return body;
    }
}

@Component({
    selector: 'field-type-modal-content',
    templateUrl: 'templates/modal-field_type.html',
    providers: [ FieldTypesService, SystemNameService ]
})
export class FieldTypeModalContent extends ModalContentAbstractComponent {

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
    selector: 'shk-field-types',
    templateUrl: 'templates/catalog-field_types.html',
    providers: [ FieldTypesService ]
})
export class FieldTypesComponent extends PageTableAbstractComponent {
    title: string = 'Field types';

    constructor(
        dataService: FieldTypesService,
        activeModal: NgbActiveModal,
        modalService: NgbModal,
        titleService: Title
    ) {
        super(dataService, activeModal, modalService, titleService);
    }

    tableFields = [
        {
            name: 'id',
            title: 'ID',
            output_type: 'text',
            output_properties: {}
        },
        {
            name: 'title',
            title: 'Название',
            output_type: 'text',
            output_properties: {}
        },
        {
            name: 'name',
            title: 'Системное имя',
            output_type: 'text',
            output_properties: {}
        },
        {
            name: 'isActive',
            title: 'Статус',
            output_type: 'boolean',
            output_properties: {}
        }
    ];

    getModalContent(){
        return FieldTypeModalContent;
    }

}
