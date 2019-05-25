import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {DataService} from './data-service.abstract';
import {FileModel} from '../models/file.model';

@Injectable()
export class FileManagerService extends DataService<FileModel> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('file_manager');
    }

    getList(options ?: any): Observable<FileModel[]> {
        let params = new HttpParams();
        for (const name in options) {
            if (!options.hasOwnProperty(name)
                || typeof options[name] === 'undefined') {
                continue;
            }
            params = params.append(name, options[name]);
        }
        return this.http.get<FileModel[]>(this.getRequestUrl(), {params: params, headers: this.headers})
            .pipe(
                catchError(this.handleError<any>())
            );
    }

}
