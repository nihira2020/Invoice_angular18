import { Routes } from '@angular/router';
import { ListComponent } from './component/list/list.component';
import { CreateComponent } from './component/create/create.component';
import { CalcComponent } from './component/calc/calc.component';

export const routes: Routes = [
    { path: 'invoice', component: ListComponent },
    { path: 'invoice/create', component: CreateComponent },
    { path: 'invoice/edit/:invoiceno', component: CreateComponent },
    {path: 'calc', component: CalcComponent }
];
