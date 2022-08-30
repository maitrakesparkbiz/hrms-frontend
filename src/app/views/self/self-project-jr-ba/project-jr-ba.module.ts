import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectJrBaRoutingModule } from './project-jr-ba-routing.module';
import { ProjectJrBaComponent } from './project-jr-ba.component';
import { ProjectJrBaAddComponent } from './project-jr-ba-add/project-jr-ba-add.component';
import { ProjectJrBaApprovedComponent } from './project-jr-ba-approved/project-jr-ba-approved.component';
import { ProjectJrBaApprovedAddComponent } from './project-jr-ba-approved/project-jr-ba-approved-add/project-jr-ba-approved-add.component';

@NgModule({
    imports: [
        SharedModule,
        ProjectJrBaRoutingModule
    ],
    declarations: [
        ProjectJrBaComponent,
        ProjectJrBaAddComponent,
        ProjectJrBaApprovedComponent,
        ProjectJrBaApprovedAddComponent
    ]
})

export class ProjectJrBaModule {

}
