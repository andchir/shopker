import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { QueryOptions } from '../models/query-options';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export abstract class DataService {

    private http: Http;
    private headers = new Headers({'Content-Type': 'application/json'});
    private requestUrl = '';

    constructor(http: Http) {
        this.http = http;
        this.requestUrl = 'app/data_list';
    }

    setRequestUrl(url){
        this.requestUrl = url;
    }

    getItem(id: string): Promise<any> {
        const url = `${this.requestUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

    getList(options ?: QueryOptions): Observable<any> {

        let qs = '';
        for(let name in options){
            qs += `${name}=${options[name]}&`;
        }
        qs = qs.substr(0, qs.length - 1);
        let url = this.requestUrl + '?' + qs;

        return this.http.get(url)
            //.map(this.extractData)
            .map(res => res.json())
            .catch(this.handleError);
    }

    deleteItem(id: number): Promise<any> {
        const url = `${this.requestUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    create(item: any): Promise<any> {
        return this.http
            .post(this.requestUrl, JSON.stringify(item), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    update(item: any): Promise<any> {
        const url = `${this.requestUrl}/${item.id}`;
        return this.http
            .put(url, JSON.stringify(item), {headers: this.headers})
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

