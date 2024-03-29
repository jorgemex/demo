import * as d3 from "d3";
import { MainPage } from "../MainPage";
import { Template } from "../controles/template";
import { Carga } from "../controles/control_svg_carga";
import { Lista } from "../controles/control_svg_lista";
import { Entidades } from "../general/Entidades";
import { D3Utils } from "../general/Utils";
import { RutaPuntos } from "../data/RutaPuntos";
import { json, geoAzimuthalEquidistant, keys, values } from "d3";

export namespace infoEntrega {
  let prop_content_infoentrega: d3.Selection<any, any, any, any> = null;
  let prop_ejecutandoClick: boolean = false;
  let prop_listaControlD3: Lista.iObjetoControl = null;
  //
  let prop_g_detalles_InfoEntrega: d3.Selection<any, any, any, any> = null;
  let listRutaPuntos: Array<Entidades.IRutaPunto>;

  let background_prop_item = "#ffffff";
  let lastVisited = 0;

  export function fn_createviewinfo() {
    if (MainPage._template_infoentrega == null) {
      MainPage._template_infoentrega = Template.fun_main({
        el_content: MainPage.prop_contenedor_principal,
        prop_height_footer: 0,
        prop_height_header: 50,
        prop_orientation: "portrait"
      });

      MainPage.prop_content_template = MainPage._template_infoentrega.fun_get_g_content();

      let g_contentCarga = MainPage._template_infoentrega
        .fun_get_g_content()
        .append("g")
        .classed("g_content_crga", true);
      fn_crearControlCarga(g_contentCarga);
    }
    let g_header_infoEntrega = MainPage._template_infoentrega
      .fun_get_g_header()
      .append(() =>
        D3Utils.fn_crear_encabezado_atras(() => {
          window.location.assign("#DsH");
        }).node()
      );
    g_header_infoEntrega.select(".title-text").text("Informacion de Entrega");

    //body_screen
    prop_content_infoentrega = d3.select(
      document.createElementNS("http://www.w3.org/2000/svg", "g")
    );
    prop_content_infoentrega.classed("g_content_infoentrega", true);

    let g_content_titles = prop_content_infoentrega
      .append("g")
      .attr("width", MainPage._template_infoentrega.fun_get_width() - 20)
      .attr("transform", "translate(10,5)");

    //dowpdown
    let g_content_dropDown = prop_content_infoentrega.append("g");

    g_content_dropDown
      .append("rect")
      .attr("width", 360)
      .attr("height", 500)
      .attr("ry", 10)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      //.attr("clip-path", "url(#clips)")
      .attr("contenteditable", true)
      .attr("transform", "translate(20,50)");

    let g_contentbuton = prop_content_infoentrega
      .append("g")
      .on("click", function() {
        alert("seguro?");
      });
    g_contentbuton
      .attr("transform", "translate(80, 560)")
      .append("rect")
      .attr("width", 100)
      .attr("height", 30)
      .attr("ry", 10)
      .attr("fill", "green");

    g_contentbuton
      .append("text")
      .text("Aceptar")
      .attr("x", 20)
      .attr("y", 20);
    let form = prop_content_infoentrega
      .append("g")
      .attr("transform", "translate(100,400)");

    // form
    //   .append("rect")
    //   .attr("width", 200)
    //   .attr("height", 100)
    //   .attr("ry", 10)
    //   .attr("fill", "red");

    // let inp = form
    //   .append("foreignObject")
    //   .attr("width", 200)
    //   .attr("height", 50)
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .append("xhtml:body")
    //   .append("textarea")
    //   .style("font-size", "20px");

    g_content_titles
      .append("g")
      .append("rect")
      .attr("width", 100)
      .attr("height", 30)
      .attr("ry", 10)
      .attr("fill", "orange")
      .attr("transform", "translate(200, 560)");

    g_content_titles
      .append("text")
      .text("Nombre *************************")
      .attr("x", "15")
      .attr("y", "30")
      .style("fill", D3Utils.prop_color_primary)
      .style("font-size", "18")
      .style("font-weight", "bold");
    //lista de productos

    d3.json("js/data/actual.json").then(function(data: any) {
      var dats;
      var id: any;
      for (var i = 0; i < data.length; i++) {
        dats = data[i]["nombre"];
        id = data[i]["Id"];
        g_content_dropDown
          .append("rect")
          .attr("width", 340)
          .attr("height", 30)
          .attr("stroke-width", 0.5)
          .attr("stroke", "#616161")
          .on("click", function() {
            console.log("id", id);
          })
          .attr("transform", "translate(30," + (60 + i * 30) + ")");
        g_content_dropDown
          .append("text")
          .text(dats)
          .attr("x", 30)
          .attr("y", 80 + i * 30)
          .style("fill", "#000000")
          .style("font-size", "18")
          .style("font-weight", "bold");
      }
    });
    MainPage.prop_content_template.append(() =>
      prop_content_infoentrega.node()
    );

    //lista de informacion de entrega
    let g_content_client = prop_content_infoentrega
      .append("g")
      .attr("transform", "translate(0,50)");
    prop_g_detalles_InfoEntrega = g_content_client;
  }
  function fn_actualizarVentana() {
    MainPage._template_infoentrega.prop_element.setAttribute(
      "style",
      "display: block;"
    );
    // fn_load_inforEntrega();
  }
  function fn_crearControlCarga(parent: d3.Selection<any, any, any, any>) {
    if (MainPage.prop_cargaLogin == null) {
      MainPage.prop_cargaLogin = Carga.fun_main({
        prop_diametro: 150,
        width: MainPage._template_infoentrega.fun_get_width(),
        height: MainPage._template_infoentrega.fun_get_height_content(),
        opacity: 0.7,
        background: "#ffffff",
        color: "#000000",
        el_contenedor_padre: parent
      });
    }
  }
  export function fn_destroyinfo() {
    prop_listaControlD3 = null;
    prop_g_detalles_InfoEntrega = null;

    MainPage._template_infoentrega.prop_element.remove();
    MainPage._template_infoentrega = null;
  }
}
