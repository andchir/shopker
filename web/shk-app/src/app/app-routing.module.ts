import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { OrdersComponent } from './orders.component';
import { CatalogComponent } from './catalog.component';
import { CatalogCategoryComponent } from './catalog-category.component';
import { ContentTypesComponent } from './content-types.component';
import { FieldTypesComponent } from './field-types.component';
import { StatisticsComponent } from './stat.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/orders',
        pathMatch: 'full'
    },
    {
        path: 'orders',
        component: OrdersComponent,
        data: {title: 'Orders'}
    },
    {
        path: 'catalog',
        component: CatalogComponent,
        data: {title: 'Catalog'},
        children: [
            {
                path: '',
                redirectTo: 'category/0',
                pathMatch: 'full'
            },
            {
                path: 'category/:categoryId',
                component: CatalogCategoryComponent,
                data: {title: 'Catalog'}
            },
            {
                path: 'content_types',
                component: ContentTypesComponent,
                data: {title: 'Content types'}
            },
            {
                path: 'field_types',
                component: FieldTypesComponent,
                data: {title: 'Field types'}
            },
        ]
    },
    {
        path: 'statistics',
        component: StatisticsComponent,
        data: {title: 'Statistics'}
    },
    {
        path: 'settings',
        component: SettingsComponent,
        data: {title: 'Settings'}
    },
    {
        path: '**',
        component: NotFoundComponent,
        data: {title: 'Page not found'}
    }
];
@NgModule({
    imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}
