import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { AppService } from '../app.service';
import { Messages } from './messages.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messagesList?: Messages[] = [];
  message: string = '';
  ownDetails: any = null;
  isLoading = false;
  showModal = false;
  currentMessageDetails: Messages;

  //to scroll to the bottom of the page
  @ViewChild('contentScroll') private contentScroll: any;

  constructor(private appService: AppService, private route: ActivatedRoute, private router: Router) { }

  // Check if access_token already exists. If not exist check if it exist on server. If not redirect to login page otherwise show list of messages
  ngOnInit() {
    this.route.url.subscribe(param => {
      if (!this.appService.getAccessToken()) {
        this.appService.getAuthToken().subscribe((res: any) => {
          this.appService.setAccessToken(res.token.split(' ')[1]);
          this.getMessages();
        }, err => {
          this.router.navigateByUrl('/login');
        });
      } else this.getMessages();
    });
  }

  getMessages() {
    this.isLoading = true;
    forkJoin({
      ownDetails: this.appService.getOwnDetails().pipe(map((res) => res), catchError(e => of(e))),
        messagesList: this.appService.getAllMessages().pipe(map((res) => res), catchError(e => of(e)))
    }).subscribe(({ ownDetails, messagesList }) => {
      this.isLoading = false;
      this.ownDetails = ownDetails;
      let messages = messagesList as any;
      this.messagesList = messages?.items?.reverse() || [] ;
      this.scrollToBottom();
    });
  }

  //Scroll to the bottom of page
  scrollToBottom() {
    setTimeout(() => {
      this.contentScroll.nativeElement.scrollTop = this.contentScroll.nativeElement.scrollHeight;
    }, 0);
  }

  //Send message in room
  sendMessage() {
    if (!this.message) {
      return;
    }
    this.appService.createMessage(this.message).subscribe((res: any) => {
      this.appService.getAllMessages().subscribe((messagesList: any) => {
        this.messagesList = messagesList?.items?.reverse() || []
        this.scrollToBottom();
      });
    },err => console.error(err));
    this.message = '';

  }

  //Delete a message with message id
  deleteMessage(id: string) {
    this.appService.deleteMessage(id).subscribe(res => {
      if (this.messagesList) {
        const index = this.messagesList.findIndex((el: any) => el.id === id);
        this.messagesList.splice(index, 1);
        this.scrollToBottom();
      }
    }, err => { console.error(err) });
  }

  //Get the message details using message id
  getMessageDetails(id: string) {
    this.appService.getMessageDetails(id).subscribe(res => {
      this.showModal = true;
      this.currentMessageDetails = res;
    }, err => { console.error(err) });
  }

  //Close the modal
  closeModal() {
    this.showModal = false;
  }

  //Logout from application
  logout() {
    this.router.navigateByUrl('/login');
  }

}
