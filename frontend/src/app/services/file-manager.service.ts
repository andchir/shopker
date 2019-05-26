import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {FileModel} from '../models/file.model';

@Injectable()
export class FileManagerService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    requestUrl = '';

    constructor(
        public http: HttpClient
    ) {
        this.requestUrl = 'file_manager';
    }

    getRequestUrl() {
        return this.requestUrl;
    }

    getList(options ?: any): Observable<FileModel[]> {
        let params = new HttpParams();
        for (const name in options) {
            if (!options.hasOwnProperty(name)
                || typeof options[name] === 'undefined') {
                continue;
            }
            params = params.append(name, options[name]);
        }
        return this.http.get<FileModel[]>(this.getRequestUrl(), {params: params, headers: this.headers})
            .pipe(
                catchError(this.handleError<any>())
            );
    }

    createFolder(path: string, folderName: string): Observable<any> {
        const url = `${this.getRequestUrl()}/folder`;
        return this.http.post<any>(url, {path: path, folderName: folderName}, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    deleteFolder(path: string): Observable<any> {
        const url = `${this.getRequestUrl()}/folder_delete`;
        return this.http.post<any>(url, {path: path}, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    rename(path: string, name: string, target = 'folder'): Observable<any> {
        const url = `${this.getRequestUrl()}/${target}`;
        return this.http.put<any>(url, {path: path, name: name}, {headers: this.headers}).pipe(
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
