import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { ContentType } from '../models/content_type.model';

@Injectable()
export class ContentTypesService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private listUrl = 'app/content_type_list';
    private oneUrl = 'app/content_type';

    constructor (private http: Http) {}

    getList(): Promise<ContentType[]> {
        return this.http.get(this.listUrl)
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
