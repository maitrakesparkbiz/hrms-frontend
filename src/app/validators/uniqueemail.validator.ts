import { AbstractControl } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { Observable } from 'rxjs';

/**
 * @usage Confirm Password validator for form
 */

export class UniqueemailValidator {

    static checkHalfDay = (leaveCount: number) => {
        return (control: AbstractControl) => {
            return new Promise((resolve, reject) => {
                if (+leaveCount === 0.00) {

                }
            });
        };
    }

    static createValidator = (userService: UserService) => {
        return (control: AbstractControl) => {
            return userService.checkUniquefield(control.value).map(res => {
                return res ? res : null;
                // if(res) {
                //     return res;
                // }
                // else {
                //     return null;
                // }
            });
        };
    }

    static checkUpdateEmployeeId(userService: UserService, employeeid: number) {
        return (control: AbstractControl) => {
            return new Promise((resolve, reject) => {
                if (control.value !== undefined && control.value.length > 0) {
                    return userService.checkUniquefieldUpdate(control.value, employeeid)
                        .subscribe((res) => {
                            if (res.length > 0) {
                                control.setErrors({ dup_id: true });
                                resolve(res);
                            } else {
                                control.setErrors(null);
                            }
                        },
                            //     () => {
                            //         control.setErrors(null);
                            //         resolve(null);
                            // }
                        );
                } else {
                    resolve(null);
                }
            });
        };
    }
}
