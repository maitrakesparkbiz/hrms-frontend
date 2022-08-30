import { AuthGuardService } from './shared/guard/auth-guard.service';
import { OnInit } from '@angular/core';
import { NavService } from './shared/services/nav.service';

export const navItems = [
    {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-home',
        data: {
            auth: 'DASHBOARD.VIEW'
        }
    },
    {
        name: 'Employees',
        url: '/employee',
        icon: 'icon-people',
        data: {
            auth: 'EMPLOYEES.VIEW'
        }
    },
    {
        name: 'Leaves',
        url: '/leave',
        icon: 'icon-rocket',
        data: {
            auth: 'LEAVES.VIEW'
        },
        children: [
            {
                name: 'Today\'s Leaves',
                url: '/leave/today\'s-leaves',
                data: {
                    auth: 'LEAVES.TODAY-LEAVES.VIEW'
                }
            },
            {
                name: 'Leave Applications',
                url: '/leave/leave-applications',
                data: {
                    auth: 'LEAVES.LEAVE-APP.VIEW'
                }
            },
            {
                name: 'Final Leaves Summary',
                url: '/leave/final-leaves',
                data: {
                    auth: 'LEAVES.FINAL-LEAVES.VIEW'
                }
            },
            {
                name: 'Leaves Balance',
                url: '/leave/leave-balance',
                data: {
                    auth: 'LEAVES.LEAVE-BALANCE.VIEW'
                }
            },
            {
                name: 'Leaves Remaining',
                url: '/leave/leave-remaining',
                data: {
                    auth: 'LEAVES.LEAVES-REMAINING.VIEW'
                }
            },
            {
                name: 'Unpaid Leaves',
                url: '/leave/unpaid-leave',
                data: {
                    auth: 'LEAVES.UNPAID-LEAVES.VIEW'
                }
            }
        ]
    },
    {
        name: 'Attendance',
        url: '/attendance',
        icon: 'icon-clock',
        data: {
            auth: 'ATTENDANCE.VIEW'
        },
        children: [
            {
                name: 'Summary',
                url: '/attendance/summary',
                data: {
                    auth: 'ATTENDANCE.SUMMARY.VIEW'
                }
            },
            {
                name: 'Manage',
                url: '/attendance/manage',
                data: {
                    auth: 'ATTENDANCE.MANAGE.VIEW'
                }
            }
            ,
            {
                name: 'Report',
                url: '/attendance/report',
                data: {
                    auth: 'ATTENDANCE.REPORT.VIEW'
                }
            }
        ]
    },
    {
        name: 'Teams Management',
        url: '/teams',
        icon: 'fa fa-users',
        data: {
            auth: 'TEAMS.VIEW'
        }
    },
    {
        name: 'News',
        url: '/news',
        icon: 'icon-bell',
        data: {
            auth: 'NEWS.VIEW'
        }
    },
    {
        name: 'Appreciations',
        url: '/appreciation',
        icon: 'icon-trophy',
        data: {
            auth: 'APPRECIATIONS.VIEW'
        }
    },
    {
        name: 'Holiday & Events',
        url: '/holiday-events',
        icon: 'fa fa-calendar',
        data: {
            auth: 'HOLIDAY-EVENTS.VIEW'
        }
    },
    {
        name: 'Expense',
        url: '/expense',
        icon: 'icon-calculator',
        data: {
            auth: 'EXPENSE.VIEW'
        },
        children: [
            {
                name: 'View Expense',
                url: '/expense/view-expense',
                data: {
                    auth: 'EXPENSE.VIEW-EXPENSE.VIEW'
                }
            },
            {
                name: 'Claims',
                url: '/expense/expense-claims',
                data: {
                    auth: 'EXPENSE.CLAIMS.VIEW'
                }
            },
            {
                name: 'Expense Report',
                url: '/expense/expense-report',
                data: {
                    auth: 'EXPENSE.EXPENSE-REPORT.VIEW'
                }
            }
        ]

    },
    {
        name: 'Jobs',
        url: '/jobs',
        icon: 'icon-people',
        data: {
            auth: 'JOBS.VIEW'
        },
        children: [
            {
                name: 'Openings',
                url: '/jobs/openings',
                data: {
                    auth: 'JOBS.OPENINGS.VIEW'
                }
            },
            {
                name: 'Applications',
                url: '/jobs/applications',
                data: {
                    auth: 'JOBS.APPLICATIONS.VIEW'
                }
            },
            {
                name: 'Scheduled',
                url: '/jobs/scheduled',
                data: {
                    auth: 'JOBS.SCHEDULED.VIEW'
                }
            },
            {
                name: 'Today Interviews',
                url: '/jobs/today-scheduled',
                data: {
                    auth: 'JOBS.TODAY-INTERVIEW.VIEW'
                }
            },
            {
                name: 'Candidates',
                url: '/jobs/candidates-info',
                data: {
                    auth: 'JOBS.CANDIDATES-INFO.VIEW'
                }
            },
        ]
    },
    {
        name: 'Contacts',
        url: '/contacts',
        icon: 'fa fa-vcard',
        data: {
            auth: 'CONTACTS.VIEW'
        }
    },
    {
        name: 'Letters',
        url: '/letters',
        icon: 'fa fa-file',
        data: {
            auth: 'LETTERS.VIEW'
        },
        children: [
            {
                name: 'Generate',
                url: '/letters/generate',
                data: {
                    auth: 'LETTERS.GENERATE.VIEW'
                }
            },
            {
                name: 'Template',
                url: '/letters/template',
                data: {
                    auth: 'LETTERS.TEMPLATE.VIEW'
                }
            }
        ]
    },
    {
        name: 'Employee Contacts',
        url: '/employee-contacts',
        icon: 'fa fa-users',
        data: {
            auth: 'EMPLOYEE-CONTACTS.VIEW'
        }
    },
    {
        name: 'Settings',
        url: '/settings',
        icon: 'icon-settings',
        data: {
            auth: 'SETTINGS.VIEW'
        }
    }
];
