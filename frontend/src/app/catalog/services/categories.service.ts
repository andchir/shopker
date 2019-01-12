import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {DataService} from '../../services/data-service.abstract';
import {Category} from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
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
