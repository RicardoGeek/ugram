import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AlbumService } from '../../../services/album.service';
import { PhotoService } from '../../../services/photo.service';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  user: User = new User();
  photo: any;
  constructor(private authService: UserService,
    private albumServide: AlbumService,
    private photoService: PhotoService,
    private router: Router) {
  }


  register() {


    this.photoService.upload(this.photo).subscribe(responseUpload => {
      console.log(responseUpload);
    })
   
  }

  onFileSelect(event) {

    if (event.target.files.length > 0) {
      this.photo = event.target.files[0];
    }




  }


}
