import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'ifEmpty'
})
export class IfEmptyPipe implements PipeTransform {
    transform(value: string|number, defaultValue: string = ''): any {
        if (!value) {
            return defaultValue;
        }
        return value;
    }
}
