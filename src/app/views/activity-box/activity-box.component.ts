import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivityBoxService } from '../../shared/services/activity-box.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';

@Component({
  selector: 'app-activity-box',
  templateUrl: './activity-box.component.html',
  styleUrls: ['./activity-box.component.scss']
})
export class ActivityBoxComponent implements OnInit {
  unreadCount = 0;
  allNotifications: any = [];
  constructor(private activityBoxService: ActivityBoxService,
    private msgService: FlashMessageService) { }

  ngOnInit() {
    this.getEmpNotifications();
    this.activityBoxService.newNotification.subscribe(
      () => {
        this.getEmpNotifications();
      }
    )
  }

  getEmpNotifications = () => {
    this.activityBoxService.getEmpNotifications().subscribe(
      (res) => {
        this.unreadCount = 0;
        if (res) {
          this.allNotifications = res;
          for (const row of this.allNotifications) {
            if (!row.is_read) {
              this.unreadCount++;
            }
          }
        }
      }
    )
  }

  onHide = () =>{
    if (this.unreadCount > 0) {
      this.activityBoxService.readAllNotificationsEmp().subscribe();
      this.unreadCount = 0;
      this.allNotifications.forEach(value => {
        value['is_read'] = true;
      });
    }
  }

  onDelete = (id) => {
    // console.log('in');
    // return false;
    this.activityBoxService.deleteNotification(id).subscribe();
    this.allNotifications.forEach((value, key) => {
      if (value['id'] === id) {
        this.allNotifications.splice(key, 1);
      }
    });
  }
}
