import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {QueryOptions} from '../models/query-options';
import {DataList} from '../models/data-list.interface';
import {SimpleEntity} from '../models/simple-entity.interface';
import {FileModel} from '../models/file.model';
import {Properties} from '../models/properties.iterface';

export interface OutputData {
    data: any | any[] | null;
    successMsg: string;
    errorMsg: string;
    total: number;
}

export abstract class DataService<M extends SimpleEntity> {

    public headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    private requestUrl = '';

    constructor(
        public http: HttpClient
    ) {
        this.requestUrl = '/admin/app/data_list';
    }

    setRequestUrl(url) {
        this.requestUrl = url;
    }

    getRequestUrl() {
        return this.requestUrl;
    }

    getItem(id: number): Observable<M> {
        const url = this.getRequestUrl() + `/${id}`;
        return this.http.get<M>(url, {headers: this.headers}).pipe(
            catchError(this.handleError<M>())
        );
    }

    createHttpParams(properties: Properties): HttpParams {
        let params = new HttpParams();
        Object.keys(properties).forEach((key) => {
            params = params.append(key, properties[key] as string);
        });
        return params;
    }

    getList(options ?: QueryOptions): Observable<M[]> {
        let params = new HttpParams();
        for (const name in options) {
            if (!options.hasOwnProperty(name)
                || typeof options[name] === 'undefined') {
                    continue;
            }
            params = params.append(name, options[name]);
        }
        return this.http.get<M[]>(this.getRequestUrl(), {params: params, headers: this.headers})
            .pipe(
                catchError(this.handleError<any>())
            );
    }

    getListPage(options ?: QueryOptions): Observable<DataList<M>> {
        let params = new HttpParams();
        if (options) {
            for (const name in options) {
                if (!options.hasOwnProperty(name)
                    || typeof options[name] === 'undefined') {
                    continue;
                }
                params = params.append(name, options[name]);
            }
        }
        return this.http.get<DataList<M>>(this.getRequestUrl(), {params: params, headers: this.headers})
            .pipe(
                catchError(this.handleError<any>())
            );
    }

    deleteItem(id: number): Observable<M> {
        const url = this.getRequestUrl() + `/${id}`;
        return this.http.delete<M>(url, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    deleteByArray(idsArray: number[]): Observable<M> {
        const url = this.getRequestUrl() + '/batch';
        const data = {ids: idsArray};
        return this.http.post<M>(url, data, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    actionBatch(idsArray: number[], action: string = 'delete'): Observable<M> {
        const url = `${this.getRequestUrl()}/${action}/batch`;
        const data = {ids: idsArray};
        return this.http.post<M>(url, data, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    create(item: M): Observable<M> {
        return this.http.post<M>(this.getRequestUrl(), item, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    update(item: M): Observable<M> {
        const url = this.getRequestUrl() + `/${item.id}`;
        return this.http.put<M>(url, item, {headers: this.headers}).pipe(
            catchError(this.handleError<any>())
        );
    }

    postFormData(formData: FormData): Observable<FileModel[]> {
        const headers = new HttpHeaders({
            'enctype': 'multipart/form-data',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        return this.http.post<FileModel[]>(`${this.getRequestUrl()}/upload`, formData, {headers: headers}).pipe(
            catchError(this.handleError<FileModel[]>())
        );
    }

    updateProperty(itemId: number, optionsName: string, value: string | number): Observable<M> {
        const url = this.getRequestUrl() + `/update/${optionsName}/${itemId}`;
        return this.http.patch<M>(url, {value: value}, {headers: this.headers}).pipe(
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
