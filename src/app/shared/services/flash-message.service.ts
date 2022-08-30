import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

@Injectable({
    providedIn: 'root'
})
export class FlashMessageService {

    constructor(private toasterService: ToasterService) {
    }

    private title = null;
    private message = null;
    private toastType = null;

    setData = (toastType, title, message) => {
        this.message = message;
        this.title = title;
        this.toastType = toastType;
    }

    showToast = () => {
        if (this.toastType === null) {
            return;
        }
        this.toasterService.pop(this.toastType, this.title, this.message);
        this.toastType = null;
        this.message = null;
        this.title = null;
    }

    pop = (type, title, message) =>{
        this.toasterService.pop(type, title, message);
    }
}
