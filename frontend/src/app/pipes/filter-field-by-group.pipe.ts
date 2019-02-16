import {Pipe, PipeTransform} from '@angular/core';
import {ContentField} from '../catalog/models/content_field.model';

@Pipe({
    name: 'filterFieldByGroup',
    pure: false
})
export class FilterFieldByGroupPipe implements PipeTransform {
    transform(allFields: ContentField[], groupName: string) {
        return allFields.filter(field => field.group === groupName);
    }
}
