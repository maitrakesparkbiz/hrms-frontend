import { OnInit, Component } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ExpenseService } from '../../../shared/services/expense.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { AppConstants } from '../../../constants/app.constants';

@Component({
    selector: 'app-dashboard-expense',
    templateUrl: 'dashboard-expense.component.html',
    styleUrls: ['./dashboard-expense.component.scss']
})

export class DashboardExpenseComponent implements OnInit {
    claims: any = [];
    userData: any = [];
    employee_image;
    modalRef: BsModalRef;
    actionId;
    pending_count;
    IMAGE_URL = AppConstants.IMAGE_URL;
    constructor(private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private expenseService: ExpenseService,
        private dashboardService: DashboardService) {
    }

    ngOnInit() {
        this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';
        this.userData = JSON.parse(StorageManagerService.getUser());
        this.getClaims();
    }

    getClaims = () => {
        this.dashboardService.getPendingClaims().subscribe(res => {
            this.claims = res;
        });
    }

    openModal = (id, template) => {
        this.actionId = id;
        this.modalRef = this.modalService.show(template);
    }

    closeModel = () => {
        this.modalRef.hide();
    }

    onApprove = () => {
        this.closeModel();
        this.expenseService.approveclaim(this.actionId, this.userData.id).subscribe(res => {
            if (res = 'Approve Claim succesfully') {
                this.updateClaimArray();
            }
        });
    }

    onReject = () => {
        this.closeModel();
        this.expenseService.rejectclaim(this.actionId, this.userData.id).subscribe(res => {
            if (res = 'Reject Claim succesfully') {
                this.updateClaimArray();
            }
        });
    }

    updateClaimArray = () => {
        Object.keys(this.claims).forEach(index => {
            if (this.claims[index]) {
                if (+this.claims[index][0]['id'] === +this.actionId) {
                    this.claims.splice(index, 1);
                }
            }
        });

        this.expenseService.getPendingClaimsCount().subscribe(
            (res) => {
                this.pending_count = res['count'];
                this.dashboardService.pendingClaims.next({ 'count': this.pending_count });
            }
        );
    }
}
