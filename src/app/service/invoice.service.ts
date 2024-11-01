import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { Tax } from '../model/tax';
import { Product } from '../model/product';
import { Invoice } from '../model/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  Getallcustomers() {
    return this.http.get<Customer[]>("http://localhost:3000/customer")
  }
  Getcustomer(customerid: string) {
    return this.http.get<Customer>("http://localhost:3000/customer/" + customerid)
  }

  Getalltaxes() {
    return this.http.get<Tax[]>("http://localhost:3000/tax")
  }
  Gettax(taxcode: string) {
    return this.http.get<Tax>("http://localhost:3000/tax/" + taxcode)
  }

  Getallproducts() {
    return this.http.get<Product[]>("http://localhost:3000/product")
  }
  Getproduct(productcode: string) {
    return this.http.get<Product>("http://localhost:3000/product/" + productcode)
  }

  // Invoice related

  CreateInvoice(data: Invoice) {
    return this.http.post("http://localhost:3000/invoice", data);
  }
  UpdateInvoice(data: Invoice) {
    return this.http.put("http://localhost:3000/invoice/"+data.id, data);
  }
  GetallInvoice() {
    return this.http.get<Invoice[]>("http://localhost:3000/invoice");
  }
  GetInvoice(invoiceno:string) {
    return this.http.get<Invoice>("http://localhost:3000/invoice/"+invoiceno);
  }
  RemoveInvoice(invoiceNo:string) {
    return this.http.delete("http://localhost:3000/invoice/"+invoiceNo);
  }

}
