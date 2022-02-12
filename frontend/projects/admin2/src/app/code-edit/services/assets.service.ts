import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {DataService} from '../../services/data-service.abstract';
import {FileRegularInterface} from '../models/file-regular.interface';

@Injectable()
export class AssetsService extends DataService<FileRegularInterface> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/templates/editable_files');
    }
}
