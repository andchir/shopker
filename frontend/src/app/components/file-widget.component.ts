import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {FileData} from '../catalog/models/file-data.model';
import {AppSettings} from '../services/app-settings.service';

@Component({
    selector: 'app-file-widget',
    templateUrl: 'templates/app-file-widget.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileWidgetComponent),
            multi: true
        }
    ]
})
export class FileWidgetComponent implements OnInit, ControlValueAccessor {

    @Input() fieldName: string;
    @Input() fieldTitle: string;
    @Input() hasPreviewImage = false;
    @Input() required = false;
    @Input() allowedExtensions = '';
    @Input() files: { [key: string]: File } = {};
    @ViewChild('imgPreview') imgPreview: ElementRef;
    @Input('controlValue') _controlValue: FileData|null = null;
    filesDirBaseUrl: string;

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
        this.onChange(val);
    }

    onChange: (value: FileData) => void = () => null;

    ngOnInit(): void {
        if (!this.fieldName) {
            this.fieldName = 'image';
        }
    }

    fileChange(event): void {
        if (event.target.files.length > 0) {
            this.onGetFile(event.target.files[0]);
        }
    }

    onGetFile(file: File): void {
        const value: FileData = FileData.getFileData(file);
        this.files[this.fieldName] = file;
        this.writeValue(value);
        if (this.hasPreviewImage && file.type.indexOf('image/') > -1) {
            this.imgPreview.nativeElement.style.display = 'block';
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent) => {
                const fr = e.target as FileReader;
                value.dataUrl = fr.result;
                this.controlValue = value;
            };
            reader.readAsDataURL(file);
        } else {
            this.imgPreview.nativeElement.style.display = 'none';
        }
    }

    getImageUrl(): string|ArrayBuffer {
        return FileData.getImageUrl(this.filesDirBaseUrl, this.controlValue);
    }

    fileClear() {
        this.writeValue(null);
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

    writeValue(value: FileData|null) {
        this.controlValue = value;
    }

    registerOnChange(fn: (_: FileData) => void): void {
        this.onChange = fn;
    }

    registerOnTouched() {}

}
