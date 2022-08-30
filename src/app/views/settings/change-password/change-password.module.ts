
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';

const routes: Routes = [
    {
        path: '',
        component: ChangePasswordComponent,
        data: {
            title: 'change-password',
            auth: 'CHANGE-PASSWORD.VIEW'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ChangePasswordComponent],
    exports: [RouterModule]
})
export class ChangePasswordModule {
}

