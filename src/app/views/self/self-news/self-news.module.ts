import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelfNewsComponent } from './self-news.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: SelfNewsComponent,
        data: {
            title: 'News'
        }
    }
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [SelfNewsComponent],
    exports: [RouterModule]
})

export class SelfNewsModule {

}
