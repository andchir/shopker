import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ContentField } from "./models/content_field.model";

@Component({
    selector: 'input-field',
    templateUrl: 'templates/input-field-render.html'
})
export class InputFieldComponent implements OnInit {

    @Input() fields: ContentField[];
    @Input() filterGroupName: string;
    @Input() model: any;
    @Input() form: FormGroup;
    //@Output() modelChange = new EventEmitter<number>();
    //@Output() formChange = new EventEmitter<number>();

    formErrors = {};
    validationMessages = {};

    ngOnInit(): void {

        console.log(this.fields, this.filterGroupName, this.model);

        let controls = {};
        this.fields.forEach(function(field, index){
            if(!this.model[field.name]){
                this.model[field.name] = '';
            }
            controls[field.name] = new FormControl(this.model[field.name], this.getValidators(field));
            this.formErrors[field.name] = '';
            this.validationMessages[field.name] = this.getValidationMessages(field);
        }.bind(this));

        this.form.valueChanges
            .subscribe((data) => this.onValueChanged(data));
    }

    getValidators(field: ContentField): any[] {
        let validators = [];
        if(field.required){
            validators.push(Validators.required);
        }

        return validators;
    }

    getValidationMessages(field: ContentField): any[] {
        let messages: any = {};
        if(field.required){
            messages.required = 'This field is required.';
        }

        return messages;
    }

    onValueChanged(data: any): void{
        for (let fieldName in data) {
            if (!data.hasOwnProperty(fieldName)) {
                continue;
            }

            this.formErrors[fieldName] = '';
            let control = this.form.get(fieldName);
            if (control && control.dirty && !control.valid) {
                for (let key in control.errors) {
                    this.formErrors[fieldName] += this.validationMessages[fieldName][key] + ' ';
                }
            }
        }
    }

}