import {Component, Input,OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl:"./forgot-pass-modal.html"
})
export class ForgotPassModal implements OnInit{
  ErrorMSG: String;
  modalTitle: String;
  FormData: FormGroup;
  Loading: Boolean = false;
  editMode: Boolean = false;
  Submitted: Boolean = false;
  ShowErrorMSG: Boolean = false;
  InvalidUser:Boolean;
  animationState = 'out';

  constructor(public activeModal: NgbActiveModal,private fb: FormBuilder,private apiService: ApiService,private toastr:ToastrService, private route: Router) {
    this.FormData = this.fb.group(
      {
        username: ["", [Validators.required, Validators.minLength(3)]]
      }
    );
  }

  ngOnInit():void{
  
  }
  
  get f() {
    return this.FormData.controls;
  }

  closeModal() {
    this.activeModal.close();
  }

  SubmitForm():void{
    this.apiService.SubmitPasswordReset(this.FormData.value).pipe(first())
    .subscribe(Response => { 
      this.activeModal.close('ok');
      this.toastr.success(Response.message,'Success!'); 
    }, error => { 
        this.InvalidUser = true; 
        this.Loading = false; 
        this.ShowErrorMSG = true;
        this.ErrorMSG = error.message;
        this.animationState = 'in';
        setTimeout(() => {
          this.animationState = 'out';
          setTimeout(() => { this.ShowErrorMSG = false;this.ErrorMSG=''},500);
        },2000);
        if(error.closeModal){
          setTimeout(() => {
            this.animationState = 'out';
            this.activeModal.close('ok');
          },3000);
        }
      });
  }
}