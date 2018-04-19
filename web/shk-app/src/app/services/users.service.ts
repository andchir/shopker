import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataService } from './data-service.abstract';
import { User } from '../models/user.model';

@Injectable()
export class UsersService extends DataService<User> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('users');
    }
}
