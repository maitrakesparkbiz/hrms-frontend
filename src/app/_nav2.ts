import { AuthGuardService } from './shared/guard/auth-guard.service';

export const navItemsSelf = [
    {
        name: 'Dashboard',
        url: '/self/dashboard',
        icon: 'icon-home',
        data: {
            auth: 'SELF-DASHBOARD.VIEW'
        }
    },
    {
        name: 'My Profile',
        url: '/self/profile',
        icon: 'icon-user',
        data: {
            auth: 'SELF-PROFILE.VIEW'
        }
    },
    {
        name: 'Team',
        url: '/self/team',
        icon: 'fa fa-users',
        data: {
            auth: 'SELF-TEAM.VIEW'
        }
    },
    {
        name: 'Calender',
        url: '/self/calendar',
        icon: 'fa fa-calendar',
        data: {
            auth: 'SELF-CALENDER.VIEW'
        }
    },
    {
        name: 'News',
        url: '/self/news',
        icon: 'icon-bell',
        data: {
            auth: 'SELF-NEWS.VIEW'
        }
    },
    {
        name: 'Jobs',
        url: '/self/jobs',
        icon: 'icon-people',
        data: {
            auth: 'SELF-JOBS.VIEW'
        },
        children: [
            {
                name: 'Openings',
                url: '/self/jobs/openings',
                data: {
                    auth: 'SELF-JOBS.OPENINGS.VIEW'
                }
            },
            {
                name: 'Applications',
                url: '/self/jobs/applications',
                data: {
                    auth: 'SELF-JOBS.APPLICATIONS.VIEW'
                }
            }
        ]
    },
    {
        name: 'Attendance',
        url: '/self/attendance',
        icon: 'icon-clock',
        data: {
            auth: 'SELF-ATTENDANCE.VIEW'
        },
        children: [
            {
                name: 'Summary',
                url: '/self/attendance/summary',
                data: {
                    auth: 'SELF-ATTENDANCE.VIEW'
                }
            }
        ]
    },
    {
        name: 'Leaves',
        url: '/self/leave',
        icon: 'icon-rocket',
        data: {
            auth: 'SELF-LEAVES.VIEW'
        },
        children: [
            {
                name: 'Applications',
                url: '/self/leave/leave-applications',
                data: {
                    auth: 'SELF-LEAVES.APPLICATIONS.VIEW'
                },
            },
            {
                name: 'All Taken Leaves',
                url: '/self/leave/taken-leaves',
                data: {
                    auth: 'SELF-LEAVES.TAKEN-LEAVES.VIEW'
                }
            },
            {
                name: 'Unpaid Leaves',
                url: '/self/leave/unpaid-leave',
                data: {
                    auth: 'SELF-LEAVES.UNPAID-LEAVES.VIEW'
                }
            }
        ]
    },
    {
        name: 'Expense Claims',
        url: '/self/expense/my-claims',
        icon: 'icon-calculator',
        data: {
            auth: 'SELF-EXPENSE-CLAIMS.VIEW'
        }
    },
    {
        name: 'Company Policy',
        url: '/self/company-policy',
        icon: 'fa fa-file',
        data: {
            auth: 'SELF-COMPANY-POLICY.VIEW'
        }
    },
    // {
    //     name: 'Jr BA',
    //     url: '/self/jr-ba',
    //     icon: 'fa fa-briefcase',
    //     data: {
    //         auth: 'SELF-JR-BA.VIEW'
    //     },
    //     children: [
    //         {
    //             name: 'Projects',
    //             url: '/self/jr-ba/projects-jr-ba',
    //             data: {
    //                 auth: 'SELF-JR-BA.PROJECTS.VIEW'
    //             }
    //         },
    //         {
    //             name: 'Approved Projects',
    //             url: '/self/jr-ba/approved-projects',
    //             data: {
    //                 auth: 'SELF-JR-BA.APPROVED-PROJECTS.VIEW'
    //             }
    //         }
    //     ]
    // },
    // {
    //     name: 'BA',
    //     url: '/self/ba',
    //     icon: 'fa fa-briefcase',
    //     data: {
    //         auth: 'SELF-BA.VIEW'
    //     },
    //     children: [
    //         {
    //             name: 'Projects',
    //             url: '/self/ba/projects-ba',
    //             data: {
    //                 auth: 'SELF-BA.PROJECTS.VIEW'
    //             }
    //         },
    //         {
    //             name: 'Approved Projects',
    //             url: '/self/ba/approved-projects',
    //             data: {
    //                 auth: 'SELF-BA.APPROVED-PROJECTS.VIEW'
    //             }
    //         }
    //     ]
    // },
    // {
    //     name: 'Sales',
    //     url: '/self/sales',
    //     icon: 'fa fa-bullhorn',
    //     data: {
    //         auth: 'SELF-SALES.VIEW'
    //     },
    //     children: [
    //         {
    //             name: 'Projects',
    //             url: '/self/sales/projects-sales',
    //             data: {
    //                 auth: 'SELF-SALES.PROJECTS.VIEW'
    //             }
    //         },
    //         {
    //             name: 'Approved Projects',
    //             url: '/self/sales/approved-projects',
    //             data: {
    //                 auth: 'SELF-SALES.APPROVED-PROJECTS.VIEW'
    //             }
    //         }
    //     ]
    // },

    {
        name: 'BA TL',
        url: '/self/ba-tl',
        icon: 'fa fa-briefcase',
        data: {
            auth: 'SELF-BA-TL.VIEW'
        },
        children: [
            {
                name: 'Projects',
                url: '/self/ba-tl/projects',
                data: {
                    auth: 'SELF-BA-TL.PROJECTS.VIEW'
                }
            },
            {
                name: 'Own Project',
                url: '/self/ba-tl/own-projects',
                data: {
                    auth: 'SELF-BA-TL.OWN-PROJECTS.VIEW'
                }
            },
            {
                name: 'Completed Projects',
                url: '/self/ba-tl/closed-projects',
                data: {
                    auth: 'SELF-BA-TL.CLOSED-PROJECTS.VIEW'
                }
            },
            {
                name: 'Report',
                url: '/self/ba-tl/report-projects',
                data: {
                    auth: 'SELF-BA-TL.REPORT.VIEW'
                }
            }
        ]
    },
    {
        name: 'BA',
        url: '/self/ba',
        icon: 'fa fa-briefcase',
        data: {
            auth: 'SELF-BA.VIEW'
        },
        children: [
            {
                name: 'Projects',
                url: '/self/ba/projects',
                data: {
                    auth: 'SELF-BA.PROJECTS.VIEW'
                }
            },
            {
                name: 'Completed Projects',
                url: '/self/ba/closed-projects',
                data: {
                    auth: 'SELF-BA.CLOSED-PROJECTS.VIEW'
                }
            },
            {
                name: 'Report',
                url: '/self/ba/report-projects',
                data: {
                    auth: 'SELF-BA.REPORT.VIEW'
                }
            }
        ]
    }
    // ,
    // {
    //     name: 'Timing',
    //     url: '/self/timings',
    //     icon: 'icon-clock',
    //     data: {
    //         auth: 'SELF-TIMINGS.VIEW'
    //     }
    // }
];
