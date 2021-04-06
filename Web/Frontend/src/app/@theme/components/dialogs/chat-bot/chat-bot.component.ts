import { Component, OnInit } from '@angular/core';
import Interactions from '@aws-amplify/interactions';

@Component({
  selector: 'ngx-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {

  text: String = "";
  message: String = "";
  constructor() { }

  ngOnInit(): void {
  }

  async send() {
    this.text = this.text + "\nYou::" + this.message;
    let response = await Interactions.send("fotos_app_dev", this.message)
    console.log(response);

    if(response && response.message){
      this.text = this.text + "\nBot::" + response.message
      this.message = "";
    }

    if(response && !response.message) {
      this.text = this.text + "\nBot::" + "Gracias por contactarnos."
      this.message = "";
    }

  }

}
