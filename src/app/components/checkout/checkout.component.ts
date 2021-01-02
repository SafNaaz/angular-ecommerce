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
        street:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        city:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        state:['',[Validators.required]],
        country:['',[Validators.required]],
        zipCode:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
      }),
      billingAddress: this.formBuilder.group({
        street:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        city:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
        state:['',[Validators.required]],
        country:['',[Validators.required]],
        zipCode:['',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]],
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
    return this.checkoutFormGroup.get('customer.lastName')
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email')
  }

  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street')
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city')
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode')
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state')
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country')
  }

  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street')
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city')
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode')
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state')
  }

  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country')
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
