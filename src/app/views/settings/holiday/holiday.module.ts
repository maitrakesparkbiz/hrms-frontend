import { NgModule } from '@angular/core';
import { HolidayComponent } from './holiday.component';
import { HolidayRoutingModule } from './holiday-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { HolidayAddComponent } from './holiday-add/holiday-add.component';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from 'ng-pick-datetime';

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
        HolidayRoutingModule,
        SharedModule
    ],
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS }
    ],
    declarations: [
        HolidayComponent,
        HolidayAddComponent
    ]
})

export class HolidayModule {

}
