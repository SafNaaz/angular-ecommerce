import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from 'src/app/common/customer';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  customer: BehaviorSubject<Customer> = new BehaviorSubject<Customer>({firstName:'', lastName:'',email:''});

  constructor(private http : HttpClient) { }

  getOrders(email : string) : Observable<any>{
    return this.http.get(`http://localhost:8080/api/checkout/orders/${email}`);
  }
}
