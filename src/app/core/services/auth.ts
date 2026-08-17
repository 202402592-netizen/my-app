import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn:'root',
})
export class AuthService {
    private currentUserSubject:BehaviorSubject<User |null>;
    public currentUser:Observable<User |null>;
    private mockUser:User[]=[
        {
          id:1,
          email:'admin@store.come',
          password:'admin123',
          name:'Admin User',
          role:'admin',
        },
        {
          id:1,
          email:'user@store.come',
          password:'user123',
          name:'Regular User',
          role:'user',
        }
    ]
    constructor(private router:Router){
            const storedUser = localStorage.getItem('currentUser');
            this.currentUserSubject=new BehaviorSubject<User |null>(
                storedUser ?JSON.parse(storedUser) :null
            );
            this.currentUser=this.currentUserSubject.asObservable();
    }
    public get currentUserValue():User |null{
        return this.currentUserSubject.value;
    }
    login(email:string,passward:string):Observable<User |null>{
           return new Observable(Observer=>{
            const user=this.mockUser.find(u=>u.email && u.password ===passward);
            if(user){
                const token=btoa('${user.email}:${Date.now()}');
                const userWithToken={...user,token};
                delete userWithToken.password;
                localStorage.setItem('currentUser',JSON.stringify(userWithToken));
                localStorage.setItem('token',token);
                this.currentUserSubject.next(userWithToken);
                Observer.next(userWithToken);
            }
            Observer.complete();
           })
    }
    logout():void{
       localStorage.removeItem('currentUser');
       localStorage.removeItem('token');
       this.currentUserSubject.next(null);
       this.router.navigate(['/login']);
    }
    isAuthenticated():boolean{
        return !! this.currentUserValue;
    }
     isAdmin():boolean{
        return this.currentUserValue?.role ==='admin';
    }
    getToken(): string| null{
      return localStorage.getItem('token');
    }
}