import {ValidatorFn} from '@angular/forms';

export interface FormFieldsOptions {
    name: string;
    validators: ValidatorFn[];
    disabled?: boolean;
    isArray?: boolean;
    children?: FormFieldsOptions[];
}

export interface FormFieldsErrors {
    [name: string]: string;
}
