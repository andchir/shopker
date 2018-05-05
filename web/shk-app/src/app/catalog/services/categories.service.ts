import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import {DataService} from '../../services/data-service.abstract';
import {Category} from '../models/category.model';

@Injectable()
export class CategoriesService extends DataService<Category> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('categories');
    }

    getTree() {
        return this.http.get<any>(this.getRequestUrl() + '/tree')
            .pipe(
                catchError(this.handleError<any>())
            );
    }
}
