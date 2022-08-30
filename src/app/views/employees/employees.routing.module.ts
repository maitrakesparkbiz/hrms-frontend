import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { SelfProfileComponent } from '../self/self-profile/self-profile.component';
const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    data: {
      title: 'Employee'
    },
  },
  {
    path: 'create-employee',
    component: EmployeeAddComponent,
    data: {
      title: 'Add Employee',
      auth: 'EMPLOYEES.ADD'
    }
  },
  {
    path: 'update/:id',
    component: EmployeeEditComponent,
    data: {
      title: 'Edit Employee',
      auth: 'EMPLOYEES.EDIT'
    }
  },
  {
    path: 'employee-profile/:id',
    data: {
      title: 'Edit Employee',
      auth: 'EMPLOYEES.VIEW'
    },
    loadChildren: 'app/views/self/self-profile/self-profile.module#SelfProfileModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {
}
