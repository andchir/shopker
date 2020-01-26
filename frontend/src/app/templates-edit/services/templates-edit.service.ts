import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Rx';
import {catchError} from 'rxjs/internal/operators';

import {DataService} from '../../services/data-service.abstract';
import {Template} from '../models/template.model';
import {FileRegularInterface} from '../models/file-regular.interface';
import {DataList} from '../../models/data-list.interface';

@Injectable()
export class TemplatesEditService extends DataService<Template> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/templates');
    }

    getItemContent(path: string, fileType: string): Observable<string> {
        const url = this.getRequestUrl() + `/content`;
        let params = new HttpParams();
        params = params.append('path', path);
        params = params.append('type', fileType);
        return this.http.get<string>(url, {params: params, headers: this.headers}).pipe(
            catchError(this.handleError<string>())
        );
    }

    saveContent(template: FileRegularInterface): Observable<any> {
        return this.http.post<any>(this.getRequestUrl(), template, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    deleteTemplateItem(path: string): Observable<any> {
        const url = this.getRequestUrl();
        let params = new HttpParams();
        params = params.append('path', path);
        return this.http.delete<any>(url, {params: params, headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    deleteFilesBatch(pathArr: string[]): Observable<any> {
        const url = `${this.getRequestUrl()}/delete/batch`;
        return this.http.post<any>(url, {pathArr: pathArr}, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    getEditableFiles(): Observable<DataList<FileRegularInterface>> {
        const url = `${this.getRequestUrl()}/get_editable_files`;
        return this.http.get<DataList<FileRegularInterface>>(url, {headers: this.headers})
            .pipe(
                catchError(this.handleError<any>())
            );
    }
    
    getThemesList(): Observable<any> {
        const url = `${this.getRequestUrl()}/themes`;
        return this.http.get<any>(url, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }
}
