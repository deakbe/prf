import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConnectionService } from '../utils/connection.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit {

  constructor(private connectionService: ConnectionService, private router: Router, private afs: AngularFirestore) {
    console.log(environment);
    this.cloudElements = [];
  }

  title = 'PRF';

  cloudId = '';
  value = '';
  cloudElements: any[];

  example = ['1_elem'];

  dataObserver: Subscription | null = null;

  goToCart() {
    this.router.navigate(['/second', 'PRF', {message: this.title}]);
  }

  
  saveData() {
    this.afs.collection('Examples-023').add({id: this.cloudId, value: this.value}).then(res => {
      console.log('save successful', res);
      this.cloudId = '';
      this.value = '';
      this.refreshDb();
    }).catch(error => {
      console.log('save error', error);
    })
  }

  refreshDb() {
    this.cloudElements = [];
    this.afs.collection('Examples-023').get().subscribe(res => {
      res.docs.forEach(doc => {
        const data = doc.data() as any;
        this.cloudElements.push('Id: ' + data.id + ', Value: ' + data.value);
      })
    })
  }

  ngOnInit(): void {
    this.refreshDb();
  }

  addToCart(k: string){
    console.log(' hozzáadva a kosárhoz!');
    const cartAll = localStorage.getItem('cart');
    let cart;
    if (cartAll){
      cart = JSON.parse(cartAll);
    } else {
      cart = [];
    }
    cart.push(k);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

}
