import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl ,ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  newEmployeeClicked = false;
  employees = [
  ];

  color;
  formdataadd: FormGroup;
  constructor() { }

  ngOnInit() {
    this.formdataadd = new FormGroup({
      number: new FormControl(""),
      name: new FormControl(""),
      deadline: new FormControl(""),
      status: new FormControl("")
    });
  }

  model: any = {};


  addEmployee(data) {
    this.employees.push(data);
    this.model = {};
  }

  deleteemployee(i) {
    this.employees.splice(i);
    console.log(i);
  }








  addNewEmployeeBtn() {
    this.newEmployeeClicked = !this.newEmployeeClicked;
  }




}