export interface SettingOption {
    value: number | string;
    type: string;
}

export interface SettingOptionArr {
    [key: string]: string | number;
}

export interface Setting {
    name: string;
    value?: string | number;
    description?: string;
    key?: string;
    groupName?: string;
    options?: {[key: string]: SettingOption};
}

export interface SettingGroupPretty {
    [groupName: string]: SettingPretty[];
}

export interface SettingPretty {
    id: number;
    name: string;
    description?: string;
    options?: {[key: string]: SettingOptionArr[]};
}

export interface SettingsGroup {
    [key: string]: Setting[];
}

export class SettingsData {
    constructor(
        public changed: boolean,
        public loading: boolean,
        public values: Setting[],
        public defaultOptions: {[key: string]: SettingOption},
        public defaultValues?: any,
    ) { }
}
