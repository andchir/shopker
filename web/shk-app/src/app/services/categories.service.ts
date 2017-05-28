import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Category } from '../models/category.model';

@Injectable()
export class CategoriesService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private listUrl = 'app/categories_list';
    private oneUrl = 'app/category';

    constructor (private http: Http) {}

    createItem(item: Category): Promise<any> {
        return this.http
            .post(this.oneUrl, JSON.stringify( item ), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    editItem(id: number, item: Category): Promise<any> {
        const url = `${this.oneUrl}/${id}`;
        return this.http
            .put(url, JSON.stringify( item ), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getItem(id: string): Promise<Category> {
        const url = `${this.oneUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Category)
            .catch(this.handleError);
    }

    getList(): Promise<Category[]> {
        return this.http.get(this.listUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteItem(id: number): Promise<any> {
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