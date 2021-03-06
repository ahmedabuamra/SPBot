import { Injectable } from "@angular/core";
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

@Injectable()
export class Dialogflow {

    func: string="";
    topic: string="";
    speech: string = "";

    constructor(private http: HTTP) { }

    sendText(msg: string) {
        let headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': ' Bearer 4c1e4bc7dd8b49dead9f30a102dd0c77'
        };
        this.http.setDataSerializer('json');

        msg = msg.replace(" ", "%20");
        let url = 'https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query='+msg+'&sessionId=spbot-71647';

        return this.http.get(url, {}, headers)
        .then((data: any) => {
            let resp = JSON.parse(data.data);
            console.log(resp);
            this.func = resp["result"]["metadata"]["intentName"];
            this.topic = resp["result"]["parameters"]["LessonName"];
            this.speech = resp["result"]["fulfillment"]["speech"];
            console.log(this.func + " " + this.topic);
        }).catch((error) => {
            console.log(error);
        });
    }

}