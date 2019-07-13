import * as d3 from "d3";
import { Entidades } from "../general/Entidades";
import { Lista } from "../controles/control_svg_lista";
import { MainPage } from "../MainPage";
import { D3Utils } from "../general/Utils";
import { Dashboard } from "./dashboard";
import { Main } from "../Main";
import { Usuario } from "../data/Usuario";
import { infoEntrega } from "./infoEntrega";

export namespace MenuOpciones {
  let prop_listaMenuD3: Lista.iObjetoControl = null;
  export let mnu_content: d3.Selection<any, any, any, any> = null;
  export let mnu_opts: d3.Selection<any, any, any, any> = null;
  let _menu: Array<Entidades.IMenu>;
  let _height_item_menu: number = 35;
  export var isMenuShown: boolean = false;
  export var isMnuOptnsShown: boolean = false;
  export var confirm_dialog: d3.Selection<any, any, any, any> = null;
  console.log("menu", prop_listaMenuD3);

  export function fn_mostrar_ocultar_opciones(
    parent: d3.Selection<any, any, any, any>
  ) {
    if (!isMnuOptnsShown) {
      if (mnu_opts == null) {
        mnu_opts = parent.append("g").style("pointer-events", "all");

        mnu_opts
          .append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("width", MainPage._template.fun_get_width())
          .attr(
            "height",
            MainPage._template.fun_get_height_content() +
              MainPage._template.fun_get_height_header() +
              MainPage._template.fun_get_height_footer()
          )
          .style("fill", "#000000")
          .style("opacity", "0.04");

        mnu_opts.call(D3Utils.eventos.fun_agregar_click, () => {
          fn_hide_menu_opciones();
        });

        //Menu List
        let list_in = mnu_opts
          .append("g")
          .style("fill", D3Utils.prop_color_acent)
          .attr(
            "transform",
            "translate(" +
              (MainPage._template.fun_get_width() / 2 - 11) +
              ", " +
              (D3Utils.prop_height_header + 3) +
              ")"
          );

        list_in
          .append("path")
          .attr("fill", "#262626")
          .attr("transform", "translate(167, -12)")
          .attr("d", "M32 16 L16 0 L0 16");

        _menu = <Array<Entidades.IMenu>>[
          { ID: 1, Title: "Sitios", TextColor: "white" },
          { ID: 2, Title: "Información de entrega", TextColor: "white" }
        ];

        list_in
          .append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("height", _height_item_menu * _menu.length + 8)
          .attr("width", MainPage._template.fun_get_width() / 2 + 8)
          .attr("rx", 8)
          .attr("ry", 8)
          .style("fill", "#262626")
          .classed("shadowed-card", true);

        let list_in2 = list_in.append("g").attr("transform", "translate(4, 4)");

        fn_crear_tabla_lista(
          list_in2,
          _menu,
          MainPage._template.fun_get_width() / 2,
          _height_item_menu * _menu.length,
          D3Utils.prop_color_acent,
          fn_item_selected_options
        );
      } else {
        mnu_opts.style("display", "block");
      }

      isMnuOptnsShown = true;
    } else {
      fn_hide_menu_opciones();
    }
  }

  function fn_hide_menu_opciones() {
    mnu_opts.style("display", "none");
    isMnuOptnsShown = false;
  }

  function fn_item_selected_options(
    datum?: Entidades.IMenu,
    index?: number,
    outerIndex?: number
  ) {
    if (d3.event.defaultPrevented) return;

    fn_hide_menu_opciones(); //Ocultar menú

    switch (datum.ID) {
      case 1:
        window.location.assign("#SuC");
        break;
      case 2:
        window.location.assign("#iE");
        break;
      default:
        break;
    }
  }

  function fn_crear_tabla_lista(
    contenedor: d3.Selection<any, any, any, any>,
    data: Array<Entidades.IMenu>,
    wth_menu: number,
    hgt_menu: number,
    background_color: string,
    callback: VoidFunction
  ) {
    prop_listaMenuD3 = Lista.fun_main({
      height: hgt_menu,
      width: wth_menu,
      prop_data: data,
      prop_campo_clave_fila: "key",
      prop_scroll: {
        prop_mantener_scroll: true,
        prop_virtualScroll: true,
        prop_activarScrollY: true
      },
      prop_config_fila: {
        prop_height: _height_item_menu,
        prop_background: background_color,
        prop_border_width: 1,
        prop_border_color: "#EDEDED",
        // prop_background_selectable: "#ececec",
        // prop_selectable: true,
        on: {
          click: callback
        },
        fun_on_dibuja_fila: (
          g_fila: SVGGElement,
          datum: Entidades.IMenu,
          cx: number,
          cy: number
        ) => {
          fn_crear_fila_menu(d3.select(g_fila), datum);
        },
        fun_on_actualiza_fila: (
          g_fila: SVGGElement,
          datum: Entidades.IMenu,
          cx: number,
          cy: number
        ) => {}
      }
    });
    contenedor
      .append(() => prop_listaMenuD3.element)
      .attr("transform", "translate(0,0)");
  }

  function fn_crear_fila_menu(
    fila: d3.Selection<any, any, any, any>,
    datum: Entidades.IMenu
  ): void {
    let g_content_texts = fila
      .append("g")
      .attr("transform", "translate(10, 0)");
    // .classed("g_content_cliente", true);

    let _pos_start_text_item = 0;
    if (datum.Image) {
      g_content_texts
        .append("image")
        .attr("x", "10")
        .attr("y", "2")
        .attr("width", 30)
        .attr("height", 30)
        .attr("xlink:href", datum.Image);
      _pos_start_text_item = 50;
    }

    g_content_texts
      .append("text")
      .classed("text_title_item", true)
      .attr("font-size", "18")
      .attr("x", _pos_start_text_item)
      .attr("y", "23")
      .style("fill", datum.TextColor)
      .text(() => {
        return datum.Title;
      });
  }
}
