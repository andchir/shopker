import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DataService} from '../../services/data-service.abstract';
import {Product} from '../models/product.model';

@Injectable()
export class ProductsService extends DataService<Product> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/products');
    }
}
