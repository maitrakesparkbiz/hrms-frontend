import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {ToasterConfig} from 'angular2-toaster';


@Component({
    // tslint:disable-next-line
    selector: 'body',
    template: `
        <router-outlet><ngx-spinner
                type = "square-spin"></ngx-spinner></router-outlet>
        <toaster-container [toasterconfig]="toasterConfig"></toaster-container>`
})
export class AppComponent implements OnInit {
    public toasterConfig: ToasterConfig =
        new ToasterConfig({
            tapToDismiss: true,
            timeout: 5000
        });

    constructor(private router: Router,
               ) {
    }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });

    }
}

