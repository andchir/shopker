import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SystemNameService {

    private transitMap = {
        ru: {
            'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
            'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'E', 'ё': 'e', 'Ж': 'Zh', 'ж': 'zh',
            'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
            'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
            'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
            'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'Kh', 'х': 'kh', 'Ц': 'Ts', 'ц': 'ts',
            'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sch', 'щ': 'sch', 'ь': '', 'Ы': 'Y',
            'ы': 'y', 'ъ': '', 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu', 'Я': 'Ya', 'я': 'ya',
            ' ': '-', '\\': '', '/': '', '\'': '', '"': '', '[': '', ']': '', '{': '', '}': '',
            '(': '', ')': '', ',': '', '.': ''
        }
    };

    mapWords(char: string, lang: string) {
        return Object.prototype.hasOwnProperty.call(this.transitMap[lang], char)
            ? this.transitMap[lang][char]
            : char;
    }

    transliterate(word: string) {
        return word.split('')
            .map((char) => this.mapWords(char, 'ru'))
            .join('');
    }

    generateName(title: string): string {
        title = this.transliterate(title);
        return title.toLowerCase();
    }
}
