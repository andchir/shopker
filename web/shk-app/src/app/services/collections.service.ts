import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data-service.abstract';

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class CollectionsService extends DataService<string> {

    constructor(public http: HttpClient) {
        super(http);
        this.setRequestUrl('admin/collections');
    }

    deleteItemByName(itemName: string): Observable<string> {
        const url = `${this.getRequestUrl()}/${itemName}`;
        return this.http.delete<string>(url, {headers: this.headers})
            .pipe(
                catchError(this.handleError<string>())
            );
    }
}
