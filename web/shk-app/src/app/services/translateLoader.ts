import {TranslateLoader} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

export class TranslateCustomLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(window['APP_LANG']);
    }
}
