import { Routes } from '@angular/router';
import { ListComponent } from './component/list/list.component';
import { CreateComponent } from './component/create/create.component';

export const routes: Routes = [
    { path: 'invoice', component: ListComponent },
    { path: 'invoice/create', component: CreateComponent },
    { path: 'invoice/edit/:invoiceno', component: CreateComponent }
];
