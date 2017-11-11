import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataService } from './data-service.abstract';
import { ContentType } from '../models/content_type.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ContentTypesService extends DataService<ContentType> {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/content_types');
    }

    getItemByName(name: string): Promise<any> {
        const url = this.getRequestUrl() + `/by_name/${name}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

}