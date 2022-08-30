import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import {SelfTimingsComponent} from "./self-timings.component";

const routes: Routes = [
    {
        path: '',
        component: SelfTimingsComponent,
        data: {
            title: 'Employee Timing',
            auth: 'SELF-TIMINGS.VIEW'
        },
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

export class SelfTimingsRoutingComponent {

}
