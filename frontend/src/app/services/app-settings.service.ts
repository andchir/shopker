import {Injectable} from '@angular/core';
import {AppSettingsModel} from '../models/app-settings.model';

@Injectable({
    providedIn: 'root'
})
export class AppSettings {
    public location = window.location;
    public settings = (window['appSettings'] || {}) as AppSettingsModel;
    public isAdmin = false;
    public isSuperAdmin = false;

    static getBaseUrl(): string {
        const settings = window['appSettings'] || {};
        return `${settings.webApiUrl}/`;
    }

    constructor () {
        if (this.settings.userRoles && this.settings.userRoles.indexOf('ROLE_ADMIN') > -1) {
            this.isAdmin = true;
        }
        if (this.settings.userRoles && this.settings.userRoles.indexOf('ROLE_SUPER_ADMIN') > -1) {
            this.isAdmin = true;
            this.isSuperAdmin = true;
        }
    }

    getMediaBaseUrl(): string {
        let mediaBaseUrl = this.location.protocol + '//';
        mediaBaseUrl += this.location.hostname;
        mediaBaseUrl += this.settings.filesDirUrl || '';
        return mediaBaseUrl;
    }
}
