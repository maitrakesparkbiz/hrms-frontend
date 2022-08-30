import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {SelfTimingsComponent} from "./self-timings.component";
import {SelfTimingsRoutingComponent} from "./self-timings-routing.component";

@NgModule({
    imports: [
        SharedModule,
        SelfTimingsRoutingComponent
    ],
    declarations: [
        SelfTimingsComponent
    ],
})

export class SelfTimingsModule {

}
