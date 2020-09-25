import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl ,ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  title = 'timerproject';
  sub: any;
  mySubscription: Subscription
change=false;

  todaydate;
  componentproperty;
  emailid;
  formdata;
  countDownDate1: any;
  datanew={"date":10,"year":"2021"};


  theredata=false;
  months: string[];
  displaymonth="FEB";
  constructor() { }

  ngOnInit() {


    this.formdata = new FormGroup({
      date: new FormControl(""),
      month: new FormControl(""),
      year: new FormControl(""),
      hours: new FormControl(""),
      min:new FormControl(""),
      sec:new FormControl(""),
    });
    this.countDownDate1=new Date("Feb 10 , 2021 15:37:25");


    this.countDownDate=this.countDownDate1.getTime();

   this.mySubscription= interval(1000).subscribe((x =>{
    this.k();
}));
        }

  countDownDate :any;;

  now="";
  distance="";
  days="";
  hours="";
  minutes="";
  seconds="";

  k=function(){

    setTimeout (() => {
      this.now = new Date().getTime();


      this.distance = this.countDownDate - this.now;


     this.days = Math.floor(this.distance / (1000 * 60 * 60 * 24));

      this.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
   },0);

   }
  onClickSubmit(data) {
    this.datanew=data;
    this.change=false;
    this.months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    this.displaymonth=this.months[data.month-1];
    this.theredata=true;
    this.countDownDate1=new Date("Feb 10 , 2021 15:37:25")
    if(data.date!=""){
      this.countDownDate1.setDate(data.date);
      this.countDownDate1.setFullYear(data.year);
      this.countDownDate1.setHours(data.hours);
      this.countDownDate1.setMinutes(data.min);
      this.countDownDate1.setSeconds(data.sec);
      this.countDownDate1.setMonth(data.month-1 );
    }else{
      console.log(this.countDownDate1.getTime());
    }


   this.countDownDate=this.countDownDate1.getTime();

   this.mySubscription= interval(1000).subscribe((x =>{
    this.k();
}));
    }
}
