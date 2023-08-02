import {Component, Input,OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ConfirmedValidator } from '../../confimed.validator';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl:'./user-modal.html'
})
export class UserModal implements OnInit{
  @Input() user;
  ErrorMSG: String;
  modalTitle: String;
  FormData: FormGroup;
  Loading: Boolean = false;
  editMode: Boolean = false;
  Submitted: Boolean = false;
  ShowErrorMSG: Boolean = false;

  constructor(public activeModal: NgbActiveModal,private fb: FormBuilder,private apiService: ApiService,private toastr:ToastrService) {
    this.FormData = this.fb.group(
      {
        firstname: ["", [Validators.required, Validators.minLength(3)]],
        lastname: ["", [Validators.required, Validators.minLength(3)]],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          ],
        ],
        phone: [
          "",
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(8),
            Validators.maxLength(8),
          ],
        ],
        username: ["", [Validators.required, Validators.minLength(3)]],
        password: ["", [Validators.required, Validators.minLength(5)]],
        confirm_password: ["", [Validators.required]],
      },
      {
        validator: ConfirmedValidator("password", "confirm_password"),
      }
    );
  }
  ngOnInit():void{
    if(typeof(this.user.id)=="undefined"){
      this.modalTitle = "Add new user";
    }else{
      this.editMode = true;
      this.modalTitle = "Update user";
      this.FormData.controls.firstname.setValue(this.user.firstname);
      this.FormData.controls.lastname.setValue(this.user.lastname);
      this.FormData.controls.email.setValue(this.user.email);
      this.FormData.controls.phone.setValue(this.user.phone);
      this.FormData.controls.username.setValue(this.user.username);
      this.FormData.controls.password.setValidators([Validators.minLength(5)]);
      this.FormData.controls.password.updateValueAndValidity();
      this.FormData.controls.confirm_password.setValidators([Validators.minLength(5)]);
      this.FormData.controls.confirm_password.updateValueAndValidity();
      
    }
  }
  get f() {
    return this.FormData.controls;
  }

  SaveUser(){
    this.ShowErrorMSG = false;
    this.Submitted = true;
    this.ErrorMSG = "";
    if (!this.FormData.valid) {
      return false;
    }
    this.Loading = true;
    if(typeof(this.user.id)=='undefined'){
      this.apiService
      .saveNewUser(this.FormData.value)
      .pipe(first())
      .subscribe(
        (User) => {
          this.activeModal.close('ok');
          this.toastr.success('New user saved successfully','Success!');
        },
        (error) => {
          this.Loading = false;
          this.ShowErrorMSG = true;
          this.ErrorMSG = "<ul>";
          this.ErrorMSG += error.msg;
          this.ErrorMSG += "</ul>";
        }
      );
    }else{
      this.FormData.value.id = this.user.id;
      this.apiService.saveUpdateUser(this.FormData.value)
      .pipe(first())
      .subscribe(
        (User) => {
          this.activeModal.close('ok');
          this.toastr.success('User updated successfully','Success!');
        },
        (error) => {
          this.Loading = false;
          this.ShowErrorMSG = true;
          this.ErrorMSG = "<ul>";
          this.ErrorMSG += error.msg;
          this.ErrorMSG += "</ul>";
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}