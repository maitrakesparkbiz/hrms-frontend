import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppreciationsComponent } from './appreciations.component';
import { AppreciationsEditComponent } from './appreciations-edit/appreciations-edit.component';
const routes: Routes = [
    {
        path: '',
        component: AppreciationsComponent,
        data: {
            title: 'Appreciation',
        },
    },
    {
        path: 'create',
        component: AppreciationsEditComponent,
        data: {
            title: 'Appreciation create',
            auth: 'APPRECIATIONS.ADD'
        },
    },
    {
        path: 'edit/:id',
        component: AppreciationsEditComponent,
        data: {
            title: 'Appreciation Edit',
            auth: 'APPRECIATIONS.EDIT'
        },
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppreciationsRoutingModule {
}
