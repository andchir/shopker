import {Properties} from './properties.iterface';
import {ValidatorFn} from '@angular/forms';

export interface FormFieldOptionsInterface {
    value: string|number|boolean;
    validators: ValidatorFn[];
    messages: Properties;
    fieldLabel?: string;
    disabled?: boolean;
    dataKey?: string;
}

export interface FormFieldInterface {
    [key: string]: FormFieldOptionsInterface;
}
