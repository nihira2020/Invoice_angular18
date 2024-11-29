import { Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CalcbtnComponent } from '../calcbtn/calcbtn.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calc',
  standalone: true,
  imports: [MatCardModule,MatButtonModule,MatInputModule,
    MatFormFieldModule,
    CalcbtnComponent,FormsModule],
  templateUrl: './calc.component.html',
  styleUrl: './calc.component.css'
})
export class CalcComponent {
  height=0;
  width=0;
  receiveddata=0;

  getdata(data:number){
    this.receiveddata=data;
  }
  

}
