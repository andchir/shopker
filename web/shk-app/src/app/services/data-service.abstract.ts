import { Http, Response, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { QueryOptions } from '../models/query-options';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

export interface outputData {
    data: any | any[] | null;
    successMsg: string;
    errorMsg: string;
    total: number;
}

export abstract class DataService<M> {

    public headers = new HttpHeaders({'Content-Type': 'application/json'});
    private requestUrl = '';

    constructor(
        public http: HttpClient
    ) {
        this.requestUrl = 'app/data_list';
    }

    setRequestUrl(url){
        this.requestUrl = url;
    }

    getRequestUrl(){
        return this.requestUrl;
    }

    getItem(id: number): Observable<M> {
        const url = this.getRequestUrl() + `/${id}`;
        return this.http.get<M>(url).pipe(
            catchError(this.handleError<M>())
        );
    }

    getList(options ?: QueryOptions): Observable<M[]> {
        let params = new HttpParams();
        for(let name in options){
            if(!options.hasOwnProperty(name)){
                continue;
            }
            params.set(name, options[name]);
        }
        return this.http.get<M[]>(this.getRequestUrl(), {params: params})
            .pipe(
                catchError(this.handleError())
            );
    }

    deleteItem(id: number): Observable<M> {
        const url = this.getRequestUrl() + `/${id}`;
        return this.http.delete<M>(url, {headers: this.headers}).pipe(
            catchError(this.handleError<M>())
        );
    }

    deleteByArray(idsArray: number[]): Promise<any> {
        const url = this.getRequestUrl() + '/batch';
        let params = new HttpParams();
        params.set('ids', JSON.stringify(idsArray));
        return this.http.delete(url, {
                headers: this.headers,
                params: params
            })
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

    // handleError(error: Response | any) {
    //     let errMsg: string;
    //     if (error instanceof Response) {
    //         const body = error.json() || '';
    //         const err = body.error || JSON.stringify(body);
    //         errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    //     } else {
    //         errMsg = error.message ? error.message : error.toString();
    //     }
    //     console.error(errMsg);
    //     return Promise.reject(errMsg);
    // }

    handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.log(error, result);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    extractData(res: any): any {
        let body = res.json();
        if(body.data){
            if(Array.isArray(body.data)){
                body.data = body.data as M[];
            } else {
                body.data = body.data as M;
            }
        }
        return body;
    }

}

