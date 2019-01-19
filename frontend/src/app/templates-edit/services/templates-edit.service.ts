import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Rx';
import {catchError} from 'rxjs/internal/operators';

import {DataService} from '../../services/data-service.abstract';
import {Template} from '../models/template.model';

@Injectable()
export class TemplatesEditService extends DataService<Template> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('templates');
    }

    getItemContent(path: string): Observable<string> {
        const url = this.getRequestUrl() + `/content`;
        let params = new HttpParams();
        params = params.append('path', path);
        return this.http.get<string>(url, {params: params, headers: this.headers}).pipe(
            catchError(this.handleError<string>())
        );
    }

}
