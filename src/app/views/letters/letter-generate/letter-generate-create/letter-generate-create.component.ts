import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../../../../shared/services/user.service";
import { EmailGenerateService } from "../../../../shared/services/email-generate.service";
import { EmailTemplateComponent } from "../../../settings/email-template/email-template.component";
import { EmailTemplateService } from "../../../../shared/services/email-template.service";
import * as html2pdf from "html2pdf.js";
import { DomSanitizer } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { FlashMessageService } from "../../../../shared/services/flash-message.service";
@Component({
    templateUrl: './letter-generate-create.component.html',
    styleUrls: ['./letter-generate-create.component.scss']
})

export class LetterGenerateCreateComponent implements OnInit {
    letterForm: FormGroup;
    employee: any = [];
    letterTypes: any = [];
    allLetters: any = [];
    selectedLetter: any = [];
    edit_id = '';
    variables = '';
    finalLetter = '';
    employeeVariables: any = [];
    constructor(private _fb: FormBuilder,
        private userservice: UserService,
        private emailGenerateService: EmailGenerateService,
        private emailTemplateService: EmailTemplateService,
        private renderer: Renderer2,
        public sanitizer: DomSanitizer,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private msgService: FlashMessageService) {
    }

    ngOnInit() {
        this.letterForm = this._fb.group({
            'id': [''],
            'emp_id': [null, Validators.required],
            'email_template_id': [null, Validators.required],
            'top': [20, Validators.required],
            'bottom': [20, Validators.required],
            'left': [20, Validators.required],
            'right': [20, Validators.required],
            'description': ['', Validators.required]
        });

        this.activatedRoute.params.subscribe(
            (data) => {
                if (data.id) {
                    this.edit_id = data.id;
                }
            }
        )
        if (this.edit_id) {
            this.getGeneratedEmailById();
        }
        this.getAllEmployees();
        this.getAllLetterTypes();
    }

    getGeneratedEmailById = () => {
        // this.emailGenerateService.saveGeneratedEmail
    }

    getAllEmployees = () => {
        let users = this.userservice.all_users;
        if (users.length === 0) {
            this.getSetAllUsers();
        } else {
            this.generateUserOpt(users);
        }
    }

    getAllLetterTypes = () => {
        this.emailTemplateService.getAllTemplatesOption().subscribe(
            (res: any) => {
                if (res.data) {
                    this.allLetters = res.data;
                    let arr = [];
                    for (const data of res.data) {
                        arr.push({ label: data.template_name, value: data.id });
                    }
                    this.letterTypes = arr;
                }
                if (res.variables) {
                    this.variables = res.variables;
                }
            }
        )
    }

    saveLetter = () => {
        if (this.letterForm.valid) {
            const postData = this.letterForm.value;
            const spacing = postData['top'] + ' ' + postData['right'] + ' ' + postData['bottom'] + ' ' + postData['left'];
            postData['spacing'] = spacing;
            this.emailGenerateService.saveGeneratedEmail(postData).subscribe(
                (res) => {
                    if (res == 'created') {
                        this.msgService.pop('success', 'Letter Generated', 'Letter Generated Successfully');
                        this.onBack();
                    } else if (res == 'updated') {
                        this.msgService.pop('success', 'Letter Updated', 'Letter Updated Successfully');
                        this.onBack();
                    } else {
                        this.msgService.pop('error', 'Error Occurred', 'Error Occurred');
                    }
                }
            )
        }
    }

    onBack = () => {
        this.router.navigate(['/letters/generate']);
    }

    getSetAllUsers = async () => {
        let users = await this.userservice.getSetAllUsers().toPromise();
        this.generateUserOpt(users);
    }

    onSelectChange = () => {
        const letterType = this.letterForm.get('email_template_id').value;
        if (Object.keys(this.employeeVariables).length > 0 && letterType) {
            this.setUserLetter(letterType);
        }
    }

    onUserChange = async () => {
        const user_id = this.letterForm.get('emp_id').value;
        const letterType = this.letterForm.get('email_template_id').value;
        if (user_id) {
            this.employeeVariables = await this.userservice.getUserLetterData(user_id).toPromise();
            if (letterType) {
                this.setUserLetter(letterType);
            }
        }
    }

    setUserLetter = (letterType) => {
        for (const item of this.allLetters) {
            if (item.id === +letterType) {
                this.selectedLetter = item;
                this.finalLetter = item.content;
                this.letterForm.get('description').setValue(item.content);
            }
        }
        this.setVariablesToLetter();
    }

    setVariablesToLetter = () => {
        let tempLetter = this.letterForm.get('description').value;
        if (tempLetter) {
            Object.keys(this.employeeVariables).forEach(key => {
                tempLetter = tempLetter.replace(new RegExp(('##' + key + '##'), 'g'), this.employeeVariables[key]);
            });
        }
        this.finalLetter = tempLetter;
    }

    generateUserOpt = (users) => {
        const arr = [];
        for (const data of users) {
            arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
        }
        this.employee = arr;
    }

    onCssChange = () => {
        const top = this.letterForm.get('top').value;
        const bottom = this.letterForm.get('bottom').value;
        const left = this.letterForm.get('left').value;
        const right = this.letterForm.get('right').value;
        let printDivs: any = [];
        printDivs = document.getElementsByClassName('preview');
        for (let i = 0; i < printDivs.length; i++) {
            this.renderer.setStyle(printDivs[i], 'margin', (top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px'));
        }
    }

    onPrint = () => {
        window.print();
    }

    onDownload = () => {
        const element = document.getElementById('print-div');
        var opt = {
            margin: 1,
            filename: 'myfile.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf(element, opt);
    }
}
