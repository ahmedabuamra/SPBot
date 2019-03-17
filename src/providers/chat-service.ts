import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Backend } from './backend';
import { watch } from 'fs';
import { Dialogflow } from './dialogflow';
import { DomSanitizer } from '@angular/platform-browser';

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
    private _sanitizer: DomSanitizer,
    private backend: Backend,
    private dialogflow: Dialogflow) {
  }

  botRespond_youtube(msg: string) {
    this.backend.fetchYoutubeVideos(msg).then(() => {
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
      this.botCatchError();
    });
  }


  botResponnd_visualizeCircle() {
    let botmsg = '<p> Circle Visualization: </p>'
    this.botSendMsg(botmsg);
  }

  botRespond_math(msg: string) {
    let wait = '<p class="line-breaker"> Seems good question 🤔 ! I will solve it for you 😉 </p>';
    this.botSendMsg(wait);

    this.backend.solveMathEquation(msg).then(() => {
      let botmsg = this.backend.getLastSolvedEquationImgHTMLTag();
      console.log(botmsg);
      if (!botmsg) {
        botmsg = '<p class="line-breaker"> An error ocured 😔 check your equation and try again </p>'
      }
      this.botSendMsg(botmsg);
    }).catch(() => {
      this.botCatchError();
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
    console.log(bot_response);
    this.events.publish('chat:received', bot_response, Date.now())
  }

  chatStart(){
    let botmsg = '<p class="line-breaker"> Hi! I am Solu, How can I help you today 🙏 ?  </p>';
    this.botSendMsg(botmsg);

  }

  sendMsg(msg: ChatMessage) {
    console.log(msg);
    return new Promise(resolve => resolve(msg))
      .then(() => {
        console.log(this.isEquation(msg.message));

        if (msg.message.indexOf('visualize') != -1 && msg.message.indexOf('circle') != -1) {
          this.botResponnd_visualizeCircle();
        } else if (this.isEquation(msg.message)) {
          this.botRespond_math(msg.message)
        } else {
          //sends data to dialogFlow to get context
          this.dialogflow.sendText(msg.message).then(() => {
            if (this.dialogflow.func == "Explain") {
              if (this.dialogflow.topic && this.dialogflow.topic.length) {
                this.botRespond_youtube(this.dialogflow.topic + " Lesson Tutorial");
              }
            } else if (this.dialogflow.func == "Solve") {
              this.botSendMsg("Text me with the equation on a separate message like that 👇");
              this.botSendMsg("x^2 + 3x = 100");
            } else {
              this.botSendMsg(this.dialogflow.speech);
            }
          }).catch(() => {
            this.botCatchError();
          });

        }
      });
  }

  botCatchError(){
    let botmsg = '<p class="line-breaker"> An error ocured 😔 try again </p>';
    this.botSendMsg(botmsg);
  }

  isEquation(msg: string) {
    for (var i = 0; i < msg.length; i++) {
      if (msg[i] == 'X' || msg[i] == 'x' || msg[i] == '(' || msg[i] == ')' || (msg[i] >= '0' && msg[i] <= '9') || msg[i] == ' ' || msg[i] == '+' || msg[i] == '^' || msg[i] == '-' || msg[i] == '/' || msg[i] == '*' || msg[i] == '=') {
        continue;
      } else {
        return false;
      }
    }
    return true;
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
