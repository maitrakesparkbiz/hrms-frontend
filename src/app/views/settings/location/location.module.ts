
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location.component';


const routes: Routes = [
    {
        path: '',
        component: LocationComponent,
        data: {
            title: 'Location'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [LocationComponent],
    exports: [RouterModule]
})
export class LocationModule {
}
