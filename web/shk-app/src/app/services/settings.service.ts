import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { DataService } from './data-service.abstract';
import { Setting } from '../models/setting.model';
import { SettingsGroup } from '../models/settings-group.model';

@Injectable()
export class SettingsService {

    public headers = new HttpHeaders({'Content-Type': 'application/json'});
    private requestUrl = '';

    constructor(
        private http: HttpClient
    ) {
        this.requestUrl = 'admin/settings';
    }

    setRequestUrl(url){
        this.requestUrl = url;
    }

    getRequestUrl(){
        return this.requestUrl;
    }

    getList(): Observable<SettingsGroup> {
        return this.http.get<SettingsGroup>(this.getRequestUrl())
            .pipe(
                catchError(this.handleError<SettingsGroup>())
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
