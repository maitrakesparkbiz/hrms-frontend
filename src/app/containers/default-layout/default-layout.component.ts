import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy
} from '@angular/core';
import {navItems} from '../../_nav';
import {navItemsSelf} from '../../_nav2';
import {StorageManagerService} from '../../shared/services/storage-manager.service';
import {ApiService} from '../../shared/services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FlashMessageService} from '../../shared/services/flash-message.service';
import {DomSanitizer} from '@angular/platform-browser';
import {CompanyService} from '../../shared/services/company.service';
import {AppConstants} from '../../constants/app.constants';
import {TitleCasePipe} from '@angular/common';
import {UserService} from '../../shared/services/user.service';
import {DashboardService} from '../../shared/services/dashboard.service';
import {NavService} from '../../shared/services/nav.service';
import {PusherService} from '../../shared/services/pusher.sevice';
import {PermissionService} from '../../shared/services/permission.service';
import {ActivityBoxService} from '../../shared/services/activity-box.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss'],
    // styles: ['.dropdown-item{cursor: pointer}']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
    public navItems = navItems;
    public navItemsSelf = navItemsSelf;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;
    logopath;
    logo;
    headername;
    tabStatus = false;
    RouteTitle;
    profileImage: any = '';
    userRole = '';
    user: any = [];
    @ViewChild('customHeader') customHeader: ElementRef;

    constructor(private apiService: ApiService,
                private companyService: CompanyService,
                private dashboardService: DashboardService,
                private userService: UserService,
                private router: Router,
                private activateRoute: ActivatedRoute,
                private flashMessageService: FlashMessageService,
                public sanitizer: DomSanitizer,
                private titlecasePipe: TitleCasePipe,
                private navService: NavService,
                private pusherService: PusherService,
                private permissionService: PermissionService,
                private activityBoxService: ActivityBoxService) {

        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
        });

        this.changes.observe(<Element>this.element, {
            attributes: true
        });
    }

    ngOnInit() {
        this.navService.managerNavSubject.next({newData: 'test'});
        this.navService.generateManagerNav();
        this.navService.generateSelfNav();
        this.logo = '../../../assets/img/avatars/esb_logo.png';
        this.activateRoute.data.subscribe(res => {
            this.RouteTitle = res['title'];
        });

        if (this.RouteTitle === 'self') {
            this.tabStatus = true;
        }
        this.user = JSON.parse(StorageManagerService.getUser());

        if (this.user.profile) {
            this.profileImage = AppConstants.IMAGE_URL + this.user.profile;
        } else {
            this.profileImage = '../../../assets/img/avatars/profile_image.jpg';
        }

        this.userService.profile_subject.subscribe(
            (res) => {
                this.user = JSON.parse(StorageManagerService.getUser());
                if (res.profile) {
                    this.profileImage = AppConstants.IMAGE_URL + res.profile;
                } else {
                    this.profileImage = '../../../assets/img/avatars/profile_image.jpg';
                }
            }
        );

        const path = StorageManagerService.getLogoPath();
        if (path == null) {
            this.companyService.getLogoPaths().subscribe(
                (res) => {
                    this.logopath = res;
                    this.logo = AppConstants.IMAGE_URL + this.logopath;
                    StorageManagerService.storeLogoPath(this.logopath);
                }
            );
        } else {
            this.logopath = path;
            this.logo = AppConstants.IMAGE_URL + this.logopath;
        }

        this.companyService.company_subject.subscribe(
            (res) => {
                this.logopath = res.logo_path;
                this.logo = AppConstants.IMAGE_URL + this.logopath;
            }
        );


        if (this.permissionService.hasPermission('SELF-DASHBOARD.VIEW')) {
            this.dashboardService.getPendingCountSelf().subscribe(
                (res) => {
                    for (const nav of this.navItemsSelf) {
                        if (nav['name'] === 'News') {
                            if (res['is_news_read']) {
                                nav['icon'] = 'fa fa-circle custom-circle';
                            } else {
                                nav['icon'] = 'fa fa-bell';
                            }
                        }
                    }
                });
        }
        if (this.permissionService.hasPermission('DASHBOARD.VIEW')) {
            this.dashboardService.getPendingCount().subscribe(
                (res) => {
                    for (const nav of this.navItemsSelf) {
                        if (nav['name'] === 'News') {
                            // nav['icon'] = 'fa fa-bell';
                            if (res['is_news_read']) {
                                nav['icon'] = 'fa fa-circle custom-circle';
                            } else {
                                nav['icon'] = 'fa fa-bell';
                            }
                        }
                    }

                    for (const nav of this.navItems) {
                        if (nav['name'] === 'Leaves') {
                            if (+res['leaves'] > 0 || +res['today_leaves'] > 0) {
                                nav['icon'] = 'fa fa-circle';
                            }
                            if (+res['leaves'] > 0) {
                                // nav['icon'] = 'fa fa-circle';

                                nav['children'][1]['badge'] = {
                                    variant: 'danger custom-badge',
                                    text: res['leaves']
                                };
                            } else {
                                // nav['icon'] = 'icon-rocket';
                                if (nav['children'][1]['badge']) {
                                    delete nav['children'][1]['badge'];
                                }
                            }

                            if (+res['today_leaves'] > 0) {
                                // nav['icon'] = 'fa fa-circle';

                                nav['children'][0]['badge'] = {
                                    variant: 'danger custom-badge',
                                    text: res['today_leaves']
                                };
                            } else {
                                // nav['icon'] = 'icon-rocket';
                                if (nav['children'][0]['badge']) {
                                    delete nav['children'][0]['badge'];
                                }
                            }
                        }

                        if (nav['name'] === 'Expense') {
                            if (+res['claims'] > 0) {
                                nav['icon'] = 'fa fa-circle custom-circle';

                                nav['children'][1]['badge'] = {
                                    variant: 'danger custom-badge',
                                    text: res['claims']
                                };
                            } else {
                                nav['icon'] = 'icon-calculator';
                                if (nav['children'][1]['badge']) {
                                    delete nav['children'][1]['badge'];
                                }
                            }
                        }

                        if (nav['name'] === 'Jobs') {
                            if (+res['jobs'] > 0) {
                                nav['icon'] = 'fa fa-circle custom-circle';

                                nav['children'][1]['badge'] = {
                                    variant: 'danger custom-badge',
                                    text: res['jobs']
                                };
                            } else {
                                nav['icon'] = 'icon-people';
                                if (nav['children'][1]['badge']) {
                                    delete nav['children'][1]['badge'];
                                }
                            }
                        }
                    }
                }
            );
        }
        this.dashboardService.pendingClaims.subscribe(
            (res) => {
                for (const nav of this.navItems) {
                    if (nav['name'] === 'Expense') {
                        if (+res['count'] > 0) {
                            nav['icon'] = 'fa fa-circle custom-circle';

                            nav['children'][1]['badge'] = {
                                variant: 'danger custom-badge',
                                text: res['count']
                            };
                        } else {
                            nav['icon'] = 'icon-calculator';
                            if (nav['children'][1]['badge']) {
                                delete nav['children'][1]['badge'];
                            }
                        }
                    }
                }
            }
        );

        this.dashboardService.pendingLeaves.subscribe(
            (res) => {
                for (const nav of this.navItems) {
                    if (nav['name'] === 'Leaves') {
                        if (+res['count'] > 0) {
                            nav['icon'] = 'fa fa-circle';

                            nav['children'][1]['badge'] = {
                                variant: 'danger custom-badge',
                                text: res['count']
                            };
                        } else {
                            if (!nav['children'][0]['badge']) {
                                nav['icon'] = 'icon-rocket';
                            }
                            if (nav['children'][1]['badge']) {
                                delete nav['children'][1]['badge'];
                            }
                        }
                    }
                }
            }
        );


        this.dashboardService.unreadNews.subscribe(
            (res) => {
                for (const nav of this.navItemsSelf) {
                    if (nav['name'] === 'News') {
                        nav['icon'] = 'fa fa-bell';
                    }
                }
            }
        );

        this.dashboardService.pendingJobs.subscribe(
            (res) => {
                for (const nav of this.navItems) {
                    if (nav['name'] === 'Jobs') {
                        if (+res['count'] > 0) {
                            nav['icon'] = 'fa fa-circle custom-circle';

                            nav['children'][1]['badge'] = {
                                variant: 'danger custom-badge',
                                text: res['count']
                            };
                        } else {
                            nav['icon'] = 'icon-people';
                            if (nav['children'][1]['badge']) {
                                delete nav['children'][1]['badge'];
                            }
                        }
                    }
                }
            }
        );

        this.dashboardService.todayLeaves.subscribe(
            (res) => {
                for (const nav of this.navItems) {
                    if (nav['name'] === 'Leaves') {
                        if (+res['count'] > 0) {
                            nav['icon'] = 'fa fa-circle custom-circle';

                            nav['children'][0]['badge'] = {
                                variant: 'danger custom-badge',
                                text: res['count']
                            };
                        } else {
                            if (!nav['children'][1]['badge']) {
                                nav['icon'] = 'icon-people';
                            }
                            if (nav['children'][0]['badge']) {
                                delete nav['children'][0]['badge'];
                            }
                        }
                    }
                }
            }
        );
        this.projectUpdate();
    }

    ngOnDestroy() {
        // this.pusherService.projectUpdateChannel.unbind('App\\Events\\SendStatusUpdate');
    }

    projectUpdate = () => {
        // this.pusherService.projectUpdateChannel.bind('App\\Events\\SendStatusUpdate', data => {
        //     this.flashMessageService.pop('success', data.title, data.details);
        //     if (!('Notification' in window)) {
        //         alert('Web Notification is not supported');
        //         return;
        //     }
        //     Notification
        //         .requestPermission()
        //         .then(() => {
        //             const _notify = new Notification(data.title,
        //                 {body: data.details, icon: '../../../assets/img/avatars/notify_logo.png'}
        //             );
        //             this.activityBoxService.newNotification.next();
        //             setTimeout(() => {
        //                 _notify.close();
        //             }, 5000);
        //         });
        // });
    }

    getUserName = () => {
        return (this.user !== null && this.user.hasOwnProperty('firstname')) ? this.user.firstname : '';
    }

    onLogout = () => {
        this.apiService.logout().subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.navService.initializeNavs();
                this.pusherService.unSubscribe();
                StorageManagerService.clearAll();
                this.flashMessageService.setData('success', 'Logout', responseData.data.message);
                this.router.navigate(['/login'], {relativeTo: this.activateRoute});
            }
        });
    }

    onTabClick = (mode) => {
        if (mode === 'self') {
            this.tabStatus = true;
            this.router.navigate(['/self/dashboard']);
            // setTimeout(() => { this.router.navigate(['/self/dashboard']); }, 500)
        } else {
            this.tabStatus = false;
            this.router.navigate(['/dashboard']);
            // setTimeout(() => { this.router.navigate(['/dashboard']); }, 500)
        }
    }

    getHeaderName = () => {
        this.headername = this.router.url;
        if (this.headername === '/jobs/openings') {
            return 'Jobs';
        }

        if (this.headername === '/jobs/openings/create') {
            return 'Create Job';
        }
        if (this.headername.includes('/')) {
            if (this.headername.split('/').length === 2) {

                this.headername = this.headername.split('/')[1];
            }
            if (this.headername.split('/').length === 3) {

                this.headername = this.headername.split('/')[2];
            }
            if (this.headername.split('/').length === 4) {

                this.headername = this.headername.split('/')[2];

            }
            if (this.headername.split('/').length === 5) {

                this.headername = this.headername.split('/')[3];
            }
            if (this.headername.split('/').length === 6) {

                this.headername = this.headername.split('/')[4];
            }
        }
        if (this.headername.includes('-')) {
            this.headername = this.headername.replace('-', ' ');
        }
        // this.headername.charAt(0).toUpperCase();
        this.headername = this.titlecasePipe.transform(this.headername);
        return this.headername;
    }
    doLockApp = () => {
        StorageManagerService.lockApp();
        this.router.navigate(['/lock'], {relativeTo: this.activateRoute});
    }

    goToProfile = () => {
        this.router.navigate(['self', 'profile']);
    }
}
