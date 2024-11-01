import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../service/invoice.service';
import { Customer } from '../../model/customer';
import { Tax } from '../../model/tax';
import { Product } from '../../model/product';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from '../../model/invoice';
import { InvoiceProducts } from '../../model/invoiceproducts';

@Component({
  selector: 'app-create',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule,
    MatIconModule, MatListModule, CommonModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit, OnDestroy {

  title = 'Create Invoice'
  customerlist: Customer[] = []
  taxlist: Tax[] = []
  productlist: Product[] = []
  subscription = new Subscription();
  invoiceproducts!: FormArray<any>
  invoiceproduct!: FormGroup<any>
  summarytotal = 0;
  summarytax = 0;
  summarynettotal = 0;
  custtaxtype = "Z";
  custtaxperc = 0;
  isEdit = false;
  keyvalue = '';


  constructor(private builder: FormBuilder, private router: Router,
    private service: InvoiceService, private toastr: ToastrService,
    private actroute: ActivatedRoute
  ) {

  }
  get invproducts() {
    return this.invoiceform.get("products") as FormArray;
  }
  ngOnInit(): void {
    this.Loadcustomer();
    this.Loadtax();
    this.Loadproducts();
    this.keyvalue = this.actroute.snapshot.paramMap.get('invoiceno') as string;
    if (this.keyvalue != null) {
      this.isEdit = true;
      this.title = 'Edit Invoice'
      this.populateeditdata(this.keyvalue);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  invoiceform = this.builder.group({
    invoiceno: this.builder.control({ value: '', disabled: true }),
    invoicedate: this.builder.control(new Date(), Validators.required),
    customerid: this.builder.control('', Validators.required),
    customername: this.builder.control(''),
    taxcode: this.builder.control(''),
    address: this.builder.control(''),
    total: this.builder.control(0),
    tax: this.builder.control(0),
    nettotal: this.builder.control(0),
    products: this.builder.array([])
  })

  SaveInvoice() {
    if (this.invoiceform.valid) {
      let _invoice: Invoice = {
        id: 0,
        customerid: this.invoiceform.value.customerid as string,
        customername: this.invoiceform.value.customername as string,
        deliveryaddress: this.invoiceform.value.address as string,
        invoicedate: this.invoiceform.value.invoicedate as Date,
        taxcode: this.invoiceform.value.taxcode as string,
        taxtype: this.custtaxtype,
        taxperc: this.custtaxperc,
        total: this.invoiceform.value.total as number,
        tax: this.invoiceform.value.tax as number,
        nettotal: this.invoiceform.value.nettotal as number,
        products: this.invoiceform.getRawValue().products as InvoiceProducts[]
      }
      if(this.isEdit){
        _invoice.id=parseInt(this.keyvalue);
        this.service.UpdateInvoice(_invoice).subscribe(item => {
          this.toastr.success('Update successfully.', 'Success');
          this.backtolist();
        })
      }else{
        this.service.CreateInvoice(_invoice).subscribe(item => {
          this.toastr.success('Created successfully.', 'Success');
          this.backtolist();
        })
      }
      
    }
  }

  populateeditdata(invoiceNo: string) {
    this.service.GetInvoice(invoiceNo).subscribe(item => {
      let editdata = item;
      let processcount = 0;
      if (editdata != null) {
        for (let i = 0; i < editdata.products.length; i++) {
          this.addnewproduct();
        }
        this.invoiceform.setValue({
          invoiceno: editdata.id.toString(),
          invoicedate: editdata.invoicedate ? new Date() : new Date(editdata.invoicedate),
          customerid: editdata.customerid,
          customername: editdata.customername,
          taxcode: editdata.taxcode,
          address: editdata.deliveryaddress,
          total: editdata.total,
          tax: editdata.tax,
          nettotal: editdata.nettotal,
          products: editdata.products
        })
        this.custtaxtype=editdata.taxtype;
        this.custtaxperc=editdata.taxperc;
        this.Summarycalculation();
      }
    })
  }

  Loadcustomer() {
    let sub1 = this.service.Getallcustomers().subscribe(item => {
      this.customerlist = item;
    })
    this.subscription.add(sub1);
  }
  Loadtax() {
    let sub1 = this.service.Getalltaxes().subscribe(item => {
      this.taxlist = item;
    })
    this.subscription.add(sub1);
  }
  Loadproducts() {
    let sub1 = this.service.Getallproducts().subscribe(item => {
      this.productlist = item;
    })
    this.subscription.add(sub1);
  }

  Customerchange(customerid: string) {
    let sub = this.service.Getcustomer(customerid).subscribe(item => {
      let _customer = item;
      if (_customer != null) {
        this.invoiceform.controls.address.setValue(_customer.address);
        this.invoiceform.controls.customername.setValue(_customer.name);
        this.invoiceform.controls.taxcode.setValue(_customer.taxcode);
        this.addnewproduct();
        this.Taxchange(_customer.taxcode);
      }
    })
    this.subscription.add(sub);
  }
  Taxchange(taxcode: string) {
    this.service.Gettax(taxcode).subscribe(item => {
      let _tax = item;
      if (_tax != null) {
        this.custtaxtype = _tax.type;
        this.custtaxperc = _tax.perc;
        this.Summarycalculation();
      }
    })
  }

  productchange(index: number) {
    this.invoiceproducts = this.invoiceform.get('products') as FormArray;
    this.invoiceproduct = this.invoiceproducts.at(index) as FormGroup;
    let productcode = this.invoiceproduct.get("productid")?.value;
    let sub = this.service.Getproduct(productcode).subscribe(item => {
      let _product = item;
      if (_product != null) {
        this.invoiceproduct.get("name")?.setValue(_product.name),
          this.invoiceproduct.get("price")?.setValue(_product.price)
        this.productcalulate(index);
      }
    })
    this.subscription.add(sub)
  }

  productcalulate(index: number) {
    this.invoiceproducts = this.invoiceform.get('products') as FormArray;
    this.invoiceproduct = this.invoiceproducts.at(index) as FormGroup;
    let qty = this.invoiceproduct.get("qty")?.value;
    let price = this.invoiceproduct.get("price")?.value;
    let total = qty * price;
    this.invoiceproduct.get("total")?.setValue(total);
    this.Summarycalculation();

  }

  Summarycalculation() {
    let array = this.invoiceform.getRawValue().products;
    let sumtotal = 0;
    let sumtax = 0;
    let sumnettotal = 0;

    array.forEach((x: any) => {
      sumtotal = sumtotal + x.total
    })

    // tax calculation
    if (this.custtaxtype == 'E') {
      if (this.custtaxperc > 0) {
        sumtax = (this.custtaxperc / 100) * sumtotal;
        sumnettotal = sumtotal + sumtax;
      }
    } else if (this.custtaxtype == 'I') {
      sumtax = sumtotal - (sumtotal * (100 / (100 + this.custtaxperc)))
      sumnettotal = sumtotal;

    } else {
      sumtax = 0
      sumnettotal = sumtotal;

    }

    this.invoiceform.get("total")?.setValue(sumtotal);
    this.invoiceform.get("tax")?.setValue(sumtax);
    this.invoiceform.get("nettotal")?.setValue(sumnettotal);

    this.summarytotal = sumtotal;
    this.summarytax = sumtax;
    this.summarynettotal = sumnettotal;

  }

  Deleteproduct(index: number) {
    if (confirm("Do you want to renove?")) {
      this.invproducts.removeAt(index);
      this.Summarycalculation();
    }
  }

  addnewproduct() {
    this.invoiceproducts = this.invoiceform.get('products') as FormArray;
    let customerid = this.invoiceform.value.customerid as string;
    if (this.isEdit) {
      this.invoiceproducts.push(this.Generaterow());
    } else {
      if (customerid != null && customerid != '') {
        this.invoiceproducts.push(this.Generaterow());
      } else {
        this.toastr.warning("Select customer then add products", "Please choose customer")
      }
    }


  }

  Generaterow() {
    return this.builder.group({
      productid: this.builder.control('', Validators.required),
      name: this.builder.control(''),
      qty: this.builder.control(1),
      price: this.builder.control(0),
      total: this.builder.control({ value: 0, disabled: true })
    })
  }

  backtolist() {
    this.router.navigateByUrl('/invoice');
  }



}
