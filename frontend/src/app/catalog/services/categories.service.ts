import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

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
        this.setRequestUrl('/admin/categories');
    }

    getTree(parentId = 0, expanded = true) {
        let params = new HttpParams();
        params = params.append('expanded', expanded ? '1' : '0');
        return this.http.get<any>(this.getRequestUrl() + `/tree/${parentId}`, {params: params})
            .pipe(
                catchError(this.handleError<any>())
            );
    }
}
