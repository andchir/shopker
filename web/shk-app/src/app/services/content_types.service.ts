import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { DataService } from './data-service.abstract';
import { ContentType } from '../models/content_type.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ContentTypesService extends DataService {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/content_types');
    }

    extractData(res: Response): any {
        let body = res.json();
        if(body.data){
            if(Array.isArray(body.data)){
                body.data = body.data as ContentType[];
            } else {
                body.data = body.data as ContentType;
            }
        }
        return body;
    }
}

@Injectable()
export class ContentTypesService_ {

    private headers = new Headers({'Content-Type': 'application/json'});
    private listUrl = 'app/content_type_list';
    private listUrlFull = 'app/content_type_list?full=1';
    private oneUrl = 'app/content_type';

    constructor (private http: Http) {}

    getList(full?: boolean): Promise<ContentType[]> {
        let url = full ? this.listUrlFull : this.listUrl;
        return this.http.get( url )
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getItem(id: string): Promise<ContentType> {
        const url = `${this.oneUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as ContentType)
            .catch(this.handleError);
    }

    createItem(item: ContentType): Promise<any> {
        return this.http
            .post(this.oneUrl, JSON.stringify( item ), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    editItem(id: string, item: ContentType): Promise<any> {
        const url = `${this.oneUrl}/${id}`;
        return this.http
            .put(url, JSON.stringify( item ), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    deleteItem(id: string): Promise<any> {
        const url = `${this.oneUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private extractData(res: Response): any {
        let body = res.json();
        return body.data || {};
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    }
}
