import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
const routes: Routes = [
    {
        path: '',
        component: NewsComponent,
        data: {
            title: 'News'
        },
    },
    {
        path: 'create',
        component: NewsEditComponent,
        data: {
            title: 'News Create',
            auth: 'NEWS.ADD'
        },
    },
    {
        path: 'edit/:id',
        component: NewsEditComponent,
        data: {
            title: 'News Edit',
            auth: 'NEWS.EDIT'
        },
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsRoutingModule {
}
