import {NgModule} from '@angular/core';
import {NoPreloading, Router, RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./not-found.component";

declare const adminRoutes: Routes;

export const routes: Routes = [
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        preloadingStrategy: NoPreloading
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {

    constructor (
        private router: Router
    ) {
        this.router.config.unshift(...adminRoutes);
    }

}
