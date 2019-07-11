import * as d3 from "d3";
import { Entidades } from "../general/Entidades";
import { D3Utils } from "../general/Utils";
import { Map } from "d3";
import { MainPage } from "../MainPage";
import { Main } from "../Main";
import { Usuario } from "../data/Usuario";
import { Dashboard } from "./dashboard";

export namespace Menu {
  export interface iControlObject {
    content: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
    fn_Mostrar(): void;
    fn_Ocultar(): void;
  }
  export var confirm_dialog: d3.Selection<any, any, any, any> = null;
  export let mnu_content: d3.Selection<any, any, any, any> = null;
  export let mnu_opts: d3.Selection<any, any, any, any> = null;

  interface iProperties {
    el_g_contenedor?: d3.Selection<SVGGElement, {}, null, undefined>;
    prop_config?: iConfigMenu;
    prop_id_fila_seleccionada?: number;
    el_g_contenedor_items?: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
    prop_data?: Array<Entidades.ISubMenu>;
  }

  export interface iConfigMenu {
    content: d3.Selection<SVGGElement, {}, HTMLElement, {}>;
    width: number;
    height: number;
    widthItem?: number;
    heightItem?: number;
    nombreUsuario?: string;
    email?: string;
    fn_ClickMismoMenu?(hash: string): void;
  }

  export function fn_Init(config: iConfigMenu): iControlObject {
    var propiedades: iProperties = {};
    config.email = config.email ? config.email : "";
    config.nombreUsuario = config.nombreUsuario ? config.nombreUsuario : "";
    config.widthItem = config.widthItem ? config.widthItem : config.width - 85;
    config.heightItem = config.heightItem ? config.heightItem : 50;

    propiedades.prop_config = config;
    propiedades.prop_id_fila_seleccionada = 0;
    propiedades.prop_data = fn_CrearSubmenu().values();

    var g_menu = d3.select(
      document.createElementNS("http://www.w3.org/2000/svg", "g")
    );
    g_menu
      .classed("gMenuI", true)
      .style("pointer-events", "none")
      .attr("transform", "translate(0,0)");

    g_menu
      .append("rect")
      .classed("rect_menu_popup_m", true)
      .attr("width", config.width)
      .attr("height", config.height + 50)
      .style("fill", "#262626")
      .style("opacity", "0")
      .call(D3Utils.eventos.fun_agregar_click, function() {
        fn_Ocultar(propiedades);
      });

    var g_m = g_menu
      .append("g")
      .classed("gMenu", true)
      .style("display", "none")
      .attr("transform", "translate(-400,0)");

    var g_content = g_m.append("g");
    g_content
      .append("rect")
      .attr("width", config.width - 130)
      .attr("height", config.height + 50)
      .style("fill", "#262626");

    propiedades.el_g_contenedor = g_content;
    fn_InitComponentes(propiedades);

    config.content.append(() => g_menu.node());

    var obj_control: iControlObject = {
      content: g_menu,
      fn_Mostrar: () => {
        fn_Mostrar(propiedades);
      },
      fn_Ocultar: () => {
        fn_Ocultar(propiedades);
      }
    };

    return obj_control;
  }

  function fn_InitComponentes(propiedades: iProperties) {
    fn_CreateUserInfo(propiedades);

    var g_item = propiedades.el_g_contenedor
      .append("g")
      .attr("transform", "translate(0,200)");
    propiedades.el_g_contenedor_items = g_item;
    fn_DibujarMenu(propiedades);
  }

  function fn_CreateUserInfo(propiedades: iProperties) {
    var g_user = propiedades.el_g_contenedor.append("g");
    var rect_user = g_user
      .append("rect")
      .attr("width", propiedades.prop_config.width - 130)
      .attr("height", 200)
      .style("fill", "#f0f7ff");

    g_user
      .append("image")
      .attr("x", 40)
      .attr("y", 60)
      .attr("width", 200)
      .attr("height", 60)
      .attr("xlink:href", "images/demo.png");

    g_user
      .append("text")
      .attr("x", 15)
      .attr("y", 170)
      .style("fill", "#3a3a3a")
      .style("font-size", "16")
      .text(propiedades.prop_config.nombreUsuario);

    g_user
      .append("text")
      .attr("x", 15)
      .attr("y", 190)
      .style("fill", "#5e6163")
      .style("font-size", "14")
      .text(propiedades.prop_config.email);
  }

  function fn_CrearSubmenu(): Map<Entidades.ISubMenu> {
    var menu = d3.map([], function(d: Entidades.ISubMenu) {
      return d.prop_ID.toString();
    });

    menu.set("1", fn_CrearEntidad(1, "Chat", "CHT", ""));
    menu.set("2", fn_CrearEntidad(2, "Sesión", "", "", Entidades.CSeperador));
    menu.set(
      "3",
      fn_CrearEntidad(
        3,
        "Cerrar sesión",
        "CSN",
        "M10.09,15.59L11.5,17l5,-5 -5,-5 -1.41,1.41L12.67,11H3v2h9.67l-2.58,2.59zM19,3H5c-1.11,0 -2,0.9 -2,2v4h2V5h14v14H5v-4H3v4c0,1.1 0.89,2 2,2h14c1.1,0 2,-0.9 2,-2V5c0,-1.1 -0.9,-2 -2,-2z"
      )
    );
    return menu;
  }

  function fn_CrearEntidad(
    id: number,
    nombre: string,
    url: string,
    path: string,
    tipo = Entidades.CMenu
  ): Entidades.ISubMenu {
    var submenu = <Entidades.ISubMenu>{};
    submenu.prop_ID = id;
    submenu.prop_Path = path;
    submenu.prop_Nombre = nombre;
    submenu.prop_Tipo = tipo;
    submenu.prop_Url = url;
    return submenu;
  }

  function fn_DibujarMenu(propiedades: iProperties) {
    var menus = propiedades.el_g_contenedor_items
      .selectAll<SVGGElement, any>(".gMenu_item")
      .data(
        propiedades.prop_data,
        (datum: Entidades.ISubMenu) => datum.prop_ID + ""
      );

    menus.exit().remove();

    menus
      .enter()
      .append(datum => fn_CrearContenedorItem(propiedades, datum))
      .classed("gMenu_item", true)
      .attr("cursor", "default")
      .each(function(datum, index) {
        fn_DibujarItem(propiedades, this, datum, index);
      })
      .merge(menus)
      .attr("transform", (d, i) => "translate(0, " + (d.prop_ID - 1) * 50 + ")")
      .call(D3Utils.eventos.fun_agregar_click, function(
        datum: Entidades.ISubMenu,
        index: number,
        all_elements: any
      ) {
        fn_ClickFila(propiedades, this, datum, index);
      })
      .each(function(datum, index) {
        fn_ActualizarItem(propiedades, this, datum, index);
      });
  }

  function fn_CrearContenedorItem(
    propiedades: iProperties,
    datum: Entidades.ISubMenu
  ): SVGGElement {
    var g_content = document.createElementNS("http://www.w3.org/2000/svg", "g");
    d3.select(g_content)
      .append("rect")
      .classed("g_item_rect_content", true)
      .attr("width", propiedades.prop_config.widthItem - 45)
      .attr("height", propiedades.prop_config.heightItem)
      .style("fill", "transparent");

    return g_content;
  }

  function fn_DibujarItem(
    propiedades: iProperties,
    element: SVGGElement,
    datum: Entidades.ISubMenu,
    index: number
  ) {
    var g_item = d3.select(
      document.createElementNS("http://www.w3.org/2000/svg", "g")
    );
    g_item
      .classed("g_item", true)
      .attr("transform", (d, i) => "translate(20,12)");

    if (datum.prop_Tipo != Entidades.CSeperador) {
      if (datum.prop_Path != "") {
        g_item
          .append("path")
          .attr("d", datum.prop_Path)
          .classed("gItem_path", true)
          .attr("fill", "#cccccc")
          .attr("x", "25")
          .attr("y", "30");
      }
      d3.select(element)
        .append("text")
        .classed("gItem_nombre", true)
        .attr("x", 50)
        .attr("y", 30)
        .style("fill", "#ffffff")
        .style("font-size", "16")
        .style("font-weight", "bold")
        .text(datum.prop_Nombre);
    } else {
      d3.select(element)
        .append("line")
        .attr("x1", propiedades.prop_config.width - 130)
        .attr("y1", 7)
        .attr("x2", 0)
        .attr("y2", 7)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("stroke-opacity", 0.2);

      d3.select(element)
        .append("text")
        .classed("gItem_nombre", true)
        .attr("x", 15)
        .attr("y", 30)
        .style("fill", "#ffffff")
        .style("font-size", "16")
        .style("font-weight", "bold")
        .text(datum.prop_Nombre);
    }
    element.append(g_item.node());
  }

  function fn_ActualizarItem(
    propiedades: iProperties,
    element: SVGGElement,
    datum: Entidades.ISubMenu,
    index: number
  ) {}

  function fn_ClickFila(
    propiedades: iProperties,
    element: SVGGElement,
    datum: Entidades.ISubMenu,
    index: number
  ) {
    if (d3.event.defaultPrevented) return;
    if (datum.prop_Tipo == Entidades.CSeperador) return;

    fn_Deseleccionar(propiedades);
    fn_Seleccionar(propiedades, datum.prop_ID);

    fn_Ocultar(propiedades);
    if (datum.prop_Tipo == Entidades.CMenu) {
      var hash = window.location.hash.replace("#", "");
      if (hash != datum.prop_Url) {
        window.location.assign("/#" + datum.prop_Url);
      } else {
        if (propiedades.prop_config.fn_ClickMismoMenu)
          propiedades.prop_config.fn_ClickMismoMenu(hash);
      }
    }
  }

  function fn_Seleccionar(propiedades: iProperties, idFila: number) {
    propiedades.prop_id_fila_seleccionada = idFila;

    var g_fila_seleccionada = propiedades.el_g_contenedor_items
      .selectAll(".gMenu_item")
      .filter((d: Entidades.ISubMenu, i) => d.prop_ID === idFila);

    g_fila_seleccionada
      .classed("gItem_selected", true)
      .select(".g_item_rect_content")
      .style("fill", "#4682b4");

    // g_fila_seleccionada.select(".gItem_path").attr("fill", "#000000");
    //g_fila_seleccionada.select(".gItem_nombre").style("fill", "#000000");
  }

  function fn_Deseleccionar(propiedades: iProperties) {
    var item_seleccionado = propiedades.el_g_contenedor_items
      .select(".gItem_selected")
      .classed("gItem_selected", false);

    item_seleccionado
      .select(".g_item_rect_content")
      .style("fill", "transparent");
    item_seleccionado.select(".gItem_path").attr("fill", "#cccccc");
    item_seleccionado.select(".gItem_nombre").style("fill", "#ffffff");
  }

  function fn_Mostrar(propiedades: iProperties) {
    var idMenu = fn_BuscarIDMenu(propiedades);
    if (idMenu > 0) {
      fn_Deseleccionar(propiedades);
      fn_Seleccionar(propiedades, idMenu);
    }

    d3.select(".gMenuI")
      .select(".gMenu")
      .interrupt();
    d3.select(".gMenuI")
      .select(".rect_menu_popup_m")
      .interrupt();

    d3.select(".gMenuI").style("pointer-events", "all");
    d3.select(".gMenu").style("display", "block");

    d3.select(".gMenuI")
      .select(".rect_menu_popup_m")
      .transition()
      .duration(600)
      .style("opacity", "0.5");

    d3.select(".gMenuI")
      .select(".gMenu")
      .transition()
      .duration(600)
      .attr("transform", "translate(0,0)");
  }

  function fn_Ocultar(propiedades: iProperties) {
    d3.select(".gMenuI")
      .select(".gMenu")
      .interrupt();
    d3.select(".gMenuI")
      .select(".rect_menu_popup_m")
      .interrupt();

    d3.select(".gMenuI").style("pointer-events", "none");

    d3.select(".gMenuI")
      .select(".rect_menu_popup_m")
      .transition()
      .duration(600)
      .style("opacity", "0");

    d3.select(".gMenu")
      .transition()
      .duration(600)
      .attr("transform", "translate(-400,0)")
      .transition()
      .delay(0)
      .style("display", "none");
  }

  function fn_BuscarIDMenu(propiedades: iProperties): number {
    var hash = window.location.hash.replace("#", "");

    var item: Entidades.ISubMenu = null;
    propiedades.prop_data.forEach(element => {
      if (element.prop_Url == hash) {
        item = element;
        return;
      }
    });

    return item != null ? item.prop_ID : -1;
  }
}
