import { OnInit, Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { TeamService } from '../../../shared/services/team.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { ConfirmPasswordValidation } from '../../../validators/confirm-password.validator';
import { FlashMessageService } from '../../../shared/services/flash-message.service';

@Component({
    selector: 'app-add-team',
    templateUrl: 'add-team.component.html',
    styleUrls: ['./add-team.component.scss']
})

export class AddTeamComponent implements OnInit {
    teamForm: FormGroup;
    employee: any = [];
    members: any = [];
    selectedLeader;
    selectedMembers: any = [];
    edit_id;
    @ViewChild('teamMembers') teamMembers;
    constructor(public router: Router,
        public userservice: UserService,
        public _fb: FormBuilder,
        public teamService: TeamService,
        private route: ActivatedRoute,
        private renderer2: Renderer2,
        private msgService: FlashMessageService
    ) { }

    ngOnInit() {
        this.renderer2.addClass(this.teamMembers['element']['children'][0], 'custom-team-dropdown');
        const array = [];
        this.teamForm = this._fb.group({
            'id': [],
            'leader': [null, Validators.required],
            'member': [null]
        }, {
                validator: ConfirmPasswordValidation.verifyLeader
            });
        this.route.params.subscribe((res) => {
            this.edit_id = +res['id'];
        });

        let users = this.userservice.all_users;
        if (users.length === 0) {
            this.getSetAllUsers();
        } else {
            this.generateUserOpt(users);
        }

        // let users = StorageManagerService.getAllUsers();
        // if (!users) {
        //     this.userservice.getAllUsers().subscribe(
        //         (res) => {
        //             users = res.data;
        //             StorageManagerService.storeAllUsers(users);
        //             this.generateUserOpt(users);
        //         }
        //     );
        // } else {
        //     this.generateUserOpt(users);
        // }
        if (this.edit_id) {
            this.teamService.getTeamById(this.edit_id).subscribe(
                (res) => {
                    const data = res;
                    this.teamForm.get('id').setValue(data.id);
                    this.selectedLeader = data.leader.id;
                    const arr = [];
                    for (const member of data.team_employee) {
                        arr.push({
                            label: member['member']['firstname'] + ' ' + member['member']['lastname'],
                            value: member['member']['id']
                        });
                    }
                    this.selectedMembers = arr;
                }
            );
        }
    }

    getSetAllUsers = async () => {
        let users = await this.userservice.getSetAllUsers().toPromise();
        this.generateUserOpt(users);
    }

    generateUserOpt = (users) => {
        const arr = [];
        for (const data of users) {
            arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
        }
        this.employee = arr;
    }

    cancel = () => {
        this.router.navigate(['/teams']);
    }

    addTeam = () => {
        if (this.teamForm.valid) {
            this.teamService.addTeam(this.teamForm.value).subscribe(
                (res) => {
                    if (res === 'updated') {
                        this.msgService.pop('success', 'Team Updated', 'Team Updated successfully');
                    } else if (res === 'created') {
                        this.msgService.pop('success', 'Team Created', 'Team created successfully');
                    } else {
                        this.msgService.pop('error', 'Error', 'Error occured');
                    }
                    this.cancel();
                }
            );
        }
    }
}
