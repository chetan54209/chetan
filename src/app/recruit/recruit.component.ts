import { Component, OnInit } from '@angular/core';
import {  AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Popup } from '../popup.model';

@Component({
  selector: 'app-recruit',
  templateUrl: './recruit.component.html',
  styleUrls: ['./recruit.component.css']
})
export class RecruitComponent implements OnInit {
  
  log1:Popup=new Popup();
  constructor(private router:Router, private authservice:AuthService) { }

  firstLoad:boolean=true;
  ngOnInit() {
    this.log1.unique_sales_code = "";
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }
  onSubmit(){
    // alert("i am submiting"+this.log1.unique_sales_code);
    
     this.authservice.createcode(this.log1)
.subscribe(data =>{
       
  console.log (data)
  if(data.status=="success")
  {
    // localStorage.setItem("isLoggedin","yes");
    this.router.navigate(['register'],{queryParams:{rfc:data.unique_sales_code}});
  }
  else{
    this.log1.unique_sales_code
       alert("unique_sales_code: " +this.log1.unique_sales_code + "" +" is not Valid");
  }

 });
  }
}
