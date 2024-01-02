import { string } from '@amcharts/amcharts4/core';
import { formatDate } from '@angular/common';
import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EldialogComponent } from 'src/app/componentes/eldialog/eldialog.component';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.css']
})
export class SalidasComponent implements OnInit {

  public elfechas:string="";
  public lafecha:Date=new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
  public lafecha2:Date=new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
  public Descripcion:string="";
  public Valor:number=0;
  public escajaa:boolean=true;
  public escaja:number=0;
  public laimagen:any;
  public listasalida:Array<any>=new Array<any>();
  constructor(private servicios:ServiciosService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.escaja=1;  
    this.lafecha= new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
    // this.lafecha = new Date(this.lafecha.getFullYear()+"-"+(this.lafecha.getUTCMonth()+1)+"-"+this.lafecha.getDate())
    this.llenargrilla();

    this.servicios.tocosalida.subscribe(x =>{
      this.llenargrilla();
    })
  }

  handleFileInput(entrada:any){
    //this.laimagen = entrada.target.files[0];    
    this.laimagen = entrada.target.files[0];    
      
  }

  escajaaF(){
    if(this.escajaa){
      this.escaja=1;      
    }else{
      this.escaja=0;
    }
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
    
    this.servicios.getSalidas(this.lafecha.getFullYear()+"-"+(this.lafecha.getMonth()+1)+"-"+this.lafecha.getDate()+"T00:00:00"
    ,this.lafecha2.getFullYear()+"-"+(this.lafecha2.getMonth()+1)+"-"+this.lafecha2.getDate()+"T00:00:00" ).subscribe( y=>{
      
      this.listasalida = y;
    })
  }

  cambio(evento:any){
    console.log(evento);
    this.lafecha = evento;
  }

  buscar(){
    
    this.llenargrilla();
  }

  crear(){
    let envio =null;

    if(this.laimagen != null){
      
      envio ={
        Descripcion:this.Descripcion,Valor:this.Valor,
        Fecha:formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'),EsCaja:this.escaja,Imagen: this.laimagen.name
      }
    }else{
      envio ={
        Descripcion:this.Descripcion,Valor:this.Valor,
        Fecha:formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'),EsCaja:this.escaja
      }
    }
    
    this.servicios.save_salidas(envio).subscribe(x =>{
      if(x.IdPedido != null && x.IdPedido > 0){
        
        if(this.laimagen != null){
          this.servicios.save_imagen2(this.laimagen).subscribe(x=>{
          }) 
        }
        
  
        const dialogRef = this.dialog.open(EldialogComponent, {
          maxWidth: '100vw',
          minWidth: '40%',
          panelClass: 'my-panel',
          data: {  
            tipo:0,mensaje:"Salida creada con exito."          
          }               
        });
        
        this.llenargrilla();
      }else{
        const dialogRef = this.dialog.open(EldialogComponent, {
          maxWidth: '100vw',
          minWidth: '40%',
          panelClass: 'my-panel',
          data: {  
            tipo:0,mensaje:"Error comuniquese con el administrador."          
          }               
        });
      }
     
    })
  }

}
