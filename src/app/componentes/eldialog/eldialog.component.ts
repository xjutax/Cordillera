import { formatDate } from '@angular/common';
import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-eldialog',
  templateUrl: './eldialog.component.html',
  styleUrls: ['./eldialog.component.css']
})
export class EldialogComponent implements OnInit {
  public opcion:number=1;
  public tipografica:number=0;
  public params:any;
  public MensajeDinamico:string="";
  public elproducto:any;
  public listatipos:Array<any>=new Array<any>();
  public laimagen:any;

  public lacaja:any=null;
  public lacaja2:any=null;
  public mostrarCaja:boolean=false;

  public salidas:number=0;
  public efectivoo:number=0;
  public transfrenciaa:number=0;
  public Tarjetaa:number=0;
  public valservicioo:number=0;
  public valdescuentoo:number=0;
  public valorrealcaja:number=0;
  public descuadree:number=0;

  public ventasnetas:number=0;
  public totallicitado:number=0;
  public ventasbrutas:number=0;

  public lacerrarcaja:boolean=false;
  constructor(private servicios:ServiciosService,public dialogRef: MatDialogRef<EldialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {    
    this.params = this.data;  
    this.opcion = this.params.tipo;
    this.MensajeDinamico = this.params.mensaje;
    this.elproducto= this.data.producto;

    this.servicios.GetTiposAll().subscribe(x =>{      
      this.listatipos = x;            
    })
    let lafecha = new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));

    this.servicios.getcajahoy(lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T00:00:00"
    ,lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T23:59:59" ).subscribe(x =>{      
      this.lacaja = x;     
      if(x != null && x.length>0){
        this.mostrarCaja=true;
        this.elproducto = x[0];
        if(this.elproducto.EfectivoReal > 0){
          this.lacerrarcaja = true;
          
          this.totallicitado = this.elproducto.TotalLicitado;
          this.ventasbrutas = (this.elproducto.VentasBrutas==null)?0:this.elproducto.VentasBrutas;
          this.ventasnetas = this.elproducto.VentasNetas;
          this.servicios.getcajacierre1(lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T00:00:00"
          ,lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T23:59:59" ).subscribe(y =>{      
            this.lacaja2 = y;    
            
            this.salidas = (y[0].Salidas==null)?0: y[0].Salidas;

            y.forEach((element2:any) => {
              this.valdescuentoo += Number(element2.ValDescuento)
              this.valservicioo += Number(element2.ValServicio)
              if(element2.TipoPago=="0"){
                this.Tarjetaa = element2.ValorNeto
              }
              if(element2.TipoPago=="1"){
                this.efectivoo = element2.ValorNeto
                this.valorrealcaja = element2.Valor
              }
              if(element2.TipoPago=="2"){
                this.transfrenciaa = element2.ValorNeto
              }             
              
            });  
            
            this.descuadree = Number(this.elproducto.EfectivoReal)-this.valorrealcaja;
            if( this.descuadree < 0){
              this.descuadree =  this.descuadree*(-1)
            }
          })
        }
      }
    })
  }

  closecaja(){
    this.dialogRef.close();
  }

  CerrarCaja(){
    this.elproducto.Fecha = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500');   

    let lafecha = new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
    this.servicios.getcajacierre1(lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T00:00:00"
    ,lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T23:59:59" ).subscribe(y =>{      
      this.lacaja2 = y;    
      this.salidas = y[0].Salidas   

      y.forEach((element2:any) => {
        
        this.valdescuentoo += Number(element2.ValDescuento)
        this.valservicioo += Number(element2.ValServicio)
        if(element2.TipoPago=="0"){
          this.Tarjetaa = element2.ValorNeto
        }
        if(element2.TipoPago=="1"){
          this.efectivoo = element2.ValorNeto
          this.valorrealcaja = element2.Valor
        }
        if(element2.TipoPago=="2"){
          this.transfrenciaa = element2.ValorNeto
        }             
        
      });  
      
      this.descuadree = Number(this.elproducto.EfectivoReal)-this.valorrealcaja;
      if( this.descuadree < 0){
        this.descuadree =  this.descuadree*(-1)
      }

      this.elproducto.ValorEfectivo = (this.efectivoo==null)?0:this.efectivoo;
      this.elproducto.Salidas = (this.salidas==null)?0:this.salidas;
      this.elproducto.EfectivoCaja = (this.efectivoo==null)?0:this.efectivoo;
      this.elproducto.Descuadre = (this.descuadree==null)?0:this.descuadree;
      this.elproducto.Descuento =( this.valdescuentoo==null)?0:this.valdescuentoo;
      this.elproducto.Impuestos = (this.valservicioo==null)?0:this.valservicioo;

      this.elproducto.Tarjeta = (this.Tarjetaa==null)?0:this.Tarjetaa;
      this.elproducto.Transferencia = (this.transfrenciaa==null)?0:this.transfrenciaa;
      this.elproducto.Impresion=false;
      console.log(this.elproducto)
      
      this.servicios.save_caja(this.elproducto).subscribe( x =>{        
        this.dialogRef.close();
      })
    })

    
    
  }

  handleFileInput(entrada:any){
    this.laimagen = entrada.target.files[0];    
    this.servicios.save_imagen(entrada.target.files[0]).subscribe(x=>{
    })   
  }

  AbrirCaja(){    
    this.elproducto.Fecha = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500');
    this.servicios.save_caja(this.elproducto).subscribe( x =>{        
      this.dialogRef.close();
    })
  }

  imprimir(){    
      this.elproducto.Impresion=true;
     
      this.servicios.save_caja(this.elproducto).subscribe( x =>{        
        this.dialogRef.close();
      })
  }
  
  
  aceptarTipoF(){
    this.dialogRef.close({resultado:true,data:this.params,otro:this.tipografica});
  }

  aceptarG(){
    this.dialogRef.close();
  }
  

  ModificarProd(){
    if(this.opcion==2){
      if(this.laimagen !=null){
        this.elproducto.Imagen =this.servicios.LosServicios.API+"/assets/img/"+this.laimagen.name;
      }
      this.servicios.update_producto(this.elproducto).subscribe( x =>{        
        this.dialogRef.close();
      })
    }else{     
      this.servicios.update_config(this.elproducto).subscribe( x =>{      
        this.dialogRef.close();
      })
    }   
  }


}
