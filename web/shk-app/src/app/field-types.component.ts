import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { FieldType } from './models/field-type.model';
import { FieldTypeProperty } from './models/field-type-property.model';

import { DataService } from './services/data-service.abstract';
import { SystemNameService } from './services/system-name.service';
import { PageTableAbstractComponent } from './page-table.abstract';
import { ModalContentAbstractComponent } from './modal.abstract';

@Injectable()
export class FieldTypesService extends DataService<FieldType> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('admin/field_types');
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

        let callback = function(res: any){
            console.log(res);
            // if(res.success){
            //     this.closeModal();
            // } else {
            //     if(res.msg){
            //         this.submitted = false;
            //         this.errorMessage = res.msg;
            //     }
            // }
        };
        //observer: PartialObserver

        if(this.model.id){
            this.dataService.update(this.model).subscribe(callback.bind(this));
        } else {
            this.dataService.create(this.model).subscribe(callback.bind(this));
        }
    }

}

@Component({
    selector: 'shk-field-types',
    templateUrl: 'templates/catalog-field_types.html',
    providers: [ FieldTypesService ]
})
export class FieldTypesComponent extends PageTableAbstractComponent<FieldType> {
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
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'title',
            title: 'Название',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'name',
            title: 'Системное имя',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'isActive',
            title: 'Статус',
            outputType: 'boolean',
            outputProperties: {}
        }
    ];

    getModalContent(){
        return FieldTypeModalContent;
    }

}
