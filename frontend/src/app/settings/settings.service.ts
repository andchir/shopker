import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { DataService } from '../services/data-service.abstract';
import { Setting, SettingsGroup } from './models/setting.model';
import { Properties } from '../models/properties.iterface';

@Injectable()
export class SettingsService {

    public headers = new HttpHeaders({'Content-Type': 'application/json'});
    private requestUrl = '';

    constructor(
        private http: HttpClient
    ) {
        this.requestUrl = 'settings';
    }

    setRequestUrl(url) {
        this.requestUrl = url;
    }

    getRequestUrl() {
        return this.requestUrl;
    }

    getList(): Observable<SettingsGroup> {
        return this.http.get<SettingsGroup>(this.getRequestUrl())
            .pipe(
                catchError(this.handleError<SettingsGroup>())
            );
    }

    clearCache(): Observable<any> {
        const url = this.getRequestUrl() + '/clear_cache';
        return this.http.post<any>(url, {}, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    clearSystemCache(): Observable<any> {
        const url = this.getRequestUrl() + '/clear_system_cache';
        return this.http.post<any>(url, {}, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    updateGroup(name: string, data: SettingsGroup): Observable<Properties> {
        const url = this.getRequestUrl() + `/${name}`;
        return this.http.put<Properties>(url, data, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
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
