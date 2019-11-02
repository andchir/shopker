import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {DataService} from '../services/data-service.abstract';
import {User} from './models/user.model';

@Injectable()
export class UsersService extends DataService<User> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/users');
    }

    getRolesList(): Observable<{roles: any[]}> {
        const url = this.getRequestUrl() + '/roles';
        return this.http.get<any[]>(url, {headers: this.headers})
            .pipe(
                catchError(this.handleError<any>())
            );
    }

}
