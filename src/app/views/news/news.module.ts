import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NewsRoutingModule } from './news.routing.module';
import { NewsComponent } from './news.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
        SharedModule,
        NgSelectModule,
        QuillModule,
        NewsRoutingModule,
        CommonModule,
        NgMultiSelectDropDownModule.forRoot(),
    ],
    declarations: [
        NewsEditComponent,
        NewsComponent
    ]
})
export class NewsModule {
}
