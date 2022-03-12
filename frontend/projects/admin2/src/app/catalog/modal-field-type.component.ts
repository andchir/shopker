import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {FormFieldsData} from '../models/form-field.interface';
import {FieldType} from './models/field-type.model';
import {FieldTypesService} from './services/field-types.service';
import {SystemNameService} from '../services/system-name.service';

@Component({
    selector: 'app-modal-field-type',
    templateUrl: 'templates/modal-field-type.component.html',
    providers: []
})
export class ModalFieldTypeComponent extends AppModalAbstractComponent<FieldType> implements OnInit, OnDestroy {

    model = new FieldType(0, '', '', '', true, [], []);
    form = new FormGroup({
        id: new FormControl('', []),
        title: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]),
        description: new FormControl('', []),
        isActive: new FormControl('', []),
        inputProperties: new FormArray([]),
        outputProperties: new FormArray([])
    });
    arrayFieldsData: {[key: string]: FormFieldsData} = {
        inputProperties: {
            name: {validators: [Validators.required]},
            title: {validators: [Validators.required]},
            default_value: {validators: []}
        },
        outputProperties: {
            name: {validators: [Validators.required]},
            title: {validators: [Validators.required]},
            default_value: {validators: []}
        }
    };

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: FieldTypesService
    ) {
        super(ref, config, systemNameService, dataService);
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.createArrayFieldsProperty('inputProperties');
        this.createArrayFieldsProperty('outputProperties');
    }
}
