import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

}
