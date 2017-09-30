import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DataService } from './data-service.abstract';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Category } from '../models/category.model';

@Injectable()
export class CategoriesService extends DataService {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/categories');
    }

    extractData(res: Response): any {
        let body = res.json();
        if(body.data){
            if(Array.isArray(body.data)){
                body.data = body.data as Category[];
            } else {
                body.data = body.data as Category;
            }
        }
        return body;
    }
}
