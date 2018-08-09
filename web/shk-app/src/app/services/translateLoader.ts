import {TranslateLoader} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';

export class TranslateCustomLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(window['APP_LANG']);
    }
}
