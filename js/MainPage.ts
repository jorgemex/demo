import { Template } from "./controles/template";
import { Carga } from "./controles/control_svg_carga";
//import { namespace } from "d3";

export namespace MainPage {
  export let prop_contenedor_principal: d3.Selection<any, any, any, any>;
  export let prop_cargaLogin: Carga.iObjetoControl = null;
}
