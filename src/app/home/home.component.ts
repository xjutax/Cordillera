import { LinearGradient } from '@amcharts/amcharts5';
import { Component, HostListener, OnInit } from '@angular/core';
import gsap from "gsap";
import * as AOS from 'aos';

function hello() {
  alert('Hello!!!');
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  
  ngOnInit(): void {
    AOS.init( {offset: 120,
    delay: 200,duration: 1000, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    });
    window.addEventListener('load',AOS.refresh);
    gsap.to('.logo',3,{y:-70});
    gsap.fromTo('.text',{opacity:0},{opacity:1,duration:3});
    //gsap.to('.content-images',2,{opacity:0});
    
  }

  @HostListener("window:scroll", ['$event'])
  doSomethingOnWindowsScroll($event:Event){
    
    var posicion = window.pageXOffset || document.documentElement.scrollTop;

    var elemento1 = document.getElementById("hambur");
    if(elemento1 != null){
      elemento1.style.bottom = posicion * 0.23 + "px";
    }

  }


}
