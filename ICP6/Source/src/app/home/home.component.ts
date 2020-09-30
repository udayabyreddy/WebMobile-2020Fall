import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  // submit() {
  //   this._http.jsonp("https://api.foursquare.com/v2/venues/explore?client_id='QOP5VILHKHITWOSRULDFOCF2LH4G35CT0N2D0SA4MKEFQVWB'&client_secret='ODHGXXBNDCG13EBH1QG4OUDQJ0L2UB3J44PER1T3B0Z4OJOA'&v=20180323&limit=1&ll=40.7243,-74.0018&query=" + this.searchTerm.nativeElement.value, 'callback')
  //     .subscribe((data: any) => {
  //       this.isLoading = false;
  //       this.pages = Object.keys(data.query.pages).map(function (k) {
  //         var i = data.query.pages[k];
  //         return {title: i.title, body: i.extract, page: 'http://en.wikipedia.org/?curid=' + i.pageid}
  //       });
  //       console.log(this.pages);
  //     });
  // }
  }

}
