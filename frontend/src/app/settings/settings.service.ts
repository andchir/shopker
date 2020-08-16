import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {DataService} from '../services/data-service.abstract';
import {Setting, SettingsGroup} from './models/setting.model';
import {Properties} from '../models/properties.iterface';
import {ComposerPackage} from './models/composer-package.interface';
import {AppSettings} from '../services/app-settings.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    private requestUrl = '';
    private baseUrl = '';

    constructor(
        private http: HttpClient
    ) {
        this.requestUrl = '/admin/settings';
        this.baseUrl = AppSettings.getBaseUrl();
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

    clearSystemCache(): Observable<any> {
        const url = this.getRequestUrl() + '/clear_system_cache';
        return this.http.post<any>(url, {}, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    runActionPost(actionName: string): Observable<any> {
        const url = this.getRequestUrl() + `/${actionName}`;
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

    getComposerPackagesList(): Observable<ComposerPackage[]> {
        return this.http.get<ComposerPackage[]>(this.getRequestUrl() + '_composer_installed_packages')
            .pipe(
                catchError(this.handleError<ComposerPackage[]>())
            );
    }

    composerRequirePackage(packageName: string, packageVersion: string): Observable<any> {
        const url = this.getRequestUrl() + '_composer_require_package';
        return this.http.post<any>(url, {packageName: packageName, packageVersion: packageVersion}, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }
    
    postFormData(formData: FormData, actionPath: string): Observable<any> {
        const headers = new HttpHeaders({
            'enctype': 'multipart/form-data',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        return this.http
            .post(this.baseUrl + actionPath, formData, {headers: headers})
            .pipe(
                catchError(this.handleError<any>())
            );
    }

    handleError<T> (operation = 'operation', result?: T) {
        return (err: HttpErrorResponse): Observable<T> => {
            if (err.status && [401, 403].indexOf(err.status) > -1) {
                window.location.href = this.baseUrl + '/login';
                return ;
            }
            if (err.error) {
                throw err.error;
            }
            return of(result as T);
        };
    }
}
