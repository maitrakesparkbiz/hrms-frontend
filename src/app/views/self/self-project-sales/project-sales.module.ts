import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectSalesRoutingModule } from './project-sales-routing.module';
import { ProjectSalesComponent } from './project-sales.component';
import { ProjectSalesAddComponent } from './project-sales-add/project-sales-add.component';
import { ProjectSalesApprovedComponent } from './project-sales-approved/project-sales-approved.component';
import { ProjectSalesApprovedAddComponent } from './project-sales-approved/project-sales-approved-add/project-sales-approved-add.component';

@NgModule({
    imports: [
        SharedModule,
        ProjectSalesRoutingModule
    ],
    declarations: [
        ProjectSalesComponent,
        ProjectSalesAddComponent,
        ProjectSalesApprovedComponent,
        ProjectSalesApprovedAddComponent
    ]
})

export class ProjectSalesModule {

}
