import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { TRANSLATION_RU } from '../../locale/messages.ru';

export function getTranslationProviders(): Promise<Object[]> {
    // Get the locale id from the global
    const locale = window['appSettings'].locale as string;
    // return no providers if fail to get translation file for locale
    const noProviders: Object[] = [];
    // No locale or U.S. English: no translation providers
    if (!locale || locale === 'en-US') {
        return Promise.resolve(noProviders);
    }
    return getTranslations(locale)
        .then( (translations: string ) => [
            { provide: TRANSLATIONS, useValue: translations },
            { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
            { provide: LOCALE_ID, useValue: locale }
        ])
        .catch(() => noProviders); // ignore if file not found
}

function getTranslations(locale: string) {
    let translation;
    switch (locale) {
        case 'ru':
        case 'ru-RU':
            translation = TRANSLATION_RU;
            break;
    }
    return Promise.resolve(translation);
}
