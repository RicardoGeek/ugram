import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() data: string;

  constructor(protected ref: NbDialogRef<DialogComponent>) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.ref.close(0);
  }

}
