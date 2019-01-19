import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DataService} from '../../services/data-service.abstract';
import {Template} from '../models/template.model';

@Injectable()
export class TemplatesEditService extends DataService<Template> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('templates');
    }

}
