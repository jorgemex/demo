import * as d3 from "d3";
import { MainPage } from "./MainPage";
export namespace Main {
  export class main {
    constructor() {
      MainPage.prop_contenedor_principal = d3.select("body");
      console.log("eesto", this);
      //comentario
    }
  }
}
