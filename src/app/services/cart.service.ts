import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() {
    // const data = localStorage.getItem('cartItems');
    // if (data) {
    //   this.cartItems = JSON.parse(data);
    //   this.computeCartTotals();
    // }

    //read data from storage

    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;
      //compute totals based on data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    //check if we already have item in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      //find the item of cart based on id
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );
      //check if we found it
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      //increment the quantity
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    // localStorage.setItem('cartItems', JSON.stringify(this.cartItems));

    //compute cart total prie and total quantity

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // localStorage.setItem('cartItems', JSON.stringify(this.cartItems));

    //publish new values to all subsribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //
    this.logCartData(totalPriceValue, totalQuantityValue);

    //persist cart data
    this.persistCartItems()
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems))
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, 
                  quantity= ${tempCartItem.quantity}, 
                  unitPrice= ${tempCartItem.unitPrice}, 
                  subTotalPrice= ${subTotalPrice}`);
    }

    console.log(`totalPrice = ${totalPriceValue.toFixed(2)}, 
                totalQuantity = ${totalQuantityValue}`);

    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    //get index of item in array
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id == cartItem.id
    );

    //if found remove from aray
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
