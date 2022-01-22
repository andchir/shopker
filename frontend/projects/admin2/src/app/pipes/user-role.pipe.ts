import {Pipe, PipeTransform} from '@angular/core';
import {AppSettings} from '../services/app-settings.service';

@Pipe({name: 'userRoleName'})
export class UserRoleNamePipe implements PipeTransform {

    constructor(private appSettings: AppSettings) { }

    transform(value: string): string {
        const rolesHierarchy = this.appSettings.settings.rolesHierarchy;
        let output = value;
        const index = rolesHierarchy.findIndex((roleH) => {
            return roleH.name === value;
        });
        if (index > -1) {
            output = rolesHierarchy[index]['title'];
        }
        return output;
    }
}

@Pipe({name: 'userRoleColor'})
export class UserRoleColorPipe implements PipeTransform {

    transform(value: string): string {
        const colors = {
            ROLE_USER: '#6366F1',
            ROLE_ADMIN_WRITE: '#F59E0B',
            ROLE_SUPER_ADMIN: '#F59E0B',
            ROLE_ADMIN: '#22C55E'
        };
        let output = '#6366F1';
        if (colors.hasOwnProperty(value)) {
            output = colors[value];
        }
        return output;
    }
}
