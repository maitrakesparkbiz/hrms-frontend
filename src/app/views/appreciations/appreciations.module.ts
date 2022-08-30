import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng-select';
import { AppreciationsComponent } from './appreciations.component';
import { AppreciationsRoutingModule } from './appreciations.routing.module';
import { AppreciationsEditComponent } from './appreciations-edit/appreciations-edit.component';
import { OwlDateTimeFormats, DateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

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
        AppreciationsRoutingModule,
    ],
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS }
    ],
    declarations: [
        AppreciationsComponent,
        AppreciationsEditComponent
    ]
})
export class AppreciationsModule {
}
