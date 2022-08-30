import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EmailSettingsComponent } from './email-settings.component';
import { QuillModule } from 'ngx-quill';


const routes: Routes = [
    {
        path: '',
        component: EmailSettingsComponent,
        data: {
            title: 'Email Settings'
        }
    }
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        QuillModule
    ],
    declarations: [EmailSettingsComponent],
    exports: [RouterModule]
})


export class EmailSettingsModule {

}
