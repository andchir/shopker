import { Pipe, PipeTransform } from '@angular/core';
import { ContentField } from "../models/content_field.model";

@Pipe({ name: 'filterFieldByGroup' })
export class FilterFieldByGroupPipe implements PipeTransform {
    transform(allFields: ContentField[], groupName: string) {
        return allFields.filter(field => field.group == groupName);
    }
}