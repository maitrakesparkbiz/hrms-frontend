import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { PermissionService } from '../../../../shared/services/permission.service';
import { RoleService } from '../../../../shared/services/role.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
@Component({
    templateUrl: 'role_edit.component.html',
    styleUrls: ['./role_edit.component.scss']


})
export class RoleEditComponent implements OnInit {
    roleEditForm: FormGroup;
    public btnstatus = false;
    allcheck_id;
    id;
    sub;
    roledata;
    used_role;
    role;
    allcheck_id_count = 0;
    dept_edit;
    @ViewChild('primaryModel') public primaryModel: ModalDirective;
    department: any = {};
    data: any = [];
    permissions: any = [];
    public dept;
    permissionIdsArray: any[] = [];
    alreadyGivenPermissionArray: any[] = [];
    isEditMode: boolean;
    selfPermissions: any = [];
    managerPermissions: any = [];
    managerCheckAll = false;
    selfCheckAll = false;
    constructor(
        public router: Router,
        private route: ActivatedRoute,
        public permissionservice: PermissionService,
        public roleservice: RoleService,
        public flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService,
        private _fb: FormBuilder
    ) {
    }

    ngOnInit() {
        // this.roleEditForm = new FormGroup({
        //     'id': new FormControl(),
        //     'name': new FormControl(),
        //     'description': new FormControl(),
        //     'manager-all': new FormControl(),
        //     'self-all': new FormControl(),
        //     'manager-permissions': new FormArray([]),
        //     'self-permissions': new FormArray([])
        // });

        this.roleEditForm = this._fb.group({
            'id': [],
            'name': [],
            'description': [],
            'manager-all': [null],
            'self-all': [null],
            'manager-permissions': this._fb.array([]),
            'self-permissions': this._fb.array([])
        });

        this.role = {};
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        if (this.id) {
            this.spinner.show();
            this.roleservice.getRole_permission(this.id).subscribe(response => {
                this.role = response[0];
                this.getSetPermissions();
                this.spinner.hide();
            });
        } else {
            this.getSetPermissions();
        }
    }

    initX = (title) => {
        return this._fb.group({
            'title': [title],
            'status': [],
            'main_permission': this._fb.array([]),
            'sub_tab': this._fb.array([])
        });
    }

    initY = (title) => {
        return this._fb.group({
            'title': [title],
            'status': [],
            'main_permission': this._fb.array([])
        });
    }

    initialControls = (data: any = null) => {
        if (data) {
            return this._fb.group({
                'id': [data.id],
                'title': [data.title],
                'status': []
            });
        }
    }

    getSetPermissions = () => {
        this.permissionservice.getAllPermission().subscribe((res: any) => {
            this.permissions = res.data;
            for (const per of this.permissions) {
                if (!per.title.includes('Self')) {
                    this.managerPermissions.push(per);
                } else {
                    this.selfPermissions.push(per);
                }
            }
            this.generateSelfPermissions();
            this.generateManagerPermissions();

            if (this.id) {
                this.managerPermissions.forEach(value => {
                    this.role['permissions'].forEach(perValue => {
                        value['per'].forEach(mainPer => {
                            if (mainPer['id'] === perValue.id) {
                                mainPer['status'] = true;
                                return;
                            }
                        });
                        if (value['tabs']) {
                            value['tabs'].forEach(row2 => {
                                row2['per'].forEach(row3 => {
                                    if (+row3['id'] === +perValue.id) {
                                        row3['status'] = true;
                                        return;
                                    }
                                });
                            });
                        }
                    });
                });
                this.updateCheckBox(true);
                this.selfPermissions.forEach(value => {
                    this.role['permissions'].forEach(perValue => {
                        value['per'].forEach(mainPer => {
                            if (mainPer['id'] === perValue.id) {
                                mainPer['status'] = true;
                                return;
                            }
                        });
                        if (value['tabs']) {
                            value['tabs'].forEach(row2 => {
                                row2['per'].forEach(row3 => {
                                    if (+row3['id'] === +perValue.id) {
                                        row3['status'] = true;
                                        return;
                                    }
                                });
                            });
                        }
                    });
                });
                this.updateCheckBox(false);
                // this.managerCheck();
                // this.selfCheck();
            }
        });
    }

    generateSelfPermissions = () => {
        const selfControl = <FormArray>this.roleEditForm.controls['self-permissions'];
        let i = 0;
        this.selfPermissions.forEach(row => {
            selfControl.push(this.initX(row.title));
            const mainPemissionControl =
                <FormArray>this.roleEditForm.controls['self-permissions']['controls'][i].controls['main_permission'];
            row.per.forEach(mainPer => {
                mainPemissionControl.push(this.initialControls(mainPer));
            });
            if (row.tabs) {
                const subPemissionControl =
                    <FormArray>this.roleEditForm.controls['self-permissions']['controls'][i].controls['sub_tab'];
                let j = 0;
                for (const subTab of row.tabs) {
                    subPemissionControl.push(this.initY(subTab.title));
                    const tabPermissoinControl =
                        <FormArray>this.roleEditForm.controls['self-permissions']['controls'][i].
                            controls['sub_tab']['controls'][j].controls['main_permission'];
                    for (const subPer of subTab.per) {
                        tabPermissoinControl.push(this.initialControls(subPer));
                    }
                    j++;
                }
            }
            i++;
        });
    }

    generateManagerPermissions = () => {
        const selfControl = <FormArray>this.roleEditForm.controls['manager-permissions'];
        let i = 0;
        this.managerPermissions.forEach(row => {
            selfControl.push(this.initX(row.title));
            const mainPemissionControl =
                <FormArray>this.roleEditForm.controls['manager-permissions']['controls'][i].controls['main_permission'];
            row.per.forEach(mainPer => {
                mainPemissionControl.push(this.initialControls(mainPer));
            });
            if (row.tabs) {
                const subPemissionControl =
                    <FormArray>this.roleEditForm.controls['manager-permissions']['controls'][i].controls['sub_tab'];
                let j = 0;
                for (const subTab of row.tabs) {
                    subPemissionControl.push(this.initY(subTab.title));
                    const tabPermissoinControl =
                        <FormArray>this.roleEditForm.controls['manager-permissions']['controls'][i].
                            controls['sub_tab']['controls'][j].controls['main_permission'];
                    for (const subPer of subTab.per) {
                        tabPermissoinControl.push(this.initialControls(subPer));
                    }
                    j++;
                }
            }
            i++;
        });
    }

    SaveRole = () => {
        const perArr: any = [];

        this.managerPermissions.forEach(value => {
            value['per'].forEach(value2 => {
                perArr.push(value2);
            });
            if (value['tabs']) {
                value['tabs'].forEach(value3 => {
                    value3['per'].forEach(value4 => {
                        perArr.push(value4);
                    });
                });
            }
        });

        this.selfPermissions.forEach(value => {
            value['per'].forEach(value2 => {
                perArr.push(value2);
            });
            if (value['tabs']) {
                value['tabs'].forEach(value3 => {
                    value3['per'].forEach(value4 => {
                        perArr.push(value4);
                    });
                });
            }
        });

        const formData = {};
        formData['id'] = this.id;
        formData['name'] = this.roleEditForm.get('name').value;
        formData['description'] = this.roleEditForm.get('description').value;
        formData['permissions'] = perArr;
        this.roleservice.saveRole(formData).subscribe((res: any) => {
            if (res.response === 'success') {
                if (res.data === 'Updated SuccessFully') {
                    this.router.navigate(['/settings/role']);
                    this.flashMessageService.pop('success', 'Role Updated Succesfully', 'Update Succesfully');
                } else {
                    this.router.navigate(['/settings/role']);
                    this.flashMessageService.pop('success', 'Role Added Succesfully', 'Add Succesfully');
                }
            }
            let roles = [];
            this.roleservice.getRolewithoutEmployee().subscribe(
                (resp: any) => {
                    roles = resp.data;
                    StorageManagerService.storeRoles(roles);
                }
            );
        });
    }

    cancel = () => {
        this.router.navigate(['/settings/role']);
    }

    managerCheckMain = (e, index, mode) => {
        const checkBoxVal = e.target.checked;
        let tempArr: any = [];
        if (mode) {
            tempArr = this.managerPermissions;
        } else {
            tempArr = this.selfPermissions;
        }
        tempArr.forEach((value, key) => {
            if (+key === +index) {
                value['per'].forEach(row => {
                    row['status'] = checkBoxVal;
                });
                if (value['tabs']) {
                    value['tabs'].forEach(row2 => {
                        row2['status'] = checkBoxVal;
                        row2['per'].forEach(row3 => {
                            row3['status'] = checkBoxVal;
                        });
                    });
                }
                this.checkManagerAllPermissions(mode);
                return false;
            }
        });
    }

    checkMainTabPermissions = (index, mode) => {
        let flag = true;
        let tempArr: any = [];
        if (mode) {
            tempArr = this.managerPermissions;
        } else {
            tempArr = this.selfPermissions;
        }
        tempArr.forEach((value, key) => {
            if (+key === +index) {
                value['per'].forEach(row => {
                    if (!row['status']) {
                        flag = false;
                    }
                });
                if (value['tabs']) {
                    value['tabs'].forEach(row2 => {
                        if (!row2['status']) {
                            flag = false;
                        }
                    });
                }
                if (flag) {
                    value['status'] = true;
                } else {
                    value['status'] = false;
                }
                this.checkManagerAllPermissions(mode);
                return false;
            }
        });
    }

    checkSubTabPermissions = (mainIndex, subIndex, mode) => {
        let flag = true;
        let tempArr: any = [];
        if (mode) {
            tempArr = this.managerPermissions;
        } else {
            tempArr = this.selfPermissions;
        }
        tempArr.forEach((value, key) => {
            if (+key === +mainIndex) {
                value['per'].forEach(row => {
                    if (!row['status']) {
                        flag = false;
                    }
                });
                if (value['tabs']) {
                    value['tabs'].forEach((value2, key2) => {
                        if (+key2 === subIndex) {
                            let subTabFlag = true;
                            value2['per'].forEach(row3 => {
                                if (!row3['status']) {
                                    subTabFlag = false;
                                }
                            });
                            if (subTabFlag) {
                                value2['status'] = true;
                            } else {
                                value2['status'] = false;
                            }
                        }
                        if (!value2['status']) {
                            flag = false;
                        }
                    });
                }
                if (flag) {
                    value['status'] = true;
                } else {
                    value['status'] = false;
                }
                this.checkManagerAllPermissions(mode);
                return false;
            }
        });
    }

    managerSubTab = (e, mainIndex, subIndex, mode) => {
        const checkBoxVal = e.target.checked;
        let flag = true;
        let tempArr: any = [];
        if (mode) {
            tempArr = this.managerPermissions;
        } else {
            tempArr = this.selfPermissions;
        }
        tempArr.forEach((value, key) => {
            if (+key === +mainIndex) {
                value['per'].forEach(row => {
                    if (!row['status']) {
                        flag = false;
                    }
                });
                if (value['tabs']) {
                    value['tabs'].forEach((value2, key2) => {
                        if (+key2 === +subIndex) {
                            value2['status'] = checkBoxVal;
                            value2['per'].forEach(row3 => {
                                row3['status'] = checkBoxVal;
                            });
                        }
                        if (!value2['status']) {
                            flag = false;
                        }
                    });
                    if (flag) {
                        value['status'] = true;
                    } else {
                        value['status'] = false;
                    }
                }
                this.checkManagerAllPermissions(mode);
                return false;
            }
        });
    }

    managerAll = (e, mode) => {
        const checkBoxVal = e.target.checked;
        let tempArr: any = [];
        if (mode) {
            tempArr = this.managerPermissions;
        } else {
            tempArr = this.selfPermissions;
        }
        tempArr.forEach(value => {
            value['status'] = checkBoxVal;
            value['per'].forEach(row => {
                row['status'] = checkBoxVal;
            });
            if (value['tabs']) {
                value['tabs'].forEach(row2 => {
                    row2['status'] = checkBoxVal;
                    row2['per'].forEach(row3 => {
                        row3['status'] = checkBoxVal;
                    });
                });
            }
        });
    }

    checkManagerAllPermissions = (mode) => {
        let flag = true;
        let tempArr: any = [];
        if (mode) {
            tempArr = this.managerPermissions;
        } else {
            tempArr = this.selfPermissions;
        }
        tempArr.forEach(value => {
            if (!value['status']) {
                flag = false;
            }
        });

        if (flag) {
            if (mode) {
                this.managerCheckAll = true;
            } else {
                this.selfCheckAll = true;
            }
        } else {
            if (mode) {
                this.managerCheckAll = false;
            } else {
                this.selfCheckAll = false;
            }
        }
    }


    updateCheckBox = (mode = false) => {
        let tempArr: any = [];
        if (mode) {
            tempArr = this.managerPermissions;
        } else {
            tempArr = this.selfPermissions;
        }
        let mainFlag = true;
        tempArr.forEach(value => {
            let flag = true;
            value['per'].forEach(row => {
                if (!row['status']) {
                    flag = false;
                }
            });

            if (value['tabs']) {
                value['tabs'].forEach(value2 => {
                    let subFlag = true;
                    value2['per'].forEach(value3 => {
                        if (!value3['status']) {
                            subFlag = false;
                            flag = false;
                        }
                    });
                    if (subFlag) {
                        value2['status'] = true;
                    }
                });
            }
            if (flag) {
                value['status'] = true;
            } else {
                mainFlag = false;
            }
        });

        if (mainFlag) {
            if (mode) {
                this.managerCheckAll = true;
            } else {
                this.selfCheckAll = true;
            }
        } else {
            if (mode) {
                this.managerCheckAll = false;
            } else {
                this.selfCheckAll = false;
            }
        }
    }

}



