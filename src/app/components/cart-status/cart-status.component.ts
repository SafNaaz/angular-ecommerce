import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  cartItems : CartItem[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    
    const data = localStorage.getItem('cartItems')
    if (data) {
      this.cartItems = JSON.parse(data);
      this.cartService.cartItems = this.cartItems;

      for (let currentCartItem of this.cartItems) {
        this.totalPrice += currentCartItem.quantity * currentCartItem.unitPrice;
        this.totalQuantity += currentCartItem.quantity;
      }
    }
    this.updateCartStatus();
  }

  updateCartStatus(){
    //subscribe to cart totalPrive

    this.cartService.totalPrice.subscribe(data=>{
      this.totalPrice = data;
    })

    //subscribe to cart totalQuantity

    this.cartService.totalQuantity.subscribe(data=>{
      this.totalQuantity = data;
    })
  }

}
