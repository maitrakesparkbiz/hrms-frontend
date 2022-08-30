import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionService } from '../shared/services/permission.service';
@Directive({
    selector: '[appCheckPermission]'
})
export class CheckUnauthorizedDirective implements OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('appCheckPermission') permission: string; // Required permission passed in
    constructor(private el: ElementRef, private permissionService: PermissionService) { }
    ngOnInit() {
        if (!this.permissionService.hasPermission(this.permission)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}
