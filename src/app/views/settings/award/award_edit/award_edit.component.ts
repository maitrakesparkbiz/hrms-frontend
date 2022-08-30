import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { OptionService } from '../../../../shared/services/option.service';
import { AwardService } from '../../../../shared/services/award.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    templateUrl: 'award_edit.component.html',
    styleUrls: ['./award_edit.component.scss']

})
export class AwardEditComponent implements OnInit {

    awardForm: FormGroup;
    public dept;
    award;
    sub;
    id;
    allstatus;
    modalRef: BsModalRef;
    constructor(
        public router: Router, private modalService: BsModalService, private route: ActivatedRoute,
        public optionservice: OptionService, public awardservice: AwardService, public flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService
    ) {
    }


    ngOnInit() {
        // let addsub = new FormArray([]);

        this.awardForm = new FormGroup({
            'id': new FormControl(),
            'name': new FormControl(),
            'status': new FormControl(),
            'description': new FormControl(),

        });

        this.award = {};
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        if (this.id) {
            this.spinner.show();
            this.optionservice.getSelectOption(6).subscribe(response => {
                this.allstatus = response.data;
                this.awardservice.getAwardById(this.id).subscribe(res => {
                    this.award = res[0];
                    if (this.award.status) {
                        this.award.status = this.award.status.id;
                    }

                });
            });
            this.spinner.hide();
        } else {
            this.optionservice.getSelectOption(6).subscribe(response => {
                this.allstatus = response.data;
                this.award.status = 21;
            });
        }
    }
    SaveAward = () => {
        this.awardservice.saveAward(this.award).subscribe((responseData: any) => {
            if (this.award['id']) {
                if (responseData.response === 'success') {
                    this.flashMessageService.pop('success', 'Award updated Succesfully', 'updated Succesfully');
                    this.router.navigate(['/settings/award']);
                }
            } else {
                if (responseData.response === 'success') {
                    this.flashMessageService.pop('success', 'Award added Succesfully', 'add Succesfully');
                    this.router.navigate(['/settings/award']);
                }
            }
        });
    }


    cancel = () => {
        this.router.navigate(['/settings/award']);
    }

}



