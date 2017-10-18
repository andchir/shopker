import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { QueryOptions } from '../models/query-options';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export interface outputData {
    data: any | any[] | null;
    successMsg: string;
    errorMsg: string;
    total: number;
}

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

    getItem(id: number): Promise<any> {
        const url = this.getRequestUrl() + `/${id}`;
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
        return this.http.get(this.getRequestUrl(), {search: params})
            .map(this.extractData)
            .catch(this.handleError)
            .map(DataService.prepareDataArray);
    }

    deleteItem(id: number): Promise<any> {
        const url = this.getRequestUrl() + `/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    create(item: any): Promise<any> {
        return this.http
            .post(this.getRequestUrl(), JSON.stringify(item), {headers: this.headers})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    update(item: any): Promise<any> {
        const url = this.getRequestUrl() + `/${item.id}`;
        return this.http
            .put(url, JSON.stringify(item), {headers: this.headers})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    static prepareDataArray(data: any): outputData {
        let output: outputData = {data: [], successMsg: '', errorMsg: '', total: 0};
        if (data.success) {
            if (data.data) {
                output.data = data.data;
            }
            if (data.total) {
                output.total = data.total;
            }
            if (data.msg) {
                output.successMsg = data.msg;
            }
        } else {
            if (data.msg) {
                output.errorMsg = data.msg;
            }
        }
        return output;
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

