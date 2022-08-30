import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageManagerService } from './storage-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { _sanitizeHtml } from '@angular/core/src/sanitization/html_sanitizer';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiInterceptorService implements HttpInterceptor {
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService) {

  }

  intercept = (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
    this.apiService.requestSubject.next(true);
    const request =
      (req.url === 'http://www.geoplugin.net/json.gp') ? req.clone({ setHeaders: {} }) :
        req.clone(
          {
            setHeaders: {
              Authorization: `Bearer ${StorageManagerService.getToken()}`
            }
          }
        );

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.apiService.requestSubject.next(false);
        }
      },
        error => {
          this.apiService.requestSubject.next(false);
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              StorageManagerService.clearAll();
              this.router.navigate(['/login'], { relativeTo: this.activatedRoute });
            }
          }
        }
      )
    )
  }
}
