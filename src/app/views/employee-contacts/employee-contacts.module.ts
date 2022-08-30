import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeContactsComponent } from './employee-contacts.component';
import { SharedModule } from '../../shared/shared.module';

// const routes: Routes = [
//     {
//         path: 'employee-contacts',
//         component: EmployeeContactsComponent,
//         data: {
//             title: 'Employee Contacts'
//         }
//     }
// ];

const routes: Routes = [
    {
        path: '',
        component: EmployeeContactsComponent,
        data: {
            title: 'Employee Contacts'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        EmployeeContactsComponent
    ],
    exports: [
        RouterModule
    ]
})

export class EmployeeContactsModule {

}
