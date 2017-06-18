import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private listUrl = 'app/products_list';
    private oneUrl = 'app/product';

    constructor (private http: Http) {}

    createItem(data: any): Promise<any> {
        return this.http
            .post(this.oneUrl, JSON.stringify( data ), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getList(categoryId: number): Observable<Product[]> {
        return this.http.get(this.listUrl + '/' + categoryId)
            .map(this.extractData)
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
