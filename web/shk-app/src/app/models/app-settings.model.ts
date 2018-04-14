import { SettingPretty } from './setting.model';

export interface AppSettingsModel {
    appName: string;
    webApiUrl: string;
    environment: string;
    filesDirUrl: string;
    locale: string;
    systemSettings: {[groupName: string]: SettingPretty[]}
}
