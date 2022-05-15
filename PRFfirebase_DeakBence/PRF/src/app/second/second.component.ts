import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../product';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConnectionService } from '../utils/connection.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class SecondComponent implements OnInit {

  message = '';



  constructor(private connectionService: ConnectionService, private router: Router, private afs: AngularFirestore) {
    this.cloudElements = [];
  }

  cloudId = '';
  value = '';
  cloudElements: any[];


  ngOnInit(): void {

    const cart = localStorage.getItem('cart');
    if (cart) {
      JSON.parse(cart).forEach((p: any) => {
        this.cloudElements.push(p);
      });
    }
  }



  deleteCart() {
    this.cloudElements = [];
    localStorage.removeItem("cart");
  }

}


