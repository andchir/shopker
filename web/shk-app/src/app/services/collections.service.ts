import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { DataService } from './data-service.abstract';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CollectionsService extends DataService<any> {

    constructor(public http: Http) {
        super(http);
        this.setRequestUrl('admin/collections');
    }

    deleteItemByName(itemName: string): Promise<any> {
        const url = `${this.getRequestUrl()}/${itemName}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then((res) => res.json())
            .catch(this.handleError);
    }

    extractData(res: Response): any {
        return res.json();
    }
}