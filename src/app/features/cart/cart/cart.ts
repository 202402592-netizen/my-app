import { Component, OnInit } from '@angular/core';
import { Cart , CartItem } from '../../../models/cart.model';
import { CartService } from '../../../core/services/cart';
import {ToastService  } from '../../../core/services/toast';
import { RouterLink, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
@Component({
  selector: 'app-cart',
  imports: [RouterLink,CommonModule,RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit{
    cart:Cart={items:[],total:0};
  constructor(
    private cartService: CartService,
    private toastService: ToastService    
  ){}

 ngOnInit():void{
 this. cartService.cart.subscribe((cart) =>{
  this.cart=cart;
});
 }
      increaseQuantity(item:CartItem):void{
     this.cartService.updateQuantity(item.product.id,item.quantity+1);
    }
  decreaseQuantity(item:CartItem):void{
    if(item.quantity >1){
           this.cartService.updateQuantity(item.product.id,item.quantity-1);
    }
  }
 removeItem(productId:number):void{
       this.cartService.removeFromCart(productId);
       this.toastService.success('Item removed from Cart');
 }
 clearCart():void{
  if(confirm('Are you sure you want to clear your Cart?')){
       this.cartService.clearCart();
       this.toastService.success('Cart cleared');
 }
 }
 checkout():void{
       this.toastService.info('checkout functionality will be implemented soon!');
 }
 getItemTotal(item:CartItem):number{
  return item.product.price * item.quantity;
 }
}