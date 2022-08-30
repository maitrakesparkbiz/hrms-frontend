import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { SelfJobsComponent } from './self-jobs.component';
import { JobOpenigsComponent } from './job-openings/job-openings.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';

const routes: Routes = [
    {
        path: 'openings',
        component: JobOpenigsComponent,
        data: {
            title: 'Job Openings',
            auth: 'SELF-JOBS.OPENINGS.VIEW'
        }
    },
    {
        path: 'applications',
        component: JobApplicationsComponent,
        data: {
            title: 'Job Applications',
            auth: 'SELF-JOBS.APPLICATIONS.VIEW'
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

export class SelfJobsRoutingModule {

}
