import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ShippingAddressComponent} from "./components/shipping-address/shipping-address.component";
import {ShoppingCartComponent} from "./components/shopping-cart/shopping-cart.component";

const routes:Routes = [
  {path: 'home', component: HomeComponent },
  {path: 'form', component: ShippingAddressComponent },
  {path: 'cart', component: ShoppingCartComponent },
  {path: ' ', pathMatch: 'full', redirectTo: 'home' },
  {path: '**', pathMatch: 'full', redirectTo: 'home' }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
