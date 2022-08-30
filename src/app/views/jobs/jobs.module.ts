import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { JobsAddComponent } from './jobs-add/jobs-add.component';
import { QuillModule } from 'ngx-quill';
import { ApplicationsComponent } from './applications/applications.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { ApplicationsAddComponent } from './applications/application-add/applications-add.component';
import { TodayInterviewComponent } from './today-interview/today-interview.component';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from 'ng-pick-datetime';
import {CandidatesInfoComponent} from "./candidates-info/candidates-info.component";
import {CandidatesAddComponent} from "./candidates-info/candidates-add/candidates-add.component";
export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'DD/MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};
@NgModule({
    imports: [
        SharedModule,
        JobsRoutingModule,
        QuillModule
    ],
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS }
    ],
    declarations: [
        JobsComponent,
        JobsAddComponent,
        ApplicationsComponent,
        ScheduledComponent,
        ApplicationsAddComponent,
        TodayInterviewComponent,
        CandidatesInfoComponent,
        CandidatesAddComponent
    ]
})

export class JobsModule {
}
