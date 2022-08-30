import { Injectable } from '@angular/core';
import { PermissionService } from './permission.service';
import { navItems } from '../../_nav';
import { navItemsSelf } from '../../_nav2';
import { Subject } from 'rxjs';
import { StorageManagerService } from './storage-manager.service';

@Injectable()

export class NavService {
  managerNav = navItems;
  selfNav = navItemsSelf;

  mainManagerNav: any = [];
  mainSelfNav: any = [];

  managerNavSubject: Subject<any> = new Subject;
  selfNavSubject: Subject<any> = new Subject;

  constructor(private perService: PermissionService) {
  }

  generateManagerNav = () => {
    for (let i = 0; i < this.managerNav.length; i++) {
      if (this.perService.hasPermission(this.managerNav[i].data.auth)) {
        if (this.managerNav[i].children && this.managerNav[i].children.length > 0) {
          for (let j = 0; j < this.managerNav[i].children.length; j++) {
            if (!this.perService.hasPermission(this.managerNav[i].children[j].data.auth)) {
              this.managerNav[i].children.splice(j, 1);
              j--;
            }
          }
        }
      } else {
        this.managerNav.splice(i, 1);
        i--;
      }
    }
  }

  generateSelfNav = () => {
    for (let i = 0; i < this.selfNav.length; i++) {
      if (this.perService.hasPermission(this.selfNav[i].data.auth)) {
        if (this.selfNav[i].children && this.selfNav[i].children.length > 0) {
          for (let j = 0; j < this.selfNav[i].children.length; j++) {
            if (!this.perService.hasPermission(this.selfNav[i].children[j].data.auth)) {
              this.selfNav[i].children.splice(j, 1);
              j--;
            }
          }
        }
      } else {
        this.selfNav.splice(i, 1);
        i--;
      }
    }
  }

  saveMainNav = () => {
    this.mainManagerNav = [];
    this.mainSelfNav = [];
    for (const nav of this.managerNav) {
      this.mainManagerNav.push(nav);
    }

    for (const nav of this.selfNav) {
      this.mainSelfNav.push(nav);
    }
    const allNav = { 'self': this.mainSelfNav, 'manager': this.mainManagerNav };
    StorageManagerService.storeNavs(allNav);
  }

  initializeNavs = () => {

    const navs = StorageManagerService.getNavs();

    if (navs) {
      if (navs['self'].length > 0) {
        this.mainSelfNav = navs['self'];
      }
      if (navs['manager'].length > 0) {
        this.mainManagerNav = navs['manager'];
      }
    }

    for (let i = 0; i < this.managerNav.length; i++) {
      this.managerNav.splice(i, 1);
      i--;
    }

    this.mainManagerNav.forEach((value) => {
      this.managerNav.push(value);
    });


    for (let i = 0; i < this.selfNav.length; i++) {
      this.selfNav.splice(i, 1);
      i--;
    }

    this.mainSelfNav.forEach((value) => {
      this.selfNav.push(value);
    });
  }
}
