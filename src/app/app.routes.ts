import { Routes } from '@angular/router';
import { Home } from './shared/components/home/home';
import { CartComponent } from './features/cart/cart/cart'
import { ProductsDatalis } from './features/products/products-datalis/products-datalis';
import { ProductsList } from './features/products/products-list/products-list';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { ProductFrom } from './features/admin/product-from/product-from';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
    {
        path:'',
        component:Home
    },
    {
        path:'home',
        component:Home
    },
    {
        path:'cart',
        component:CartComponent,
        canActivate:[authGuard]
    },
    {
        path:'products',
        component:ProductsList,
         canActivate:[authGuard]
    },
    {
        path:'products/:id',
        component:ProductsDatalis,
         canActivate:[authGuard]
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'admin',
        canActivate:[authGuard,adminGuard],
        children:[
            {
                path:'dashboard',
                component:Dashboard
            },
            {
               path:'product/add',
        component:ProductFrom 
            },
            {
               path:'product/edit/:id',
        component:ProductFrom 
            },
            {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
    },
        ]
    },
    {
        path:'404',
        loadComponent:()=>import('./shared/components/not-found/not-found').then(m=>m.NotFound)
    },
    {
        path:'**',
        redirectTo:'/404'
    },
];
