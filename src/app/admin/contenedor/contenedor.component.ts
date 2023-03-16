import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.css']
})
export class ContenedorComponent implements OnInit {
  public tabindex:number=0;
  public elusuario:any;
  constructor(private elservicio:ServiciosService,private router:Router) { }

  ngOnInit(): void {
    this.elusuario = this.elservicio.getsession();
  }

  cerrarsesion(){
    
    this.router.navigate(["/Login"])

   
    console.log(this.elusuario)
  }

  ventascli(){
    this.elservicio.tocoventas.next(true);
  }

  pedidoscli(){
    this.elservicio.tocoPedidos.next(true);
  }
}
