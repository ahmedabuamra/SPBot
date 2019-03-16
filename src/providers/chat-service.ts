import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Backend } from './backend';
import { watch } from 'fs';
import { Dialogflow } from './dialogflow';

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}

@Injectable()
export class ChatService {

  constructor(private http: HttpClient,
    private events: Events,
    private backend: Backend,
    private dialogflow: Dialogflow) {
  }

  botRespond_youtube(msg: ChatMessage) {
    this.backend.fetchYoutubeVideos(msg.message).then(() => {
      let video = this.backend.getLastRecommendedVideo();
      console.log(video);
      let botmsg = "";
      if (video) {
        botmsg = '<p class="line-breaker"> I recommend this video : <a href="https://www.youtube.com/watch?v=' + video["id"]["videoID"] + '">' + video["snippet"]["title"] + '</a>, It will help you understand this topic more</p>'
      } else {
        botmsg = '<p class="line-breaker"> An error ocured 😔 try again </p>'
      }
      this.botSendMsg(botmsg);
    }).catch(() => {
      let botmsg = '<p class="line-breaker"> An error ocured 😔 try again </p>';
      this.botSendMsg(botmsg);
    });
  }


  botRespond_math(msg: ChatMessage) {
    let wait = '<p class="line-breaker"> Please wait, I will solve it now! </p>';
    this.botSendMsg(wait);

    this.backend.solveMathEquation(msg.message).then(() => {
      let botmsg = this.backend.getLastSolvedEquationImgHTMLTag();
      console.log(botmsg);
      if (!botmsg) {
        botmsg = '<p class="line-breaker"> An error ocured 😔 check your equation and try again </p>'
      }
      this.botSendMsg(botmsg);
    }).catch(() => {
      let botmsg = '<p class="line-breaker"> An error ocured 😔 check your equation and try again </p>';
      this.botSendMsg(botmsg);
    });
  }

  botSendMsg(botmsg: string) {
    const bot_response: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Study Partner',
      userAvatar: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: botmsg, //replace this with message
      status: 'success'
    };
    this.events.publish('chat:received', bot_response, Date.now())
  }

  sendMsg(msg: ChatMessage) {
    console.log(msg);
    return new Promise(resolve => resolve(msg))
      .then(() => {

        //sends data to dialogFlow to get context
        this.dialogflow.sendText(msg.message).then(() => { }).catch(() => { });

        // this.botRespond_math(msg)
        // this.botRespond_youtube(msg);
      });
  }


  // https://www.googleapis.com/youtube/v3/search

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: '140000198202211138',
      name: 'You',
      avatar: './assets/user.jpg'
    };
    return new Promise(resolve => resolve(userInfo));
  }
}
