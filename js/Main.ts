import * as d3 from "d3";
import { MainPage } from "./MainPage";
import { Template } from "./controles/template";

let prop_svg_contenedor_template: d3.Selection<any, any, any, any> = null;
export namespace Main {
  export class main {
    constructor() {
      MainPage.prop_contenedor_principal = d3
        .select("body")
        .append("div")
        .style("width", "100%")
        .style("height", "100%");
      MainPage.svg_top_parent = Template.fn_create_svg_parent_top(
        MainPage.prop_contenedor_principal
      );
      MainPage.prop_template_login = Template.fun_main({
        el_content: MainPage.prop_contenedor_principal,
        prop_height_footer: 0,
        prop_height_header: 0,
        prop_orientation: "portrait"
      });
      console.log("eesto", this);
      //comentario
    }
  }
}
