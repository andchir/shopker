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
    private requestUrl = '/admin/statistics';

    chartLineOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

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

    getParams(options: any): HttpParams {
        let params = new HttpParams();
        for (const name in options) {
            if (!options.hasOwnProperty(name)
                || typeof options[name] === 'undefined') {
                continue;
            }
            params = params.append(name, options[name]);
        }
        return params;
    }

    getStatisticsOrders(type: string, options?: any): Observable<any> {
        const params = this.getParams(options);
        const url = this.getRequestUrl() + `/orders`;
        return this.http.get<any>(url, {params: params, headers: this.headers}).pipe(
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
