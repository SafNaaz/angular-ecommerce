import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-members-page',
  templateUrl: './members-page.component.html',
  styleUrls: ['./members-page.component.css']
})
export class MembersPageComponent implements OnInit {

  firstName: string = ''
  lastName: string = ''

  constructor(private userService : UserService) { }

  ngOnInit(): void {
    this.userService.customer.subscribe(value=>{
      this.firstName = value.firstName
      this.lastName = value.lastName
    })
  }

}
