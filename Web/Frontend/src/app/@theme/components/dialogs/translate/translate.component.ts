import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'ngx-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {

  selectedItemNgModel;
  textResult: String;
  @Input() caption: String;

  constructor(protected ref: NbDialogRef<TranslateComponent>,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  translate(){
    let data = {
      language: 'es',
      target: this.selectedItemNgModel,
      text: this.caption
    }
    this.userService.translate(data).subscribe(dataResult=>{
      this.textResult = dataResult.message.TranslatedText;
    })

  }

}
