import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {NotFoundComponent} from './not-found.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
    },
    {path: 'home', component: HomeComponent},
    {path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)},
    {path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)},
    {path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
    {path: 'statistics', loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule)},
    {path: 'code_edit', loadChildren: () => import('./code-edit/templates-edit.module').then(m => m.TemplatesEditModule)},
    {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
