import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
// Import Containers
import { DefaultLayoutComponent } from './containers';
import { AuthGuardService } from './shared/guard/auth-guard.service';
import { AppLockGuardService } from './shared/guard/app-lock-guard.service';
import { PublicJobsComponent } from './views/public-jobs/public-jobs.component';
import { ActivityBoxComponent } from './views/activity-box/activity-box.component';
import { P404Component } from './views/error/404.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'self',
        redirectTo: 'self/dashboard',
        pathMatch: 'full',
    },
    {
        path: 'self',
        component: DefaultLayoutComponent,
        canActivateChild: [AuthGuardService, AppLockGuardService],
        data: {
            title: 'self'
        },
        // canActivate: [RoleGuard],
        children: [
            {
                path: 'dashboard',
                data: {
                    auth: 'SELF-DASHBOARD.VIEW'
                },
                loadChildren: 'app/views/self/self-dashboard/self-dashboard.module#SelfDashboardModule',
            },
            {
                path: 'profile',
                data: {
                    auth: 'SELF-PROFILE.VIEW'
                },
                loadChildren: 'app/views/self/self-profile/self-profile.module#SelfProfileModule',
            },
            {
                path: 'news',
                data: {
                    auth: 'SELF-NEWS.VIEW'
                },
                loadChildren: 'app/views/self/self-news/self-news.module#SelfNewsModule',
            },
            {
                path: 'calendar',
                data: {
                    auth: 'SELF-CALENDER.VIEW'
                },
                loadChildren: 'app/views/self/self-calendar/self-calendar.module#SelfCalendarModule',
            },
            {
                path: 'jobs',
                data: {
                    auth: 'SELF-JOBS.VIEW'
                },
                loadChildren: 'app/views/self/self-jobs/self-jobs.module#SelfJobsModule',
            },
            {
                path: 'expense',
                data: {
                    auth: 'SELF-EXPENSE-CLAIMS.VIEW'
                },
                loadChildren: 'app/views/self/self-expense/self-expense.module#SelfExpenseModule',
            },
            {
                path: 'company-policy',
                data: {
                    auth: 'SELF-COMPANY-POLICY.VIEW'
                },
                loadChildren: 'app/views/self/self-company-policy/self-company-policy.module#SelfCompanyPolicyModule',
            },
            {
                path: 'leave',
                data: {
                    auth: 'SELF-LEAVES.VIEW'
                },
                loadChildren: 'app/views/self/self-leaves/self-leaves.module#SelfLeavesModule',
            },
            {
                path: 'attendance',
                data: {
                    auth: 'SELF-ATTENDANCE.VIEW'
                },
                loadChildren: 'app/views/self/self-attn/self-attn.module#SelfAttnModule'
            },
            {
                path: 'team',
                data: {
                    auth: 'SELF-TEAM.VIEW'
                },
                loadChildren: 'app/views/self/self-team/self-team.module#SelfTeamModule'
            },
            {
                path: 'activity-box',
                component: ActivityBoxComponent,
                data: {
                    title: 'Activity Box',
                    auth: 'ACTIVITY-BOX.VIEW'
                }
                // loadChildren: 'app/views/activity-box/activity-box.module#ActivityBoxModule'
            },
            {
                path: 'ba',
                data: {
                    auth: 'SELF-BA.VIEW'
                },
                loadChildren: 'app/views/self/self-project-ba/project-ba.module#ProjectBaModule'
            },
            {
                path: 'sales',
                data: {
                    auth: 'SELF-SALES.VIEW'
                },
                loadChildren: 'app/views/self/self-project-sales/project-sales.module#ProjectSalesModule'
            },
            {
                path: 'jr-ba',
                data: {
                    auth: 'SELF-JR-BA.VIEW'
                },
                loadChildren: 'app/views/self/self-project-jr-ba/project-jr-ba.module#ProjectJrBaModule'
            },
            {
                path: 'ba-tl',
                data: {
                    auth: 'SELF-BA-TL.VIEW'
                },
                loadChildren: 'app/views/self/self-ba-tl/self-ba-tl.module#SelfBaTlModule'
            },
            {
                path: 'ba',
                data: {
                    auth: 'SELF-BA.VIEW'
                },
                loadChildren: 'app/views/self/self-ba/self-ba.module#SelfBaModule'
            },
            {
                path: 'timings',
                data: {
                    auth: 'SELF-TIMINGS.VIEW'
                },
                loadChildren: 'app/views/self/self-timings/self-timings.module#SelfTimingsModule',
            }
        ]
    },
    {
        path: 'attendance/report',
        pathMatch: 'full',
        loadChildren: 'app/views/attendance/report/report.module#ReportModule'
    },
    {
        path: '',
        component: DefaultLayoutComponent,
        data: {
            title: 'Home'
        },
        canActivateChild: [AuthGuardService, AppLockGuardService],
        // canActivate: [RoleGuard],
        children: [
            {
                path: 'dashboard',
                data: {
                    auth: 'DASHBOARD.VIEW'
                },
                loadChildren: 'app/views/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'settings',
                data: {
                    auth: 'SETTINGS.VIEW'
                },
                loadChildren: 'app/views/settings/settings.module#SettingsModule'
            },
            {
                path: 'employee',
                data: {
                    auth: 'EMPLOYEES.VIEW'
                },
                loadChildren: 'app/views/employees/employees.module#EmployeesModule'
            },
            {
                path: 'leave',
                data: {
                    auth: 'LEAVES.VIEW'
                },
                loadChildren: 'app/views/leave/leave.module#LeaveModule'
            },
            {
                path: 'attendance',
                data: {
                    auth: 'ATTENDANCE.VIEW'
                },
                loadChildren: 'app/views/attendance/attendance.module#AttendanceModule'
            },
            {
                path: 'news',
                data: {
                    auth: 'NEWS.VIEW'
                },
                loadChildren: 'app/views/news/news.module#NewsModule'
            },
            {
                path: 'appreciation',
                data: {
                    auth: 'APPRECIATIONS.VIEW'
                },
                loadChildren: 'app/views/appreciations/appreciations.module#AppreciationsModule'
            },
            {
                path: 'holiday-events',
                data: {
                    auth: 'HOLIDAY-EVENTS.VIEW'
                },
                loadChildren: 'app/views/holiday-events/holiday-events.module#HolidayEventsModule'
            },
            {
                path: 'expense',
                data: {
                    auth: 'EXPENSE.VIEW'
                },
                loadChildren: 'app/views/expense/expense.module#ExpenseModule'
            },
            {
                path: 'jobs',
                data: {
                    auth: 'JOBS.VIEW'
                },
                loadChildren: 'app/views/jobs/jobs.module#JobsModule'
            },
            {
                path: 'contacts',
                data: {
                    auth: 'CONTACTS.VIEW'
                },
                loadChildren: 'app/views/contacts/contacts.module#ContactsModule'
            },
            {
                path: 'teams',
                data: {
                    auth: 'TEAMS.VIEW'
                },
                loadChildren: 'app/views/team/team.module#TeamModule'
            },
            {
                path: 'employee-contacts',
                data: {
                    auth: 'EMPLOYEE-CONTACTS.VIEW'
                },
                loadChildren: 'app/views/employee-contacts/employee-contacts.module#EmployeeContactsModule'
            },
            {
                path: 'letters',
                data: {
                    auth: 'LETTERS.VIEW'
                },
                loadChildren: 'app/views/letters/letters.module#LettersModule'
            }
        ]
    },
    {
        path: 'login',
        pathMatch: 'full',
        loadChildren: 'app/views/login/login.module#LoginModule'
    },
    {
        path: 'lock',
        pathMatch: 'full',
        loadChildren: 'app/views/lock-app/lock-app.module#LockAppModule'
    },
    {
        path: 'job/:id/:name',
        pathMatch: 'full',
        component: PublicJobsComponent
    },
    {
        path: '**',
        component: P404Component
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    declarations: [],
    exports: [RouterModule]
})
export class AppRoutingModule {
    publicOpenings;
}
