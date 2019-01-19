import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TemplatesEditComponent} from './templates-edit.component';

const routes: Routes = [
    {
        path: '',
        component: TemplatesEditComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesEditRoutingModule { }
