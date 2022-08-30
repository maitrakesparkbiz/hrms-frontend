import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectBaRoutingModule } from './project-ba-routing.module';
import { ProjectBaComponent } from './project-ba.component';
import { ProjectBaAddComponent } from './project-ba-add/project-ba-add.component';
import { ProjectBaApprovedComponent } from './project-ba-approved/project-ba-approved.component';
import { ProjectBaApprovedAddComponent } from './project-ba-approved/project-ba-approved-add/project-ba-approved-add.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeFormats} from "ng-pick-datetime";
import {MomentDateTimeAdapter} from "ng-pick-datetime-moment";


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
        ProjectBaRoutingModule,
        NgMultiSelectDropDownModule.forRoot(),
    ],
    providers: [
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
    ],
    declarations: [
        ProjectBaComponent,
        ProjectBaAddComponent,
        ProjectBaApprovedComponent,
        ProjectBaApprovedAddComponent
    ],
})

export class ProjectBaModule {

}
