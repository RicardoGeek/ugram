import { Component } from "@angular/core";
import { User } from "../../../models/user";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { AlbumService } from "../../../services/album.service";
import { PhotoService } from "../../../services/photo.service";
import { Album } from "../../../models/album";
import { Photo } from "../../../models/photo";
import { PhotoS3 } from "../../../models/photoS3";
import { NbDialogService } from "@nebular/theme";
import { DialogComponent } from "../../../@theme/components/dialogs/dialog/dialog.component";

@Component({
  selector: "ngx-register",
  templateUrl: "./register.component.html",
  styles: [],
})
export class RegisterComponent {
  user: User = new User();
  photo: any;
  caption: String;
  photoName: String;

  constructor(
    private authService: UserService,
    private albumService: AlbumService,
    private photoService: PhotoService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  register() {
    if (this.photo && this.caption && this.photoName) {
      if (this.user.user_name && this.user.fullname && this.user.password) {
        this.photoService.upload(this.photo).subscribe((responseUpload) => {
          this.authService.createUser(this.user).subscribe((responseUser) => {
            let album = new Album();
            album.user_name = this.user.user_name;
            album.album_name = "Other";
            album.id_album = this.user.user_name + "Other";
            this.albumService.createAlbum(album).subscribe((albumResponse) => {
              let album = new Album();
              album.user_name = this.user.user_name;
              album.album_name = "Default";
              album.id_album = this.user.user_name + "Default";
              this.albumService
                .createAlbum(album)
                .subscribe((albumResponse) => {
                  let photoS3 = new PhotoS3();
              photoS3.filename = responseUpload.file;
              photoS3.user_name = this.user.user_name;
              this.photoService.save(photoS3).subscribe((data) => {
                let photo = new Photo();
                photo.id_user = this.user.user_name;
                photo.id_album = album.id_album;
                photo.id_photo = data.result;
                photo.url = data.result;
                photo.caption = this.caption;
                photo.name = this.photoName;
                this.photoService.createPhoto(photo).subscribe((data) => {
                  this.photoService
                    .tagPhoto(photo.id_photo)
                    .subscribe((data) => {
                      localStorage.setItem(
                        "user-name",
                        this.user.user_name.toString()
                      );
                      this.router.navigate(["/pages/dashboard"]);
                    });
                });
              });

                });

            });
          });
        });
      } else {
        this.dialogService.open(DialogComponent, {
          context: { data: "Faltan datos del usuario" },
        });
      }
    } else {
      this.dialogService.open(DialogComponent, {
        context: { data: "Faltan datos de la imagen" },
      });
    }
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.photo = event.target.files[0];
    }
  }
}
