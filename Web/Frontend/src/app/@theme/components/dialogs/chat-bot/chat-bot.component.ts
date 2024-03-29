import { Component, OnInit } from "@angular/core";
import Interactions from "@aws-amplify/interactions";
import aws_exports from "../../../../../aws-exports";
import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";

// Amplify.configure({
//   Auth: {
//     identityPoolId: "us-east-1:28aaaddf-c96a-4922-9588-ce169ae8c8a7",
//     region: "us-east-1",
//   },
//   Interactions: {
//     bots: {
//       fotos_app_dev: {
//         name: "fotos_app_dev",
//         alias: "$LATEST",
//         region: "us-east-1",
//       },
//     },
//   },
// });

Auth.configure({
  identityPoolId: "us-east-1:28aaaddf-c96a-4922-9588-ce169ae8c8a7",
  region: "us-east-1",
});
Interactions.configure({
  bots: {
    fotos_app_dev: {
      name: "fotos_app_dev",
      alias: "$LATEST",
      region: "us-east-1",
    },
  },
});
@Component({
  selector: "ngx-chat-bot",
  templateUrl: "./chat-bot.component.html",
  styleUrls: ["./chat-bot.component.scss"],
})
export class ChatBotComponent implements OnInit {
  text: String = "";
  message: String = "";
  constructor() {}

  ngOnInit(): void {}

  async send() {
    this.text = this.text + "\nYou::" + this.message;
    let response = await Interactions.send("fotos_app_dev", this.message);
    console.log(response);

    if (response && response.message) {
      this.text = this.text + "\nBot::" + response.message;
      this.message = "";
    }

    if (response && !response.message) {
      this.text = this.text + "\nBot::" + "Gracias por contactarnos.";
      this.message = "";
    }
  }
}
