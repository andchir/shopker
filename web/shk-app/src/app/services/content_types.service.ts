import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataService } from './data-service.abstract';
import { ContentType } from '../models/content_type.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ContentTypesService extends DataService {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/content_types');
    }

    extractData(res: Response): any {
        let body = res.json();
        if(body.data){
            if(Array.isArray(body.data)){
                body.data = body.data as ContentType[];
            } else {
                body.data = body.data as ContentType;
            }
        }
        return body;
    }

    getItemByName(name: string): Promise<any> {
        const url = this.getRequestUrl() + `/by_name/${name}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

}