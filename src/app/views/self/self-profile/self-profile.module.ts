import { NgModule } from '@angular/core';
import { SelfProfileRoutingModule } from './self-profile-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SelfProfileComponent } from './self-profile.component';
import { SelfProfileEditComponent } from './self-profile-edit/self-profile-edit.component';
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
    SelfProfileRoutingModule
  ],
  providers: [
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
  ],
  declarations: [
    SelfProfileComponent,
    SelfProfileEditComponent
  ]
})


export class SelfProfileModule {

}
