import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Customer } from 'src/app/common/customer';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  customer: BehaviorSubject<Customer> = new BehaviorSubject<Customer>({firstName:'', lastName:'',email:''});

  constructor() { }
}
