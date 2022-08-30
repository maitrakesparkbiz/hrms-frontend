import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AuthGuardService } from '../../shared/guard/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        data: {
            title: 'Setting'
        },
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                data: { auth: 'SETTINGS.VIEW' },
                loadChildren: 'app/views/settings/default/default.module#DefaultModule'
            },
            {
                path: 'company',
                data: { auth: 'GENERAL-ADMIN.VIEW' },
                loadChildren: 'app/views/settings/company/company.module#CompanyModule'
            },
            {
                path: 'company-setting',
                data: { auth: 'GENERAL-SETTINGS.VIEW' },
                loadChildren: 'app/views/settings/company-setting/company-setting.module#CompanySettingModule'
            },
            {
                path: 'company-policy',
                data: { auth: 'COMPANY-POLICY.VIEW' },
                loadChildren: 'app/views/settings/company-policy/company-policy.module#CompanyPolicyModule'
            },
            {
                path: 'department',
                data: { auth: 'DEPARTMENTS.VIEW' },
                loadChildren: 'app/views/settings/department/department.module#DepartmentModule'
            },
            {
                path: 'designation',
                data: { auth: 'DESIGNATIONS.VIEW' },
                loadChildren: 'app/views/settings/designation/designation.module#DesignationModule'
            },
            {
                path: 'location',
                data: { auth: 'BATCHES.VIEW' },
                loadChildren: 'app/views/settings/location/location.module#LocationModule'
            },
            {
                path: 'expense-categories',
                data: { auth: 'EXPENSE-CATEGORIES.VIEW' },
                loadChildren: 'app/views/settings/expense_categories/expense_categories.module#ExpenseCategoriesModule'
            },
            {
                path: 'role',
                data: { auth: 'ROLES.VIEW' },
                loadChildren: 'app/views/settings/role/role.module#RoleModule'
            },
            {
                path: 'award',
                data: { auth: 'AWARDS.VIEW' },
                loadChildren: 'app/views/settings/award/award.module#AwardModule',

            },
            {
                path: 'holiday',
                data: { auth: 'HOLIDAYS.VIEW' },
                loadChildren: 'app/views/settings/holiday/holiday.module#HolidayModule',
            },
            {
                path: 'change-password',
                data: { auth: 'CHANGE-PASSWORD.VIEW' },
                loadChildren: 'app/views/settings/change-password/change-password.module#ChangePasswordModule',

            },
            {
                path: 'attendence',
                data: { auth: 'ATTENDANCE.VIEW' },
                loadChildren: 'app/views/settings/attendence/attendence.module#AttendenceModule',
            },
            {
                path: 'leave-types',
                data: { auth: 'LEAVETYPES.VIEW' },
                loadChildren: 'app/views/settings/leave_types/leave_types.module#LeaveTypesModule',

            },
            {
                path: 'email-settings',
                data: { auth: 'EMAIL-SETTINGS.VIEW' },
                loadChildren: 'app/views/settings/email-settings/email-settings.module#EmailSettingsModule',
            },
            {
                path: 'email-templates',
                data: { auth: 'EMAIL-TEMPLATES.VIEW' },
                loadChildren: 'app/views/settings/email-template/email-template.module#EmailTemplateModule',
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule {
}
