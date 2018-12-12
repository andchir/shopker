import { SettingGroupPretty } from '../settings/models/setting.model';

export interface AppSettingsModel {
    appName: string;
    webApiUrl: string;
    environment: string;
    filesDirUrl: string;
    userEmail: string;
    userRoles: string[];
    locale: string;
    rolesHierarchy: any[];
    systemSettings: SettingGroupPretty;
}
