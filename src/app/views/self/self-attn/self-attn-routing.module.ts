import { Routes, RouterModule } from '@angular/router';
import { AttnSummaryComponent } from './attn-summary/attn-summary.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'summary',
        component: AttnSummaryComponent,
        data: {
            title: 'Attendance Summary'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class SelfAttnRoutingModule {

}
