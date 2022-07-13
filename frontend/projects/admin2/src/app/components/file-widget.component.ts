import {Component, ElementRef, forwardRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {FileData} from '../catalog/models/file-data.model';
import {AppSettings} from '../services/app-settings.service';
import {FileModel} from '../models/file.model';

export const EPANDED_TEXTAREA_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileWidgetComponent),
    multi: true,
};

@Component({
    selector: 'app-file-widget',
    templateUrl: 'templates/app-file-widget.html',
    providers: [EPANDED_TEXTAREA_VALUE_ACCESSOR]
})
export class FileWidgetComponent implements ControlValueAccessor {

    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('imgPreview', { static: true }) imgPreview: ElementRef;
    @Input() fieldName = 'image';
    @Input() fieldTitle: string;
    @Input() allowedExtensions = '';
    @Input() required = false;
    @Input() allowMultiple = false;
    @Input() largeFieldMode = true;
    @Input() files: { [key: string]: File } = {};
    @Input() filesRaw: File[] = [];
    @Input() _controlValue: FileData|null = null;

    hasPreviewImage = false;
    filesDirBaseUrl: string;
    fileName = '';
    imageUrl: string|ArrayBuffer = '';

    _onChange: (value: FileData) => void = () => null;
    _onTouched: () => void = () => null;

    constructor(
        private appSettings: AppSettings
    ) {
        this.filesDirBaseUrl = this.appSettings.settings.filesDirUrl;
    }

    get controlValue() {
        return this._controlValue;
    }

    set controlValue(val: FileData) {
        this._controlValue = val;
        this._onChange(val);
    }

    fileChange(event): void {
        const files = event.target.files;
        if (files.length === 0) {
            return;
        }
        for (let i = 0; i < files.length; i++) {
            this.filesRaw.push(files[i]);
        }
        this.onGetFile(files[0]);
    }

    getDroppedData(dataTransfer: DataTransfer): File[] {
        const dataString = dataTransfer.getData('text/plain');
        if (dataString) {
            this.onGetData(dataString);
            return;
        }
        if (dataTransfer.items) {
            for (let i = 0; i < dataTransfer.items.length; i++) {
                this.filesRaw.push(dataTransfer.items[i].getAsFile());
            }
        } else {
            for (let i = 0; i < dataTransfer.files.length; i++) {
                this.filesRaw.push(dataTransfer.files[i]);
            }
        }
        return this.filesRaw;
    }

    onGetFile(file: File): void {
        const value: FileData = FileModel.getFileData(file, this.filesDirBaseUrl);
        if (!value) {
            return;
        }
        this.hasPreviewImage = FileData.getIsImageFile(value.extension, '', true);
        this.files[this.fieldName] = file;
        if (this.hasPreviewImage && file.type.indexOf('image/') > -1) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent) => {
                const fr = e.target as FileReader;
                value.dataUrl = fr.result;
                this.writeValue(value);
            };
            reader.readAsDataURL(file);
        } else {
            this.writeValue(value);
        }
    }

    onGetData(dataString: string): void {
        const tmpArr = dataString.split(/[\\\/]/);
        const fileName = tmpArr.pop();
        const fileExtension = FileData.getExtension(fileName);
        const fileTitle = fileName.replace(`.${fileExtension}`, '');
        const data = new FileData(0, fileTitle, fileExtension, 0, fileTitle, tmpArr.join('/'));
        data.fileName = fileTitle;
        this.hasPreviewImage = FileData.getIsImageFile(data.extension, '', true);
        this.writeValue(data);
    }

    getImageUrl(data?: FileData|null): string|ArrayBuffer {
        if (!this.hasPreviewImage) {
            return '';
        }
        const filesDirBaseUrl = data.fileId ? this.filesDirBaseUrl : '';
        return FileData.getImageUrl(filesDirBaseUrl, data || this.controlValue);
    }

    buttonHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.fileInput.nativeElement.click();
    }

    fileClear() {
        this.writeValue(null, true);
        delete this.files[this.fieldName];
        this.filesRaw.splice(0, this.filesRaw.length);
        this.fileInput.nativeElement.value = null;
    }

    dropHandler(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.getDroppedData(event.dataTransfer);
        if (this.filesRaw.length > 0) {
            this.onGetFile(this.filesRaw[0]);
        }
    }

    dragOverHandler(event: DragEvent): void {
        event.preventDefault();
    }

    writeValue(data: FileData|null, clearValue = false) {
        if (!data) {
            this.fileName = '';
            this.imageUrl = '';
            this.hasPreviewImage = false;
            if (clearValue) {
                this.controlValue = null;
            }
        } else {
            this.fileName = `${data.title}.${data.extension}`;
            this.hasPreviewImage = FileData.getIsImageFile(data.extension, '', true);
            this.imageUrl = this.getImageUrl(data);
            this.controlValue = data;
            if (this.allowMultiple && this.filesRaw.length > 1) {
                this.fileName += ' + ' + (this.filesRaw.length - 1);
            }
        }
    }

    registerOnChange(fn: (_: any) => void): void {
        this._onChange = () => {
            fn(this.controlValue);
        }
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }
}
