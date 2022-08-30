import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

/**
 * @usage Confirm Password validator for form
 */

export class ConfirmPasswordValidation {

    static MatchPassword = (AC: AbstractControl) => {
        const password = AC.get('new_password').value; // to get value in input tag
        const confirmPassword = AC.get('confirm_new_password').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('confirm_new_password').setErrors({ MatchPassword: true });
        } else {
            return null;
        }
    }

    static CheckAlloweLogin = (AC: AbstractControl) => {
        const password = AC.get('password').value; // to get value in input tag
        const allowed_login = AC.get('allowed_login').value; // to get value in input tag
        if (allowed_login) {
            if (!password) {
                AC.get('password').setErrors({ CheckAlloweLogin: true });
            }
        } else {
            AC.get('password').setErrors(null);
        }
    }

    static checkRoleStatus = (AC: AbstractControl) => {
        const role = AC.get('role').value; // to get value in input tag
        const is_manager = AC.get('is_manager').value; // to get value in input tag
        if (is_manager) {
            if (role) {

            } else {
                AC.get('role').setErrors({ checkRoleStatus: true });
            }
        }
    }

    static checkDates = (AC: AbstractControl) => {
        const last_date = AC.get('last_date').value; // get value of last date in jobs
        const posted_date = AC.get('posted_date').value; // get value of posted date in jobs
        const d1 = new Date(last_date);
        const d2 = new Date(posted_date);
        if (d1 < d2) {
            AC.get('last_date').setErrors({ checkDates: true });
        } else {

        }
    }

    static verifyCheckIn = (AC: AbstractControl) => {
        let check_in = AC.get('check_in_time').value;
        let check_out = AC.get('check_out_time').value;
        if (check_in) {
            check_in = moment(check_in).set({ second: 0, millisecond: 0 }).format('X');
        }

        if (check_out) {
            check_out = moment(check_out).set({ second: 0, millisecond: 0 }).format('X');
        }

        if (check_out) {
            if (!check_in) {
                AC.get('check_in_time').setErrors({ check_in_err: true });
            }
        }

        if (check_in && check_out) {
            if (check_out < check_in) {
                AC.get('check_out_time').setErrors({ check_out_err: true });
            }
        }
    }

    static verifyLeader(AC: AbstractControl) {
        const leader_id = AC.get('leader').value;
        const member_id = AC.get('member').value;
        let err = true;
        if (leader_id !== undefined && member_id) {
            for (const member of member_id) {
                if (leader_id === member.value) {
                    err = false;
                    AC.get('member').setErrors({ repeat: true });
                }
            }
            if (err) {
                AC.get('member').setErrors(null);
            }
        }
    }

    static checkResume = (AC: AbstractControl) => {
        const resume = AC.get('resume').value;
        const allowed = ['jpg', 'jpeg', 'png', 'docx', 'pdf'];
        if (resume) {
            const ext = resume.substr((resume.lastIndexOf('.') + 1), resume.length);
            if (allowed.indexOf(ext.toLowerCase()) < 0) {
                AC.get('resume').setErrors({ invalid_file: true });
            } else {
                AC.setErrors(null);
            }
        }
    }

    static checkLeaveDate = (AC: AbstractControl) => {
        const value = AC.get('leave_date').value;
        const isValid = moment(value).isSameOrAfter(moment(), 'date');
        if (value) {
            if (!isValid) {
                AC.get('leave_date').setErrors({ invalid_date: true });
            } else {
                AC.get('leave_date').setErrors(null);
            }
        }
    }
}
