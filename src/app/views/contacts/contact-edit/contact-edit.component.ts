import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { AppConstants } from '../../../constants/app.constants';
import { ContactService } from '../../../shared/services/contact.service';


@Component({
    selector: 'app-contact',
    templateUrl: './contact-edit.component.html',
    styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {
    modalRef: BsModalRef;
    AllLeaves;
    contactForm: FormGroup;
    search;
    contact: any = {};
    allcheck_id;
    reject_reason;
    leavedetail: any = {};
    leave_edit;
    contactedit;
    Leave_status;
    allcheck_id_count = 0;
    IMAGE_URL;
    sub;
    id;
    validFormSubmitted = false;
    employee_image;

    constructor(
        public router: Router,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute,
        private flashMessageService: FlashMessageService, private modalService: BsModalService,
        private contactservice: ContactService) {
    }

    ngOnInit() {
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
        this.contactForm = new FormGroup({
            'id': new FormControl(),
            'name': new FormControl(null, Validators.required),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'number': new FormControl(null, Validators.required),
            'service': new FormControl(null, Validators.required),
            'description': new FormControl(null)
        });
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        if (this.id) {
            this.spinner.show();
            this.contactservice.getContactByID(this.id).subscribe(response => {

                this.contactedit = response[0];
                this.contactForm.controls['id'].setValue(this.contactedit['id']);
                this.contactForm.controls['name'].setValue(this.contactedit['name']);
                this.contactForm.controls['email'].setValue(this.contactedit['email']);
                this.contactForm.controls['number'].setValue(this.contactedit['number']);
                this.contactForm.controls['service'].setValue(this.contactedit['service']);
                this.contactForm.controls['description'].setValue(this.contactedit['description']);
            });
            this.spinner.hide();
        }


    }
    SaveContact = () => {
        if (this.contactForm.valid) {
            this.validFormSubmitted = true;
            this.contact = this.contactForm.value;
            this.contactservice.saveContact(this.contact).subscribe(res => {
                if (res === 'Contact Add succesfully') {
                    this.router.navigate(['/contacts']);
                    this.flashMessageService.pop('success', 'Contact Add Succesfully', 'Add Succesfully');
                }
                if (res === 'Contact Update succesfully') {
                    this.router.navigate(['/contacts']);
                    this.flashMessageService.pop('success', 'Contact Updated Succesfully', 'Updated Succesfully');
                }
            });
        }
    }
    cancel = () => {
        this.router.navigate(['/contacts']);
    }

}
