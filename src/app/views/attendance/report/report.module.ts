import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportComponent} from "./report.component";
import {SharedModule} from "../../../shared/shared.module";
import {AppBreadcrumbModule, AppHeaderModule} from "@coreui/angular";
const routes: Routes = [
    {
        path: '',
        component: ReportComponent,
        data: {
            title: 'Report',
            auth: 'ATTENDANCE.REPORT.VIEW'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        AppHeaderModule,
        AppBreadcrumbModule.forRoot(),
        RouterModule.forChild(routes),

    ],
    declarations: [ReportComponent],
    exports: [RouterModule]
})

export class ReportModule {
}
