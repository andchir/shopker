import { Setting } from './setting.model';

export interface SettingsGroup {
    [key: string]: Setting[]
}
