import {SettingGroupPretty} from '../settings/models/setting.model';

export interface AppSettingsModel {
    appName: string;
    webApiUrl: string;
    environment: string;
    filesDirUrl: string;
    templateTheme: string,
    isFileManagerEnabled: boolean,
    userEmail: string;
    userRoles: string[];
    locale: string;
    localeList: string[],
    rolesHierarchy: any[];
    systemSettings: SettingGroupPretty;
    version: string;
}
