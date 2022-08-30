import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { RoleEditComponent } from './role_edit/role_edit.component';

const routes: Routes = [
    {
        path: '',
        component: RoleComponent,
        data: {
            title: 'Role'
        },
    },
    {
        path: 'create',
        component: RoleEditComponent,
        data: {
            title: 'Add Role',
            auth: 'ROLES.ADD'
        }
    },
    {
        path: 'edit-role/:id',
        component: RoleEditComponent,
        data: {
            title: 'Edit Role',
            auth: 'ROLES.EDIT'
        }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule {
}
