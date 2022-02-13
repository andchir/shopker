import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {DataService} from '../../services/data-service.abstract';
import {FileRegularInterface} from '../models/file-regular.interface';
import {DataList} from '../../models/data-list.interface';
import {EditableFile} from '../models/editable-file.model';

@Injectable()
export class FileEditService extends DataService<EditableFile> {

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

    saveContent(file: EditableFile): Observable<any> {
        return this.http.post<any>(this.getRequestUrl(), file, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    deleteFileItem(path: string): Observable<any> {
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
    
    getThemesList(): Observable<any> {
        const url = `${this.getRequestUrl()}/themes`;
        return this.http.get<any>(url, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }
}
