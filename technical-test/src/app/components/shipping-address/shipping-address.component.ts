import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {DataService} from "../../services/data.service";
import { DataShipping } from '../../interface/data-shipping'

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {
  shippingForm: FormGroup;
  arraySuburb:string[] = [];
  selectSuburb:boolean = false;
  invalidForm:boolean = false;
  shippingSuccess:boolean = false;
  shippingError:boolean = false;
  saveData:DataShipping;

  constructor(private dataService:DataService, private fb: FormBuilder) {
    this.crateForm();
    this.listeners()
  }

  ngOnInit() {
  }

  // Field validations
  get invalidName() {
    return this.shippingForm.get('name').invalid && this.shippingForm.get('name').touched
  }

  get invalidLastName() {
    return this.shippingForm.get('lastname').invalid && this.shippingForm.get('lastname').touched
  }

  get invalidLastEmail() {
    return this.shippingForm.get('email').invalid && this.shippingForm.get('email').touched
  }

  get invalidLastPhone() {
    return this.shippingForm.get('phone').invalid && this.shippingForm.get('phone').touched
  }

  get invalidPostal() {
    return this.shippingForm.get('postalCode').invalid && this.shippingForm.get('postalCode').touched
  }

  get invalidStreet() {
    return this.shippingForm.get('street').invalid && this.shippingForm.get('street').touched
  }

  // Event to select postal codes, call service postalCodes
  listeners(){
    this.shippingForm.get('postalCode').valueChanges.subscribe(value => {
      if(value != ''){
        this.dataService.getDataPostal(value).subscribe(data => {
          this.shippingForm.controls["region"].setValue(data['state']);
          this.shippingForm.controls["city"].setValue(data['city']);
          this.shippingForm.controls["municipality"].setValue(data['town']);
          // More than one suburb
          if (data['colonies'].length > 1) {
            this.selectSuburb = true
            this.arraySuburb = data['colonies']
            this.shippingForm.controls["suburbText"].setValue('')
          }
          // One suburb
          else{
            this.selectSuburb = false
            this.shippingForm.controls["suburbText"].setValue(data['colonies']);
            this.shippingForm.controls["suburbSelect"].setValue('')
          }
        })
      }
    })
  }

  // Create and initialize form
  crateForm(){
    this.shippingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required,  Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      postalCode: ['', [Validators.required]],
      suburbText: [{ value: '', disabled: true }],
      suburbSelect: [{ value: ''}],
      region: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      municipality: [{ value: '', disabled: true }, [Validators.required]],
      street: ['', [Validators.required, Validators.minLength(5)]],
      useAddress: [false, []],
    });
  }

  // Save form, validate the form, call service Contact
  saveForm(){
    this.shippingSuccess= false
    this.shippingError= false
    let valueSuburb:string;
    // Invalid form
    if (this.shippingForm.invalid) {
      return Object.values(this.shippingForm.controls).forEach(control => {
        control.markAsTouched();
        this.invalidForm = true
      })
    }
    // Valid form
    else{
      this.invalidForm = false
      // Get suburb value
      if(this.shippingForm.controls["suburbText"].value == ''){
        valueSuburb = this.shippingForm.controls["suburbSelect"].value
      }
      else{
        valueSuburb = this.shippingForm.controls["suburbText"].value
      }
      // Build JSON
      this.saveData = {
        "name": this.shippingForm.controls["name"].value,
        "lastname": this.shippingForm.controls["lastname"].value,
        "email": this.shippingForm.controls["email"].value,
        "phone": this.shippingForm.controls["phone"].value,
        "postalCode": this.shippingForm.controls["postalCode"].value,
        "suburb": valueSuburb,
        "region": this.shippingForm.controls["region"].value,
        "city": this.shippingForm.controls["city"].value,
        "street": this.shippingForm.controls["municipality"].value,
        "useAddress": this.shippingForm.controls["useAddress"].value,
      }
      // Send data
      this.dataService.sendDataForm(this.saveData).subscribe(
        // Success
        (data) => {
          this.shippingSuccess = data.status >= 200 && data.status <= 299;
          this.cleanForm()
        },
        // Error
        (error) => {
          console.log(error);
          this.shippingError = true
        })
    }
  }

  // Clean form fields
  cleanForm(){
    this.shippingForm.reset({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      postalCode: '',
      suburb: '',
      region: '',
      city: '',
      street: '',
      useAddress: '',
    });
    this.selectSuburb = false;
    this.invalidForm = false;
  }
}
