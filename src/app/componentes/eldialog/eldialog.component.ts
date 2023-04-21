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
  public mostrarCaja:boolean=false;
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
      }
    })
  }

  closecaja(){
    this.dialogRef.close();
  }

  CerrarCaja(){
    this.elproducto.Fecha = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500');   
    this.servicios.save_caja(this.elproducto).subscribe( x =>{        
      this.dialogRef.close();
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
