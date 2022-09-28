import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.css']
})
export class ContenedorComponent implements OnInit {

  constructor(private elservicio:ServiciosService,private router:Router) { }

  ngOnInit(): void {
  }

  cerrarsesion(){
    this.elservicio.deletesession();
    this.router.navigate(["/Login"])
  }
}
