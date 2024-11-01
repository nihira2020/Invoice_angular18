import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvoiceService } from '../../service/invoice.service';
import { Invoice } from '../../model/invoice';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule,CommonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit, OnDestroy {

  invoiceList: Invoice[] = [];
  subscription = new Subscription();
  displayedColumns: string[] = ['id', 'name', 'address', 'nettotal', 'action'];
  dataSource!: MatTableDataSource<Invoice>;
  constructor(private service: InvoiceService, private router: Router,
    private toastr:ToastrService
  ) {

  }
  ngOnInit(): void {
    this.Loadallinvoice();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  Loadallinvoice() {
    let sub = this.service.GetallInvoice().subscribe(item => {
      this.invoiceList = item;
      this.dataSource = new MatTableDataSource(this.invoiceList)
    })
    this.subscription.add(sub);
  }

  Addnewinvoivce() {
    this.router.navigateByUrl('invoice/create')
  }
  EditInvoice(invoiceno:any){
   this.router.navigateByUrl('invoice/edit/'+invoiceno)
  }
  RemoveInvoice(invoiceno:any){
   if(confirm('Do you want delete this Invoice?')){
     this.service.RemoveInvoice(invoiceno).subscribe(item=>{
        this.toastr.success('Deleted successfully.')
        this.Loadallinvoice();
     })
   }
  }

}
