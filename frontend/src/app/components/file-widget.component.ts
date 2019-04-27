import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {FileData} from '../catalog/models/file-data.model';
import {AppSettings} from '../services/app-settings.service';

export const EPANDED_TEXTAREA_VALUE_ACCESSOR : any = {
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

    @Input() fieldName: string = 'image';
    @Input() fieldTitle: string;
    @Input() hasPreviewImage = false;
    @Input() allowedExtensions = '';
    @Input() files: { [key: string]: File } = {};
    @ViewChild('imgPreview') imgPreview: ElementRef;
    @Input('controlValue') _controlValue: FileData|null = null;
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
        if (event.target.files.length > 0) {
            this.onGetFile(event.target.files[0]);
        }
    }

    onGetFile(file: File): void {
        const value: FileData = FileData.getFileData(file);
        this.files[this.fieldName] = file;
        if (this.hasPreviewImage && file.type.indexOf('image/') > -1) {
            this.imgPreview.nativeElement.style.display = 'block';
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent) => {
                const fr = e.target as FileReader;
                value.dataUrl = fr.result;
                this.writeValue(value);
            };
            reader.readAsDataURL(file);
        } else {
            this.imgPreview.nativeElement.style.display = 'none';
            this.writeValue(value);
        }
    }

    getImageUrl(data?: FileData|null): string|ArrayBuffer {
        return FileData.getImageUrl(this.filesDirBaseUrl, data || this.controlValue);
    }

    fileClear() {
        this.writeValue(null, true);
        delete this.files[this.fieldName];
        if (this.imgPreview && this.imgPreview.nativeElement) {
            this.imgPreview.nativeElement.src = '';
            this.imgPreview.nativeElement.style.display = 'none';
        }
    }

    dropHandler(event: DragEvent): void {
        event.preventDefault();
        let file;
        if (event.dataTransfer.items) {
            file = event.dataTransfer.items[0].getAsFile();
        } else {
            file = event.dataTransfer.files[0];
        }
        this.onGetFile(file);
    }

    dragOverHandler(event: DragEvent): void {
        event.preventDefault();
    }

    writeValue(data: FileData|null, clearValue = false) {
        if (!data) {
            this.fileName = '';
            this.imageUrl = '';
            if (clearValue) {
                this.controlValue = null;
            }
        } else {
            this.fileName = `${data.title}.${data.extension}`;
            this.imageUrl = this.getImageUrl(data);
            this.controlValue = data;
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
