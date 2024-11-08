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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, CommonModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit, OnDestroy {

  invoiceList: Invoice[] = [];
  subscription = new Subscription();
  displayedColumns: string[] = ['id', 'name', 'address', 'nettotal', 'action'];
  displayedColumnsFilter: string[] = ['id-filter', 'name-filter', 'address-filter', 'nettotal-filter'];
  filterValues = {
    id: '', name: '', address: '', nettotal: ''
  }
  globalFilter = '';
  dataSource!: MatTableDataSource<Invoice>;
  constructor(private service: InvoiceService, private router: Router,
    private toastr: ToastrService
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
      this.dataSource.filterPredicate = this.customFilterPredicate()
    })
    this.subscription.add(sub);
  }

  Addnewinvoivce() {
    this.router.navigateByUrl('invoice/create')
  }
  EditInvoice(invoiceno: any) {
    this.router.navigateByUrl('invoice/edit/' + invoiceno)
  }
  RemoveInvoice(invoiceno: any) {
    if (confirm('Do you want delete this Invoice?')) {
      this.service.RemoveInvoice(invoiceno).subscribe(item => {
        this.toastr.success('Deleted successfully.')
        this.Loadallinvoice();
      })
    }
  }

  filterChange(filter: string, event: any) {
    if (filter == 'id' || filter == 'name' || filter == 'nettotal' || filter === 'address')
      this.filterValues[filter] = event.target.value.trim().toLowerCase()
    this.dataSource.filter = JSON.stringify(this.filterValues)
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: Invoice, filter: string): boolean => {
      let globalMatch = !this.globalFilter;
      if (this.globalFilter) {
        globalMatch = data.id.toString().trim().toLowerCase()
          .indexOf(this.globalFilter.toLowerCase()) !== -1
      }
      if (!globalMatch) {
        return false;
      }

      let searchString = JSON.parse(filter);
      return data.id.toString().trim().toLowerCase().indexOf(searchString.id.toLowerCase()) !== -1 &&
        data.customername.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1 &&
        data.nettotal.toString().trim().toLowerCase().indexOf(searchString.nettotal.toLowerCase()) !== -1 &&
        data.deliveryaddress.toString().trim().toLowerCase().indexOf(searchString.address.toLowerCase()) !== -1
    }
    return myFilterPredicate;
  }

}
