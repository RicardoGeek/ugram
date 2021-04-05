import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import { WebCamComponent } from "ack-angular-webcam";
import { DialogComponent } from "../../../@theme/components/dialogs/dialog/dialog.component";
import { User } from "../../../models/user";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  base64;
  loginMode: boolean = false;

  user = {
    username: "",
    photoId: "",
    password: ""
  };

  constructor(
    private authService: UserService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  login(webcam: WebCamComponent) {
    webcam
      .getBase64()
      .then((base) => {
        this.base64 = base.split(",");
        this.user.photoId = this.base64[1];

        if (this.user.username && this.user.photoId) {
          this.authService.login(this.user).subscribe(
            (data) => {
              let confidence = data.result.confidence;

              if (confidence > 95) {
                localStorage.setItem("user-name", this.user.username);
                this.router.navigate(["/pages/dashboard"]);
              } else {
                this.dialogService.open(DialogComponent, {
                  context: { data: "Usuario no encontrado" },
                });
              }
            },
            (error) => {
              this.dialogService.open(DialogComponent, {
                context: { data: "Usuario no encontrado" },
              });
            }
          );
        } else {
          this.dialogService.open(DialogComponent, {
            context: { data: "Faltan datos del usuario" },
          });
        }
      })
      .catch((e) => console.error(e));
  }


  passwordLogin(){
    if (this.user.username && this.user.password) {
      this.authService.loginPassword(this.user).subscribe(data=>{
        localStorage.setItem('user-name', this.user.username);
        this.router.navigate(['/pages/dashboard']);
      }, error =>{
        this.dialogService
      .open(DialogComponent, { context: { data: 'Usuario y/o Contraseña incorrecta' } })
      }
      );

    } else {
      this.dialogService
      .open(DialogComponent, { context: { data: 'Faltan datos del usuario' } })
    }
  }
  onCamError(err) {}

  onCamSuccess(event) {}

  changeMode(){
    this.loginMode = !this.loginMode;
  }
}
