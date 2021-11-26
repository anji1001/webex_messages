import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallBackComponent } from './callback.component';
import { CanActivateService } from './can-activate.service';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'messages', component: MessagesComponent },
  // CanActivate will fetch access_token after redirecting to callback 
  { path: 'callback', component: CallBackComponent, canActivate: [CanActivateService]},
  { path: '', pathMatch: 'full', redirectTo: 'login' },  
  {path: '**', redirectTo: 'callback'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
