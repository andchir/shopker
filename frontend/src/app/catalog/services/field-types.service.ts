import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DataService} from '../../services/data-service.abstract';
import {FieldType} from '../models/field-type.model';

@Injectable()
export class FieldTypesService extends DataService<FieldType> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/field_types');
    }
}
