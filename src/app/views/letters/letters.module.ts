import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LetterGenerateComponent } from './letter-generate/letter-generate.component';
import { LetterTemplateComponent } from './letter-template/letter-template.component';
import { LettersRoutingModule } from './letters-routing.module';
import { LetterGenerateCreateComponent } from './letter-generate/letter-generate-create/letter-generate-create.component';
import { LetterTemplateCreateComponent } from './letter-template/letter-template-create/letter-template-create.component';
import {QuillModule} from "ngx-quill";

@NgModule({
    imports: [
        SharedModule,
        LettersRoutingModule,
        QuillModule
    ],
    declarations: [
        LetterGenerateComponent,
        LetterGenerateCreateComponent,
        LetterTemplateComponent,
        LetterTemplateCreateComponent
    ]
})

export class LettersModule {
}
