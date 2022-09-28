import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../Modelos/Appsettings';


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  public LosServicios : AppSettings= new AppSettings();  
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
