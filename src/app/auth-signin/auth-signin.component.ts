import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ForgotPassModal } from '../@modals/forgot-pass-modal/forgot-pass-modal';
import { SlideInOutAnimation } from '../animations';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
  animations: [SlideInOutAnimation]
})

export class AuthSigninComponent implements OnInit {
  Loading = false;
  FormData: FormGroup;
  Submitted = false;
  InvalidUser: any;
  ErrorMSG:any;
  ShowErrorMSG = false;
  animationState = 'out';

  constructor(private route: Router, private fb: FormBuilder, private apiService: ApiService,private modalService: NgbModal) {
    if (apiService.Isloggin()) {
      route.navigate(['/dashboard/default']);
    }
    this.FormData = this.fb.group({
      username: ['', [Validators.required,Validators.minLength(3)]],
      password: ['', [Validators.required,Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    if(this.apiService.Isloggin())
      this.route.navigate(['/dashboard/default']);
  }

  get f() { 
    return this.FormData.controls; 
  }

  SubmitLogin(FormData) {
    this.Submitted = true;
    if (!this.FormData.valid) { return false; }
    this.Loading = true;
    this.apiService.UserLogin(this.FormData.value).pipe(first())
      .subscribe(User => { this.route.navigate(['/']); }
        , error => { 
          this.InvalidUser = true; 
          this.Loading = false; 
          this.ShowErrorMSG = true;
          this.ErrorMSG = error;
          this.animationState = 'in';
          setTimeout(() => {
            this.animationState = 'out';
            setTimeout(() => { this.ShowErrorMSG = false;this.ErrorMSG=''},500);
          },2000);
        });
  }
  openModal(){
    const modalReference = this.modalService.open(ForgotPassModal, { ariaLabelledBy: "modal-basic-title", centered: true });
  }
}
