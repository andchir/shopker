import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { DataService } from './data-service.abstract';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Product } from '../models/product.model';

@Injectable()
export class ProductsService extends DataService {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/products');
    }

    extractData(res: Response): any {
        let body = res.json();
        if(body.data){
            if(Array.isArray(body.data)){
                body.data = body.data as Product[];
            } else {
                body.data = body.data as Product;
            }
        }
        return body;
    }

    // createItem(data: any): Promise<any> {
    //     return this.http
    //         .post(this.oneUrl, JSON.stringify( data ), {headers: this.headers})
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }
    //
    // editItem(id: number, data: any): Promise<any> {
    //     const url = `${this.oneUrl}/${id}`;
    //     return this.http
    //         .put(url, JSON.stringify( data ), {headers: this.headers})
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }
    //
    // getList(categoryId: number): Observable<Product[]> {
    //     return this.http.get(this.listUrl + '/' + categoryId)
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }
    //
    // getItem(id: number): Promise<Product> {
    //     const url = `${this.oneUrl}/${id}`;
    //     return this.http.get(url)
    //         .toPromise()
    //         .then(response => response.json().data as Product)
    //         .catch(this.handleError);
    // }
    //
    // private handleError (error: Response | any) {
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

}
