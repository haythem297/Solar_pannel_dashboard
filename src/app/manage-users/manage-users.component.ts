import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserModal } from '../@modals/manage-users/user-modal';
import Swal from 'sweetalert2';

@Component({
  selector: "app-manage-users",
  templateUrl: "./manage-users.component.html",
  styleUrls: ["./manage-users.component.scss"]
})
export class ManageUsersComponent implements OnInit {
  
  closeResult: string = "";
  users: any;
  componentInstance: any;
  passwordResetRequests: any;

  constructor(
    private apiService: ApiService,
    private route: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("role") != "webmaster") {
      this.route.navigate(["/dashboard/default"]);
    }
    this.retrieveUsers();
    this.retrievePasswordResetRequests();
  }

  openModal(obj:object={}){
    const modalReference = this.modalService.open(UserModal, { ariaLabelledBy: "modal-basic-title", centered: true });
    modalReference.componentInstance.user = obj;
    modalReference.result.then(
      (result) => {
        this.retrieveUsers();
      }
    );
  }

  retrieveUsers(): void {
    this.apiService
      .getAllUsers()
      .pipe(first())
      .subscribe(
        (Users) => {
          this.users = Users[0];
        },(error) => {});
  }

  retrievePasswordResetRequests():void{
    this.apiService
      .getAllPasswordResetRequests()
      .pipe(first())
      .subscribe(
        (Response) => {
          this.passwordResetRequests = Response[0];
        },(error) => {});
  }

  deleteUser(id:number):void{
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this record!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.apiService.deleteUser(id).pipe(first())
        .subscribe(
          (User) => {
            if(User.status=='ok'){
              this.retrieveUsers();
              this.toastr.success('User deleted successfully','Success!');
            }
          },
          (error) => {}
        );
      } 
    })
  }

  resetPassword(id){
    this.apiService
      .resetPasswordUser(id)
      .pipe(first())
      .subscribe(
        (Response) => {
          this.toastr.success('User password updated successfully','Success!');
          this.retrieveUsers();
          this.retrievePasswordResetRequests();
        },(error) => {});
  }
}
