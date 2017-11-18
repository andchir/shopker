import { Injectable } from '@angular/core';
import { AppSettingsModel } from '../models/app-settings.model';

@Injectable()
export class AppSettings {
    public location = window.location;
    public settings = window['appSettings'] as AppSettingsModel;

    constructor () {

    }

    getMediaBaseUrl(): string {
        let mediaBaseUrl = this.location.protocol + '//';
        mediaBaseUrl += this.location.hostname;
        mediaBaseUrl += this.settings.filesDirUrl;
        return mediaBaseUrl;
    }
}
