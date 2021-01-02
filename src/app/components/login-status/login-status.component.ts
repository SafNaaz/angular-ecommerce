import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(private oktaAuthService: OktaAuthService,
              private userService: UserService) { }

  ngOnInit(): void {

    this.oktaAuthService.$authenticationState.subscribe(
      (result)=>{
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    )
  }

  getUserDetails(){
    if(this.isAuthenticated){
      this.oktaAuthService.getUser().then((res: any) =>{
        this.userService.customer.next({firstName:res.given_name, lastName: res.family_name, email: res.email});
        this.userFullName = res.name
      })
    }
  }

  logout(){
    this.oktaAuthService.signOut();
  }

}
