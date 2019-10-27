import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {DataService} from '../../services/data-service.abstract';
import {ContentType} from '../models/content_type.model';

@Injectable({
    providedIn: 'root'
})
export class ContentTypesService extends DataService<ContentType> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/content_types');
    }

    getItemByName(name: string): Observable<ContentType> {
        const url = this.getRequestUrl() + `/by_name/${name}`;
        return this.http.get<ContentType>(url).pipe(
            catchError(this.handleError<ContentType>())
        );
    }
}
