import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AttnSummaryComponent } from './attn-summary/attn-summary.component';
import { SelfAttnRoutingModule } from './self-attn-routing.module';
import { ProgressbarModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        SharedModule,
        SelfAttnRoutingModule,
        ProgressbarModule.forRoot()
    ],
    declarations: [
        AttnSummaryComponent
    ]
})

export class SelfAttnModule {

}
