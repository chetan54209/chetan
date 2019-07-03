import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { utilClass } from '../Models/utilClass';
import { event } from '../Models/event.model';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends utilClass implements OnInit {
  firstLoad:boolean=true;
  eve: event = new event();
  eventForm: FormGroup;
  datasaved = false;
  msg: any;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private authservice: AuthService) {
    super();
  }

  ngOnInit() {
    if (this.firstLoad) {
      window.scroll(0, 0)
      this.firstLoad = false;
    }
    this.setFormState();
}

  setFormState(){
    this.eventForm = this.formBuilder.group({
      salon_name: ['', Validators.required],
      participant_one: ['', Validators.required],
      participant_two: [''],
      participant_three: [''],
      tel: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    });
  }
 
// convenience getter for easy access to form fields
get f() { return this.eventForm.controls; }

  onSubmit() {
    this.submitted = true;
    // let form = new FormData();
    // form.set('salon_name', this.eventForm.get('salon_name').value);
    // form.set('participant_one', this.eventForm.get('participant_one').value);
    // form.set('participant_two', this.eventForm.get('participant_two').value);
    // form.set('participant_three', this.eventForm.get('participant_three').value);
    // form.set('tel', this.eventForm.get('tel').value);
    // form.set('email', this.eventForm.get('email').value);
    // form.set('address', this.eventForm.get('address').value);

    if (this.eventForm.invalid) {
      return;
    } else {
      console.log(this.eventForm);
      this.authservice.creatEvent(this.eventForm.value).subscribe(data => {
        console.log(data);
        this.msg = data.msg ;
        this.datasaved = true;
        this.eventForm.reset();
        this.submitted= false;
      });
    }
   
  }
  
  mask: any[] =
    // ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/, /\d/];

}
