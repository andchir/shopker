import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Product } from '../models/product.model';

@Injectable()
export class ProductService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private listUrl = 'app/products_list';
    private oneUrl = 'app/product';

    constructor (private http: Http) {}

}
