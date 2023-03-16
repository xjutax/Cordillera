import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../Modelos/Appsettings';


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  public LosServicios : AppSettings= new AppSettings();  
  public tococanasta:Subject<boolean> =new Subject<boolean>;
  public tocoventas:Subject<boolean> =new Subject<boolean>;
  public tocoPedidos:Subject<boolean> =new Subject<boolean>;
  public cerrarventanas:Subject<boolean> =new Subject<boolean>;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(private http: HttpClient) {     
  }

  Loguear(usuario:string,contraseña:string): Observable<any>{    
    let elviaje = {NombreUsuario:usuario,PasswordUsuario:contraseña};    
    return this.http.post<any>(this.LosServicios.API+"/Login.php", elviaje, this.httpOptions);
  }

  getSedes(): Observable<any>{        
    return this.http.get<any>(this.LosServicios.API+"/GetSedes.php", this.httpOptions);
  }

  saveTurno(IdUsuario:number,llegada:boolean,FechaIngreso2:string,MedioTurno:boolean,Puesto:number): Observable<any>{   
    let envio={IdUsuario:IdUsuario,llegada:llegada,FechaIngreso2:FechaIngreso2,MedioTurno:MedioTurno,Puesto:Puesto};     
    return this.http.post<any>(this.LosServicios.API+"/save_turno.php", envio,this.httpOptions);
  }

  update_producto(entrada:any): Observable<any>{        
    return this.http.post<any>(this.LosServicios.API+"/update_producto.php", entrada,this.httpOptions);
  }

  save_imagen(entrada:File): Observable<any>{       
    const endpoint ='url'
    const formData = new FormData();
          formData.append('image', entrada, entrada.name);
    
    const headers = new HttpHeaders();
          headers.append('Content-Type', 'multipart/form-data');
          headers.append('Accept', 'application/json');
  
    return this.http
      .post<any>(this.LosServicios.API+"/save_imagen.php", formData, { headers })
  }

  GetTiposAll(): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/listarTipoAll.php", this.httpOptions);
  }

  mostrarProductosALL(): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/mostrarProductosALL.php", this.httpOptions);
  }

  GetParametros(): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/GetParametros.php", this.httpOptions);
  }

  getSalidas(fecha1:string,fecha2:string): Observable<any>{   
    let envio ={
      fecha1:fecha1,fecha2:fecha2
    } 
    return this.http.post<any>(this.LosServicios.API+"/getSalidas.php",envio, this.httpOptions);
  }

  getHIstorial(fecha1:string,fecha2:string): Observable<any>{   
    let envio ={
      fecha1:fecha1,fecha2:fecha2
    } 
    return this.http.get<any>(this.LosServicios.API+"/listar_historial.php?fecha1="+fecha1+"&fecha2="+fecha2, this.httpOptions);
  }

  getTurnoDia(fecha1:string,fecha2:string): Observable<any>{       
    return this.http.get<any>(this.LosServicios.API+"/getTurnoDia.php?fecha1="+fecha1+"&fecha2="+fecha2, this.httpOptions);
  }

  GetUsuarios(): Observable<any>{       
    return this.http.get<any>(this.LosServicios.API+"/GetUsuarios.php", this.httpOptions);
  }

  mostrarInventarioALL(): Observable<any>{       
    return this.http.get<any>(this.LosServicios.API+"/mostrarInventarioALL.php", this.httpOptions);
  }  

  ListarTurnosTotal(): Observable<any>{       
    return this.http.get<any>(this.LosServicios.API+"/ListarTurnosTotal.php", this.httpOptions);
  }
  
  listar_salidaventas(entrada:number,fecha1:string,fecha2:string): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/listar_salidaventas.php?Tipo="+entrada+"&Fecha="+fecha1+"&Fecha1="+fecha2, this.httpOptions);
  }

  listar_pedidosP(): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/listar_pedidosP.php", this.httpOptions);
  }
  
  savePedido(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/save_task.php",envio, this.httpOptions);
  }

  save_detalle(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/save_detalle.php",envio, this.httpOptions);
  }

  save_usuario(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/save_usuario.php",envio, this.httpOptions);
  }

  save_salidas(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/save_salidas.php",envio, this.httpOptions);
  }

  update_pedido(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/update_pedido.php",envio, this.httpOptions);
  }

  update_config(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/update_config.php",envio, this.httpOptions);
  }

  update_detalle(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/update_detalle.php",envio, this.httpOptions);
  }

  Facturar(envio:any): Observable<any>{    
    return this.http.post<any>(this.LosServicios.API+"/Facturar.php",envio, this.httpOptions);
  }

  GetPedido(entrada:number): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/GetPedido.php?Id="+entrada, this.httpOptions);
  }

  listar_ventas(entrada:number,fecha1:string,fecha2:string): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/listar_ventas.php?Tipo="+entrada+"&Fecha="+fecha1+"&Fecha1="+fecha2, this.httpOptions);
  }

  listar_ventasTotal(entrada:number,fecha1:string,fecha2:string): Observable<any>{    
    return this.http.get<any>(this.LosServicios.API+"/listar_ventasTotal.php?Tipo="+entrada+"&Fecha="+fecha1+"&Fecha1="+fecha2, this.httpOptions);
  }

  
  
  addcanasta(entrada:any){    
    let variable = sessionStorage.getItem("canasta");
    if(variable != null){
      let elarray = JSON.parse(variable) as Array<any>;
      let elobjeto = elarray.find(x => x.Id==entrada.Id)
      if(elobjeto != null){
        elobjeto.Cantidad = Number(elobjeto.Cantidad)+1;       
      }else{
        entrada.Cantidad=1;
        elobjeto = entrada;       
      }
      elarray = elarray.filter( x =>x.Id!=entrada.Id)
      elarray.push(elobjeto);
      sessionStorage.setItem("canasta", JSON.stringify(elarray))
    }else{
      let elarray = new Array<any>();
      if(entrada.Cantidad == undefined || entrada.Cantidad==0){
        entrada.Cantidad =1;     
      }      
      elarray.push(entrada);
      sessionStorage.setItem("canasta", JSON.stringify(elarray))
    }
    this.tococanasta.next(true);
  }

  setcanasta(entrada:any){
    sessionStorage.removeItem("canasta");
    sessionStorage.setItem("canasta", JSON.stringify(entrada))
  }

  deletecanasta(entrada:any){    
    let variable = sessionStorage.getItem("canasta");
    if(variable != null){
      let elarray = JSON.parse(variable) as Array<any>;
      let elobjeto = elarray.find(x => x.Id==entrada.Id)
      if(elobjeto != null){
        if(elobjeto.Cantidad>0){       
          elobjeto.Cantidad = Number(elobjeto.Cantidad)-1;
        }
        
      }
      elarray = elarray.filter( x =>x.Id!=entrada.Id)
      elarray.push(elobjeto);
      sessionStorage.setItem("canasta", JSON.stringify(elarray))
    }
    this.tococanasta.next(true);
  }

  getcanasta(){
    let variable = sessionStorage.getItem("canasta");
    if(variable != null){
      return JSON.parse(variable);
    }
    
  }

  dropCanasta(){
    let variable = sessionStorage.removeItem("canasta");    
  }

  limpiarcanasta(){
    sessionStorage.removeItem("canasta");
  }

  savesession(entrada:any){
    sessionStorage.setItem("usuario", JSON.stringify(entrada));
  }

  getsession(){
    let variable = sessionStorage.getItem("usuario");
    if(variable != null){
      return JSON.parse(variable);
    }
    
  }

  deletesession(){
    sessionStorage.removeItem("usuario");
  }
  
}
