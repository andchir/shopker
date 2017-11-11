import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data-service.abstract';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Category } from '../models/category.model';

@Injectable()
export class CategoriesService extends DataService<Category> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('admin/categories');
    }
}
