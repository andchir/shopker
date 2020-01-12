import {NgModule} from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found.component';
import {ModuleLoaderComponent} from './moduleloader/moduleloader.component';

export const routes: Routes = [
    {path: '', redirectTo: 'orders', pathMatch: 'full'},
    {path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)},
    {path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)},
    {path: 'statistics', loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule)},
    {path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
    {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
    {path: 'templates_edit', loadChildren: () => import('./templates-edit/templates-edit.module').then(m => m.TemplatesEditModule)},
    {path: 'import-export', loadChildren: () => import('./import-export/import-export.module').then(m => m.ImportExportModule)},
    {path: 'module/:moduleName', component: ModuleLoaderComponent},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
