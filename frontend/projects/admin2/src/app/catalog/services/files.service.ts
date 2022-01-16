import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {DataService} from '../../services/data-service.abstract';
import {FileModel} from '../../models/file.model';

@Injectable()
export class FilesService extends DataService<FileModel> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/files');
    }
}
