import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NotFoundComponent} from './not-found.component';
import {OrdersComponent} from './orders/orders.component';
import {CatalogComponent} from './catalog.component';
import {CatalogCategoryComponent} from './catalog-category.component';
import {ContentTypesComponent} from './content-types.component';
import {FieldTypesComponent} from './field-types.component';
import {StatisticsComponent} from './stat.component';
import {SettingsComponent} from './settings.component';
import {UsersComponent} from './users/users.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
    },
    {
        path: 'orders',
        component: OrdersComponent
    },
    // {
    //     path: 'catalog',
    //     component: CatalogComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'category/0',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'category/:categoryId',
    //             component: CatalogCategoryComponent
    //         },
    //         {
    //             path: 'content_types',
    //             component: ContentTypesComponent
    //         },
    //         {
    //             path: 'field_types',
    //             component: FieldTypesComponent
    //         }
    //     ]
    // },
    {
        path: 'statistics',
        component: StatisticsComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
@NgModule({
    imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}
