import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = []

  constructor(private orderHistoryService: OrderHistoryService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory(){
    this.userService.customer.subscribe(value=>{
      this.orderHistoryService.getOrderHistory(value.email).subscribe(
        data =>{
          this.orderHistoryList = data._embedded.orders;
        }
      )
    })
  }

}
