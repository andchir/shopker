import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data-service.abstract';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Category } from '../models/category.model';

@Injectable()
export class CategoriesService extends DataService {

    constructor(http: Http) {
        super(http);
        this.setRequestUrl('admin/categories');
    }

    extractData(res: Response): any {
        let body = res.json();
        if(body.data){
            if(Array.isArray(body.data)){
                body.data = body.data as Category[];
            } else {
                body.data = body.data as Category;
            }
        }
        return body;
    }
}

// @Injectable()
// export class CategoriesService {
//
//     private headers = new Headers({'Content-Type': 'application/json'});
//     private listUrl = 'app/categories_list';
//     private oneUrl = 'app/category';
//
//     constructor (private http: Http) {}
//
//     createItem(item: Category): Promise<any> {
//         return this.http
//             .post(this.oneUrl, JSON.stringify( item ), {headers: this.headers})
//             .toPromise()
//             .then(res => res.json())
//             .catch(this.handleError);
//     }
//
//     editItem(id: number, item: Category): Promise<any> {
//         const url = `${this.oneUrl}/${id}`;
//         return this.http
//             .put(url, JSON.stringify( item ), {headers: this.headers})
//             .toPromise()
//             .then(res => res.json())
//             .catch(this.handleError);
//     }
//
//     getItem(id: number): Promise<Category> {
//         const url = `${this.oneUrl}/${id}`;
//         return this.http.get(url)
//             .toPromise()
//             .then(response => response.json().data as Category)
//             .catch(this.handleError);
//     }
//
//     getList(): Observable<Category[]> {
//         return this.http.get(this.listUrl)
//             .map(this.extractData)
//             .catch(this.handleError);
//     }
//
//     deleteItem(id: number): Promise<any> {
//         const url = `${this.oneUrl}/${id}`;
//         return this.http.delete(url, {headers: this.headers})
//             .toPromise()
//             .then(res => res.json())
//             .catch(this.handleError);
//     }
//
//     private extractData(res: Response): any {
//         let body = res.json();
//         return body.data || {};
//     }
//
//     private handleError (error: Response | any) {
//         let errMsg: string;
//         if (error instanceof Response) {
//             const body = error.json() || '';
//             const err = body.error || JSON.stringify(body);
//             errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
//         } else {
//             errMsg = error.message ? error.message : error.toString();
//         }
//         console.error(errMsg);
//         return Promise.reject(errMsg);
//     }
//
// }