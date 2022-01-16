import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class CollectionsService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    private requestUrl = '/admin/collections';

    constructor(
        public http: HttpClient
    ) {

    }

    setRequestUrl(url) {
        this.requestUrl = url;
    }

    getRequestUrl() {
        return this.requestUrl;
    }

    getList(): Observable<string[]> {
        return this.http.get<string[]>(this.getRequestUrl())
            .pipe(
                catchError(this.handleError<any>())
            );
    }

    deleteItemByName(itemName: string): Observable<string> {
        const url = `${this.getRequestUrl()}/${itemName}`;
        return this.http.delete<string>(url, {headers: this.headers})
            .pipe(
                catchError(this.handleError<string>())
            );
    }

    handleError<T> (operation = 'operation', result?: T) {
        return (err: any): Observable<T> => {
            if (err.error) {
                throw err.error;
            }
            return of(result as T);
        };
    }
}
