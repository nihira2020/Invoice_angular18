import { Component, computed, effect, EventEmitter, input, Input, OnChanges, output, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calcbtn',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './calcbtn.component.html',
  styleUrl: './calcbtn.component.css'
})
export class CalcbtnComponent {

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.Squarevalue = this.height * this.width;
  // }

  // @Input({ required: true }) height: number = 0;
  // @Input({ required: true }) width: number = 0;

  //@Output() transferdata=new EventEmitter<number>()
  constructor(){
    effect(()=>this.transferdata.emit(this.Squarevalue()))
  }
  transferdata=output<number>({alias:'confirmdata'});

  height=input.required<number>({alias:'ht'})
  width=input(0)

  //Squarevalue = this.height * this.width;

  Squarevalue=computed(()=>this.height() * this.width())

  SendData(){
   this.transferdata.emit(this.Squarevalue())
  }
}
