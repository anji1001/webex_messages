import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  template: `<div class="container h-75 d-flex">
  <div class="mx-auto align-self-center row border rounded p-5 w-50 h-50 text-center align-items-end ">
  <h2>Webex Messages</h2><button class="btn app-btn rounded-4 w-auto ms-auto me-auto" (click)="login()">Sign in with Cisco Webex</button></div></div>`,
  styles: [`.app-btn {
    background-color: rgb(0,94,126);
    color: #fff;
}`]
})
export class LoginComponent implements OnInit {
  constructor(private appService: AppService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // When on login page, logout function will get called so as to avoid unauthorized access on browser navigation buttons
    this.route.url.subscribe(res => this.appService.logout().subscribe((res: any) => {
      if (res.ok) {
        this.appService.setAccessToken('');
      }
    }));
  }

  // Redirect the application to Webex login page
  login() {
    window.location.href = 'https://webexapis.com/v1/authorize?client_id=Cfefdcc2e5e88b79319b054d7acd9ea913b1ca056434fd100f70d2e3fe344718b&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fcallback&scope=spark%3Aall%20spark%3Akms&state=set_state_here';
  }
}
