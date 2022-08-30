import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { BaProjectsComponent } from "./ba-projects/ba-projects.component";
import { SelfBaRoutingModule } from "./self-ba-routing.module";

@NgModule({
    imports: [
        SharedModule,
        SelfBaRoutingModule
    ],
    declarations: [
        BaProjectsComponent
    ]
})

export class SelfBaModule {

}
