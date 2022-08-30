import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SelfBaTlRoutingModule } from './self-ba-tl-routing.module';
import { BaTlProjectsComponent } from './ba-tl-projects/ba-tl-projects.component';
import { BaTlOwnProjectsComponent } from './ba-tl-own-projects/ba-tl-own-projects.component';

@NgModule({
    imports: [
        SharedModule,
        SelfBaTlRoutingModule
    ],
    declarations: [
        BaTlProjectsComponent,
        BaTlOwnProjectsComponent
    ]
})

export class SelfBaTlModule {

}
