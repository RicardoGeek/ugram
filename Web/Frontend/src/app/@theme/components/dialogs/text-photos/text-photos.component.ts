import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-text-photos',
  templateUrl: './text-photos.component.html',
  styleUrls: ['./text-photos.component.scss']
})
export class TextPhotosComponent implements OnInit {

  @Input() texts:[];
  constructor(protected ref: NbDialogRef<TextPhotosComponent>) { }

  ngOnInit(): void {
  }

}
