import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SelfJobsComponent } from './self-jobs.component';
import { SelfJobsRoutingModule } from './self-jobs-routing.module';
import { JobApplicationsComponent } from './job-applications/job-applications.component';
import { JobOpenigsComponent } from './job-openings/job-openings.component';


@NgModule({
    imports: [
        SharedModule,
        SelfJobsRoutingModule
    ],
    declarations: [
        SelfJobsComponent,
        JobApplicationsComponent,
        JobOpenigsComponent
    ]
})

export class SelfJobsModule {

}
