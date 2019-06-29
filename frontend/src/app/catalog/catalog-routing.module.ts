import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CatalogComponent} from './catalog.component';
import {CatalogCategoryComponent} from './catalog-category.component';
import {ContentTypesComponent} from './content-types.component';
import {FieldTypesComponent} from './field-types.component';

const routes: Routes = [
    {
        path: '',
        component: CatalogComponent,
        children: [
            {
                path: '',
                redirectTo: 'category/'
            },
            {
                path: 'category',
                redirectTo: 'category/'
            },
            {
                path: 'category/:categoryId',
                component: CatalogCategoryComponent
            },
            {
                path: 'content_types',
                component: ContentTypesComponent
            },
            {
                path: 'field_types',
                component: FieldTypesComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule {
}
