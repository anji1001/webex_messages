import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable()
export class CanActivateService implements CanActivate {
  constructor(private appService: AppService, private router: Router) { }

  //Fetch the access token and redirect to messages route
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (route.fragment?.includes('=')) {
        const token = route.fragment.split('=');
        if (token.length > 1) {
          this.appService.setAccessToken(token[1].split('&')[0]);
          resolve(false);
          this.router.navigateByUrl('messages')
        } else {
          resolve(true);
        }
      }
    });
  }
}
