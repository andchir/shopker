import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { QueryOptions } from '../models/query-options';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export abstract class DataService {

    public headers = new Headers({'Content-Type': 'application/json'});
    private requestUrl = '';

    constructor(public http: Http) {
        this.http = http;
        this.requestUrl = 'app/data_list';
    }

    abstract extractData(res: Response);

    setRequestUrl(url){
        this.requestUrl = url;
    }

    getRequestUrl(){
        return this.requestUrl;
    }

    getItem(id: string): Promise<any> {
        const url = `${this.requestUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getList(options ?: QueryOptions): Observable<any> {
        let params = new URLSearchParams();
        for(let name in options){
            if(!options.hasOwnProperty(name)){
                continue;
            }
            params.set(name, options[name]);
        }
        return this.http.get(this.requestUrl, {search: params})
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteItem(id: number): Promise<any> {
        const url = `${this.requestUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    create(item: any): Promise<any> {
        return this.http
            .post(this.requestUrl, JSON.stringify(item), {headers: this.headers})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    update(item: any): Promise<any> {
        const url = `${this.requestUrl}/${item.id}`;
        return this.http
            .put(url, JSON.stringify(item), {headers: this.headers})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    handleError (error: Response | any) {
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

