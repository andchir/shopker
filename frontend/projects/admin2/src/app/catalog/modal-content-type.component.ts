import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {FormFieldsData} from '../models/form-field.interface';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';

@Component({
    selector: 'app-modal-content-type',
    templateUrl: 'templates/modal-content-type.component.html',
    providers: []
})
export class ModalContentTypeComponent extends AppModalAbstractComponent<ContentType> implements OnInit, OnDestroy {

    model = new ContentType(0, '', '', '', '', [], [], true);
    form = new FormGroup({
        id: new FormControl('', []),
        title: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]),
        description: new FormControl('', []),
        isActive: new FormControl('', [])
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
        public dataService: ContentTypesService
    ) {
        super(ref, config, dataService);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
