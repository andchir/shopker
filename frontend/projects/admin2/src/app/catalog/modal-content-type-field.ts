import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';
import {ContentField} from './models/content_field.model';

@Component({
    selector: 'app-modal-content-type-field',
    templateUrl: 'templates/modal-content-type-field.html',
    providers: []
})
export class ModalContentTypeFieldComponent extends AppModalAbstractComponent<ContentType> implements OnInit, OnDestroy {

    @ViewChild('formEl') formEl: ElementRef;
    
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
    
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: ContentTypesService
    ) {
        super(ref, config, dataService);
    }

    ngOnInit(): void {
        this.fieldModel = this.config.data;
        super.ngOnInit();
    }

    updateControls(): void {
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
        console.log(this.form.value);
        
    }
}
