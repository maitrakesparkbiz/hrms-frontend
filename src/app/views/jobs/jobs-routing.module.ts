import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { JobsAddComponent } from './jobs-add/jobs-add.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { ApplicationsAddComponent } from './applications/application-add/applications-add.component';
import { TodayInterviewComponent } from './today-interview/today-interview.component';
import {CandidatesInfoComponent} from "./candidates-info/candidates-info.component";
import {CandidatesAddComponent} from "./candidates-info/candidates-add/candidates-add.component";

const routes: Routes = [
    {
        path: 'openings',
        component: JobsComponent,
        data: {
            title: 'Jobs',
            auth: 'JOBS.OPENINGS.VIEW'
        }
    },
    {
        path: 'openings/create',
        component: JobsAddComponent,
        data: {
            title: 'Create Opening',
            auth: 'JOBS.OPENINGS.ADD'
        }
    },
    {
        path: 'openings/update-job/:id',
        component: JobsAddComponent,
        data: {
            title: 'edit',
            auth: 'JOBS.OPENINGS.EDIT'
        }
    },
    {
        path: 'applications',
        component: ApplicationsComponent,
        data: {
            title: 'Applications',
            auth: 'JOBS.APPLICATIONS.VIEW'
        }
    },
    {
        path: 'applications/add',
        component: ApplicationsAddComponent,
        data: {
            title: 'Applications',
            auth: 'JOBS.APPLICATIONS.ADD'
        }
    },
    {
        path: 'applications/edit/:id',
        component: ApplicationsAddComponent,
        data: {
            title: 'Applications',
            auth: 'JOBS.APPLICATIONS.EDIT'
        }
    },
    {
        path: 'scheduled',
        component: ScheduledComponent,
        data: {
            title: 'Scheduled',
            auth: 'JOBS.SCHEDULED.VIEW'
        }
    },
    {
        path: 'today-scheduled',
        component: TodayInterviewComponent,
        data: {
            title: 'Today Interview',
            auth: 'JOBS.TODAY-INTERVIEW.VIEW'
        }
    },
    {
        path: 'candidates-info',
        component: CandidatesInfoComponent,
        data: {
            title: 'Candidates',
            auth: 'JOBS.CANDIDATES-INFO.VIEW'
        }
    },
    {
        path: 'candidates-info/add',
        component: CandidatesAddComponent,
        data: {
            title: 'Candidates',
            auth: 'JOBS.CANDIDATES-INFO.ADD'
        }
    },{
        path: 'candidates-info/edit/:id',
        component: CandidatesAddComponent,
        data: {
            title: 'Candidates',
            auth: 'JOBS.CANDIDATES-INFO.EDIT'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobsRoutingModule {
}
