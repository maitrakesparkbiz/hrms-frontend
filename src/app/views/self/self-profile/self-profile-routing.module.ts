import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { SelfProfileComponent } from './self-profile.component';
import { SelfProfileEditComponent } from './self-profile-edit/self-profile-edit.component';

const routes: Routes = [
    {
        path: '',
        component: SelfProfileComponent,
        data: {
            title: 'Profile'
        }
    },
    {
        path: 'edit',
        component: SelfProfileEditComponent,
        data: {
            title: 'Edit',
            auth: 'SELF-PROFILE.EDIT'
        }
    },
    {
        path: ':id',
        component: SelfProfileComponent,
        data: {
            title: 'Profile',
            auth: 'EMPLOYEES.VIEW'
        }
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})


export class SelfProfileRoutingModule {

}
