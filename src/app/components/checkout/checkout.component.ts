import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = []
  creditCardYears: number[] = [];

  countries : Country[] = [];

  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        lastName:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        email:['',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
      }),
      billingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:[''],
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:[''],
      })
    })

    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data=>{
      this.creditCardMonths = data
    })

    this.shopFormService.getCreditCardYears().subscribe(data=>{
      this.creditCardYears = data;
    })

    this.shopFormService.getCountries().subscribe(data =>{
      this.countries = data;
    })

  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName')
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lasstName')
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email')
  }

  copyShippingAddressToBillingAddress(event : any){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value)

      //fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    } else{
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data =>{
      this.creditCardMonths = data;
    })
  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe(data=>{
      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup?.get('state')?.setValue(data[0]);
    })
  }

}
