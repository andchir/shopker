import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable()
export class StatisticsService {

    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    private requestUrl = 'statistics';

    constructor(
        private http: HttpClient
    ) {

    }

    setRequestUrl(url) {
        this.requestUrl = url;
    }

    getRequestUrl() {
        return this.requestUrl;
    }

    getStatisticsOrders(type: string): Observable<any> {
        const url = this.getRequestUrl() + `/orders/${type}`;
        return this.http.get<any>(url, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    handleError<T>(operation = 'operation', result?: T) {
        return (err: any): Observable<T> => {
            if (err.error) {
                throw err.error;
            }
            return of(result as T);
        };
    }
}
