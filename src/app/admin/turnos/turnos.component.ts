import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  public lafecha:Date=new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
  public lafecha2:Date=new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
  public Descripcion:string="";
  public Valor:number=0;
  public listasalida:Array<any>=new Array<any>();
  public elfechas:string="";
  public listaturnoT:Array<any>=new Array<any>();
  constructor(private servicios:ServiciosService,public dialog: MatDialog) { }

  ngOnInit(): void {
    
    this.llenargrilla();
  }

  llenargrilla(){
    
    if(this.elfechas== null || this.elfechas==undefined || this.elfechas==""){
      this.lafecha = new Date(this.lafecha.getFullYear(),(this.lafecha.getMonth()),this.lafecha.getDate(),0,0,0);
    }else{
      this.lafecha = new Date(this.elfechas+'T00:00:00')
    }
    
    this.lafecha = new Date(this.lafecha.getFullYear(),(this.lafecha.getMonth()),this.lafecha.getDate(),0,0,0);
    this.lafecha2=new Date(this.lafecha.getFullYear(),(this.lafecha.getMonth()),this.lafecha.getDate(),0,0,0);
    this.lafecha2.setDate(this.lafecha.getDate()+1)
    
    this.servicios.getTurnoDia(this.lafecha.getFullYear()+"-"+(this.lafecha.getMonth()+1)+"-"+this.lafecha.getDate()+"T00:00:00"
    ,this.lafecha2.getFullYear()+"-"+(this.lafecha2.getMonth()+1)+"-"+this.lafecha2.getDate()+"T00:00:00" ).subscribe( y=>{
      this.listasalida = y;
    })

    this.servicios.ListarTurnosTotal().subscribe( y=>{
      this.listaturnoT = y;
    })
  }

  cambio(evento:any){
    console.log(evento);
    this.lafecha = evento;
  }

  buscar(){
    
    this.llenargrilla();
  }


}
