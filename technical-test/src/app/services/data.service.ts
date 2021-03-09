import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class DataService {


  constructor(private http:HttpClient) {
  }

  // Get data from postal code
  getDataPostal(code:string){
    return this.http.get(`https://blackisp.herokuapp.com/postalCodes/${code}`)
  }

  // Get products to cart
  getDataProducts(){
    return this.http.get('https://blackisp.herokuapp.com/products')
  }

  // Send data from form
  sendDataForm(data:any){
    let response:any = this.http.post('https://blackisp.herokuapp.com/contact/', data, {observe: 'response'})
    return response;
  }
}
