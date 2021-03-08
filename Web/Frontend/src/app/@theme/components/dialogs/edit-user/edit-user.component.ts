import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Album } from '../../../../models/album';
import { Photo } from '../../../../models/photo';
import { PhotoS3 } from '../../../../models/photoS3';
import { User } from '../../../../models/user';
import { AlbumService } from '../../../../services/album.service';
import { PhotoService } from '../../../../services/photo.service';
import { UserService } from '../../../../services/user.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'ngx-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  user: User = new User();
  photo: any;
  caption: String;

  constructor(protected ref: NbDialogRef<EditUserComponent>,
    private authService: UserService,
    private photoService: PhotoService,
    private albumService: AlbumService,
    private dialogService: NbDialogService) {
    this.authService.getUser(localStorage.getItem('user-name')).subscribe(data => {
      this.user = data;
      this.user.password = '';

    })
  }

  ngOnInit(): void {
  }

  onFileSelect(event) {

    if (event.target.files.length > 0) {
      this.photo = event.target.files[0];
    }




  }

  editUser() {
    if (this.photo && this.caption) {
      if (this.user.user_name && this.user.fullname && this.user.password) {

        let userauth = {
          username: this.user.user_name,
          password: this.user.password
        };
        this.authService.login(userauth).subscribe(data => {

          this.photoService.upload(this.photo).subscribe(responseUpload => {
            this.authService.updateUser(this.user.user_name, this.user).subscribe(responseUser => {

              let photoS3 = new PhotoS3;
              photoS3.filename = responseUpload.file;
              photoS3.user_name = this.user.user_name;
              this.photoService.save(photoS3).subscribe(data => {
                let photo = new Photo;
                photo.id_user = this.user.user_name;
                photo.id_album = this.user.user_name + "Default";
                photo.id_photo = data.result;
                photo.url = data.result;
                photo.caption = this.caption;
                this.photoService.createPhoto(photo).subscribe(data => {
                  this.ref.close(0);
                })
              })

            })
          })
        }, error => {
          this.dialogService
            .open(DialogComponent, { context: { data: 'Usuario y/o Contraseña incorrecta' } })
        }
        );



      } else {
        this.dialogService
          .open(DialogComponent, { context: { data: 'Faltan datos del usuario' } })
      }
    } else {
      if (this.user.user_name && this.user.fullname && this.user.password) {

        let userauth = {
          username: this.user.user_name,
          password: this.user.password
        };
        this.authService.login(userauth).subscribe(data => {

          this.authService.updateUser(this.user.user_name, this.user).subscribe(responseUser => {
            this.ref.close(0);


          })

        }, error => {
          this.dialogService
            .open(DialogComponent, { context: { data: 'Usuario y/o Contraseña incorrecta' } })
        }
        );



      } else {
        this.dialogService
          .open(DialogComponent, { context: { data: 'Faltan datos del usuario' } })
      }
    }
  }

}
