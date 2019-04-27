import { Injectable, Component } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes} from '@angular/router';

declare const adminRoutes: Routes;

export function parseUrlPathInSegments(fullUrl: string): Array<string> {
    const result = fullUrl
        .split('/')
        .filter(segment => segment)
        .map(segment => {
            let path = segment;
            const paramPos = path.indexOf(';');
            if (paramPos > -1) {
                path = path.substring(0, paramPos);
            }
            const outletPos = path.indexOf(':');
            if (outletPos > -1) {
                path = path.substring(outletPos + 1, path.length - 1);
            }
            return path;
        });
    return result;
}

@Injectable()
export class DynamicPathGuard implements CanActivate {

    constructor(private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const segments = parseUrlPathInSegments(state.url);
        const lastPath = segments.pop();

        console.log('DynamicPathGuard', route, lastPath, segments, state);

        setTimeout(()=>{
            //this.router.navigateByUrl(state.url);
        },0);

        // if (lastPath === 'dynamic') {
        //     // Trigger change detection so url is known for router
        //     setTimeout(()=>{
        //         this.router.navigateByUrl(state.url);
        //     },0);
        // } else {
        //     this.router.navigateByUrl('/404');
        // }

        // setTimeout(() => {
        //     this.router.navigateByUrl('/404');
        // });

        return false;
    }
}
