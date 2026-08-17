import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast{
    id:number;
    message:string;
    type:'success'| 'error'|'info'| 'warning';
} 

@Injectable({
    providedIn:'root',
})

export class ToastService {
    private toastsSubject= new BehaviorSubject<Toast[]>([]);
    public toasts$:Observable<Toast[]>=this.toastsSubject.asObservable();
    private nextId=1;

    show(message:string, type:'success'| 'error'|'info'| 'warning'='info'):void{
        const toast :Toast={
            id:this.nextId++,
            message,
            type
        };
        const currentToasts =this.toastsSubject.value;
        this.toastsSubject.next([...currentToasts,toast]);
        setTimeout(()=>{
            this.remove(toast.id)
        },3000);
    }
    success(message:string):void{
        this.show(message,'success');
    }
    error(message:string):void{
        this.show(message,'error');
    }
    info(message:string):void{
        this.show(message,'info');
    }
    warning(message:string):void{
        this.show(message,'warning');
    }
    remove(id:number):void{
        const currentToasts =this.toastsSubject.value;
        this.toastsSubject.next(currentToasts.filter(t=>t.id !==id));
    }
} 
