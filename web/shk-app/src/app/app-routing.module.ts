import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NotFoundComponent} from './not-found.component';
// import {CatalogComponent} from './catalog.component';
// import {CatalogCategoryComponent} from './catalog-category.component';
// import {ContentTypesComponent} from './content-types.component';
// import {FieldTypesComponent} from './field-types.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
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
        path: 'orders',
        loadChildren: 'app/orders/orders.module#OrdersModule'
    },
    {
        path: 'statistics',
        loadChildren: 'app/statistics/statistics.module#StatisticsModule'
    },
    {
        path: 'users',
        loadChildren: 'app/users/users.module#UsersModule'
    },
    {
        path: 'settings',
        loadChildren: 'app/settings/settings.module#SettingsModule'
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
