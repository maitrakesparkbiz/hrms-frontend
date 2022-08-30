import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { EmailTemplateComponent } from './email-template.component';


const routes: Routes = [
    {
        path: '',
        component: EmailTemplateComponent,
        data: {
            title: 'Email Templates'
        }
    }
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        QuillModule
    ],
    declarations: [EmailTemplateComponent],
    exports: [RouterModule]
})


export class EmailTemplateModule {

}
