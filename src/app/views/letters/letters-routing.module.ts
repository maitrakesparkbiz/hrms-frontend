import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LetterGenerateComponent } from './letter-generate/letter-generate.component';
import { LetterTemplateComponent } from './letter-template/letter-template.component';
import { LetterGenerateCreateComponent } from './letter-generate/letter-generate-create/letter-generate-create.component';
import { LetterTemplateCreateComponent } from './letter-template/letter-template-create/letter-template-create.component';

const routes: Routes = [
    {
        path: 'generate',
        component: LetterGenerateComponent,
        data: {
            title: 'Letters',
            auth: 'LETTERS.GENERATE.VIEW'
        }
    },
    {
        path: 'generate/create',
        component: LetterGenerateCreateComponent,
        data: {
            title: 'Letters Create',
            auth: 'LETTERS.GENERATE.ADD'
        }
    },
    {
        path: 'generate/update/:id',
        component: LetterGenerateCreateComponent,
        data: {
            title: 'Letters Update',
            auth: 'LETTERS.GENERATE.EDIT'
        }
    },
    {
        path: 'template',
        component: LetterTemplateComponent,
        data: {
            title: 'Template',
            auth: 'LETTERS.TEMPLATE.VIEW'
        }
    },
    {
        path: 'template/create',
        component: LetterTemplateCreateComponent,
        data: {
            title: 'Template Create',
            auth: 'LETTERS.TEMPLATE.ADD'
        }
    },
    {
        path: 'template/update/:id',
        component: LetterTemplateCreateComponent,
        data: {
            title: 'Template Update',
            auth: 'LETTERS.TEMPLATE.EDIT'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LettersRoutingModule {
}
