import { Component, Injectable, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ContentTypesService } from './services/content_types.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ContentField } from './models/content_field.model';
import { ContentType } from './models/content_type.model';
import { ConfirmModalContent } from './app.component';
import { FieldData } from './models/field-data.model';
import * as _ from "lodash";

import { DataService } from './services/data-service.abstract';
import { PageTableAbstractComponent, ModalContentAbstractComponent } from './page-table.abstract';

@Injectable()
export class FieldTypesService extends DataService {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/field_types');
    }

}

@Component({
    selector: 'field-type-modal-content',
    templateUrl: 'templates/modal_field_type.html',
    providers: [ FieldTypesService ]
})
export class FieldTypeModalContent extends ModalContentAbstractComponent {

    properties: FieldData[];

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
        }
    };

    constructor(
        fb: FormBuilder,
        dataService: FieldTypesService,
        activeModal: NgbActiveModal,
        tooltipConfig: NgbTooltipConfig
    ) {
        super(fb, dataService, activeModal, tooltipConfig);

        this.properties = [new FieldData(1,'','','')];
    }

    ngOnInit(): void {
        this.buildForm(this.formFields);
    }

    addRow(){
        this.properties.push(new FieldData(1,'','',''));
    }

    deleteRow(index){
        if(this.properties.length < index + 1){
            return;
        }
        this.properties.splice(index, 1);
    }

    save(){
        this.submitted = true;
        if(!this.form.valid){
            this.onValueChanged(this.form.value);
            this.submitted = false;
        }
        else {
            let data = this.form.value;
            data.properties = this.properties;
            this.dataService.create(data)
                .then((res) => {
                    if( res.success ){
                        this.closeModal();
                    } else {
                        if( res.msg ){
                            this.errorMessage = res.msg;
                        }
                    }
                });
        }
    }

}

@Component({
    selector: 'shk-field-types',
    templateUrl: 'templates/page_field_types.html',
    providers: [ FieldTypesService ]
})
export class FieldTypesComponent extends PageTableAbstractComponent {
    title: string = 'Field types';

    constructor(
        //private fb: FormBuilder,
        dataService: FieldTypesService,
        activeModal: NgbActiveModal,
        modalService: NgbModal,
        titleService: Title
    ) {
        super(dataService, activeModal, modalService, titleService);
    }

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
        }
    ];

    getModalContent(){
        return FieldTypeModalContent;
    }

}
