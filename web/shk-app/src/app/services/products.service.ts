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
}
