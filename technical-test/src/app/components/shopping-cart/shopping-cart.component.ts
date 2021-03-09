import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {element} from "protractor";
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  dataProducts:any = [];
  arrayPrices:number[] = []
  subtotal:number = 0;
  total:number=0;
  constructor(private dataService:DataService) {
    // Call service products
    this.dataService.getDataProducts().subscribe(data => {
      this.dataProducts = data
      this.calculateSubtotal(data)

    })
  }

  ngOnInit() {
  }

  // Calculate product list subtotal
  calculateSubtotal(products){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    products.forEach(element=>
      this.arrayPrices.push(Number(element.price))
    )
    this.subtotal = this.arrayPrices.reduce(reducer)
    this.calculateTotal(this.subtotal, 0)
  }

  // Calculate product list total
  calculateTotal(subtotal, costShipping){
    this.total = subtotal+costShipping
  }
}
