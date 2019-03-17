import { Injectable } from "@angular/core";
import { HTTP } from '@ionic-native/http';
import 'rxjs/Rx';

@Injectable()
export class Backend {
    private lastRecommendedVideo: any;
    private lastSolvedEquationImgHTMLTag: any;

    constructor(private http: HTTP) { }

    getLastRecommendedVideo() {
        return this.lastRecommendedVideo;
    }

    getLastSolvedEquationImgHTMLTag() {
        return this.lastSolvedEquationImgHTMLTag;
    }

    fetchYoutubeVideos(keyword: string) {
        let url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBgobp2po_7gw_Pf6oxi6sIBc0u3iiwISM&q=" + keyword + "&part=snippet,id&maxResults=20&order=viewCount&type=video"
        return this.http.get(url, {}, {})
            .then((data: any) => {
                let resp = JSON.parse(data.data);
                if (resp["items"] && resp["items"].length) {
                    this.lastRecommendedVideo = resp["items"][0];
                } else {
                    this.lastRecommendedVideo = null;
                }
                console.log(this.lastRecommendedVideo);
            }).catch((error) => {
                console.log(error);
                this.lastRecommendedVideo = null;
            });
    }

    solveMathEquation(equation: string) {
        equation = equation.trim();
        
        equation = equation.replace("^", "%5E");
        equation = equation.replace("+", "%2B");
        equation = equation.replace("=", "%3D");
        equation = equation.replace("/", "%2F");

        let url = 'http://api.wolframalpha.com/v2/query?appid=JKHY49-VX6QKEEXHW&input=solve' + equation + '&podstate=Result__Step-by-step%20solution&format=image&fbclid=IwAR0vbjfAv7LUflfqLzhBKDRli6XkYYMlyR7Ikw0knZEeWHGRrP8MFyfZiT0'
        return this.http.get(url, {}, {})
            .then((data: any) => {
                let xml: string = data.data;
                console.log(xml);

                let idx = xml.indexOf("Possible intermediate steps");
                if(idx == -1){
                    this.lastSolvedEquationImgHTMLTag = null;
                }else{
                    let nextSubString: string = '<img';
                    let idxOfImg = xml.indexOf(nextSubString, idx);
                    let idxOfEngImg = xml.indexOf("/>", idxOfImg);
                    this.lastSolvedEquationImgHTMLTag = xml.substr(idxOfImg, (idxOfEngImg-idxOfImg+3));
                    console.log(this.lastSolvedEquationImgHTMLTag);
                }
            }).catch((error) => {
                this.lastSolvedEquationImgHTMLTag = null;
            });

    }

}