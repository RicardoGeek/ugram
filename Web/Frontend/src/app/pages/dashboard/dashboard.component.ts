import { TextPhotosComponent } from "./../../@theme/components/dialogs/text-photos/text-photos.component";
import { Component, OnInit } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { environment } from "../../../environments/environment";
import { ChatBotComponent } from "../../@theme/components/dialogs/chat-bot/chat-bot.component";
import { DialogComponent } from "../../@theme/components/dialogs/dialog/dialog.component";
import { TranslateComponent } from "../../@theme/components/dialogs/translate/translate.component";
import { Album } from "../../models/album";
import { Photo } from "../../models/photo";
import { PhotoS3 } from "../../models/photoS3";
import { User } from "../../models/user";
import { AlbumService } from "../../services/album.service";
import { PhotoService } from "../../services/photo.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(
    private userService: UserService,
    private photosService: PhotoService,
    private albumService: AlbumService,
    private dialogService: NbDialogService
  ) {}

  user = new User();
  seePhotos: boolean = false;
  uploadPhoto: boolean = false;
  seeAlbum: boolean = false;

  photosArray: any[] = [];
  albumArray: Album[] = [];
  bucket = environment.bucketUrl;

  newFile: any;
  photoName: String;
  captionPhoto: String;

  selectAlbum: String = "Other";

  newAlbum = new Album();
  ngOnInit(): void {
    let username = localStorage.getItem("user-name");

    this.userService.getUser(username).subscribe((data) => {
      this.user = data;
    });
  }

  getPhotos() {
    this.uploadPhoto = false;
    this.seeAlbum = false;
    this.photosArray = [];
    this.seePhotos = !this.seePhotos;

    if (this.seePhotos) {
      this.photosService
        .getUserPhotos(this.user.user_name)
        .subscribe((responsePhotos) => {
          if (responsePhotos.message.Items) {
            const grouped = this.groupBy(
              this.parsePhotos(responsePhotos.message.Items),
              (photo) => photo.id_album
            );
            this.photosArray = [...grouped];
          } else {
            const grouped = this.groupBy(
              this.parsePhotos(responsePhotos.message),
              (photo) => photo.id_album
            );
            this.photosArray = [...grouped];
          }
        });
    }
  }

  parsePhotos(items: []) {
    let resultIems = [];
    items.forEach((data: any) => {
      if (data.id_album.includes("Default")) {
        resultIems.push(data);
      } else {
        let tagAlbums = data.tags.split(",");

        tagAlbums.forEach((element) => {
          let newData = {
            caption: data.caption,
            id_album: element,
            id_photo: data.id_photo,
            id_user: data.id_user,
            name: data.name,
            tags: data.tags,
            url: data.url,
          };

          resultIems.push(newData);
        });
      }
    });

    return resultIems;
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  showUpload() {
    this.seePhotos = false;
    this.seeAlbum = false;
    this.uploadPhoto = !this.uploadPhoto;

    this.newFile = undefined;
    this.photoName = "";

    if (this.uploadPhoto) {
      this.refreshAlbumes();
    }
  }

  refreshAlbumes() {
    this.albumService.getUserAlbum(this.user.user_name).subscribe((data) => {
      if (data.message) {
        this.albumArray = data.message.Items;
      } else {
        this.albumArray = data.albums;
      }
    });
  }

  upload() {
    if (
      this.newFile &&
      this.photoName &&
      this.selectAlbum &&
      this.captionPhoto
    ) {
      this.photosService.upload(this.newFile).subscribe((responseUpload) => {
        let photoS3 = new PhotoS3();
        photoS3.filename = responseUpload.file;
        photoS3.user_name = this.user.user_name;
        this.photosService.save(photoS3).subscribe((data) => {
          let photo = new Photo();
          photo.id_user = this.user.user_name;
          photo.id_album = this.selectAlbum;
          photo.id_photo = data.result;
          photo.url = data.result;
          photo.caption = this.captionPhoto;
          photo.name = this.photoName;
          this.photosService.createPhoto(photo).subscribe((data) => {
            this.photosService.tagPhoto(photo.id_photo).subscribe((data) => {
              this.uploadPhoto = false;
              this.newFile = undefined;
              this.photoName = "";
            });
          });
        });
      });
    } else {
      this.dialogService.open(DialogComponent, {
        context: { data: "Faltan datos para cargar la foto" },
      });
    }
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.newFile = event.target.files[0];
    }
  }

  showAlbum() {
    this.seePhotos = false;
    this.uploadPhoto = false;

    this.seeAlbum = !this.seeAlbum;

    if (this.seeAlbum) {
      this.refreshAlbumes();
    }
  }

  createAlbum() {
    this.newAlbum.user_name = this.user.user_name;

    if (this.newAlbum.user_name && this.newAlbum.album_name) {
      this.newAlbum.id_album = this.user.user_name.concat(
        this.newAlbum.album_name.toString()
      );

      this.albumService.createAlbum(this.newAlbum).subscribe((data) => {
        this.newAlbum = new Album();
        this.seeAlbum = false;
      });
    } else {
      this.dialogService.open(DialogComponent, {
        context: { data: "Faltan datos para crear album" },
      });
    }
  }

  deleteAlbum() {
    this.albumService
      .deleteAlbum(this.user.user_name, this.selectAlbum)
      .subscribe((data) => {
        this.seeAlbum = false;
      });
  }

  deletePhoto(id_photo: string) {
    console.log(id_photo);
    let userBody = {
      user_id: this.user.user_name,
    };
    this.photosService.deletePhoto(id_photo, userBody).subscribe((data) => {
      this.seePhotos = false;
    });
  }

  openTranslate(caption: String) {
    this.dialogService.open(TranslateComponent, {
      context: { caption: caption },
    });
  }

  openChat() {
    this.dialogService.open(ChatBotComponent);
  }

  openText(url: string) {
    this.photosService.getText(url).subscribe((data) => {
      this.dialogService.open(TextPhotosComponent, {
        context: { texts: data.message },
      });
    });
  }
}
