import { OnInit, Directive, Input, Renderer2, ElementRef } from '@angular/core';
import { ApiService } from '../shared/services/api.service';


@Directive({
  selector: '[appDisableButton]'
})

export class DisableButtonDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('appDisableButton') button: string; // Required permission passed in
  constructor(private apiService: ApiService, private el: ElementRef) {

  }

  ngOnInit() {
    this.apiService.directiveSubject.subscribe(
      () => {
        if (this.apiService.requestCount > 0) {
          this.el.nativeElement.disabled = true;
        } else {
          this.el.nativeElement.disabled = false;
        }
      }
    );
  }
}
