import * as d3 from "d3";
import { MainPage } from "../MainPage";

export namespace D3Utils {
  export var prop_height_footer: number = 50;
  export var prop_height_header: number = 50;
  export var _width_footer_container: number;
  export var _width_footer_button: number;
  export var _height_footer_button: number;
  export var prop_color_primary: string = "#262626";
  export var prop_color_text_header: string = "#fff";
  export var prop_color_acent: string = "#262626";
  export var max_distance_beetween_points: number = 50; //Ditancia en metros
  export var consider_base_route: boolean = false;
  export var visit_time: number = 25; //Tiempo minimo en visita de sucursal

  export function fn_crear_encabezado_atras(
    callBack: VoidFunction
  ): d3.Selection<any, any, any, any> {
    let g_header = d3.select(
      document.createElementNS("http://www.w3.org/2000/svg", "g")
    );

    g_header.attr("transform", "translate(0,0)");

    g_header
      .append("rect")
      .classed("head_rect", true)
      .attr("width", "100%")
      .attr("height", prop_height_header)
      .attr("fill", prop_color_primary);

    let g_header_content = g_header
      .append("g")
      .attr("transform", "translate(0,0)")
      .classed("g_content_flecha_header", true)
      .on("click", callBack);

    g_header_content
      .append("rect")
      .classed("head_back_rect", true)
      .attr("width", "100%")
      .attr("height", prop_height_header)
      .attr("fill", prop_color_primary);

    let g_header_back = g_header_content
      .append("g")
      .attr("transform", "translate(0,0)")
      .classed("g_flecha_header", true);

    g_header_back
      .append("rect")
      .attr("width", "50")
      .attr("height", "50")
      .attr("fill", prop_color_primary);

    g_header_back
      .append("path")
      .attr("d", "M20 03 L17 03 L6.5 15 L17 27 L20 27 L9.5 15")
      .attr("fill", prop_color_text_header)
      .attr("transform", "translate(15,10)");

    g_header_content
      .append("text")
      .classed("title-text", true)
      .attr("x", "50")
      .attr("y", "30")
      .style("fill", prop_color_text_header)
      .style("font-size", "18");

    return g_header;
  }

  export function fn_crear_encabezadoV1(): d3.Selection<any, any, any, any> {
    let g_header = d3.select(
      document.createElementNS("http://www.w3.org/2000/svg", "g")
    );

    g_header.attr("transform", "translate(0,0)");

    g_header
      .append("rect")
      .classed("head_rect", true)
      .attr("width", "100%")
      .attr("height", prop_height_header)
      .attr("fill", prop_color_primary);

    let g_header_content = g_header
      .append("g")
      .attr("transform", "translate(0,0)")
      .classed("g_content_flecha_header", true)
      .attr("fill", prop_color_primary);

    g_header_content
      .append("rect")
      .classed("head_back_rect", true)
      .attr("width", "100%")
      .attr("height", prop_height_header)
      .attr("fill", prop_color_primary);

    let g_header_back = g_header_content
      .append("g")
      .attr("transform", "translate(0,0)")
      .classed("g_flecha_header", true);

    g_header_back
      .append("rect")
      .attr("width", "50")
      .attr("height", "50");

    g_header_back
      .append("path")
      .attr(
        "d",
        "M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z"
      )
      .attr("fill", prop_color_text_header)
      .attr("transform", "translate(15,13)")
      .attr("x", "17")
      .attr("y", "18");

    let g_header_logo = g_header_content
      .append("g")
      .attr("transform", "translate(50,0)")
      .classed("g_flecha_header", true);
    g_header_logo
      .append("rect")
      .attr("width", "50")
      .attr("height", "50");
    g_header_logo
      .append("image")
      .classed("logo-company", true)
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", "50")
      .attr("height", "50")
      .attr("transform", "translate(0,0)");

    //txt title
    g_header_content
      .append("text")
      .classed("title-text", true)
      .attr("x", "100")
      .attr("y", "22")
      .style("fill", prop_color_text_header)
      .style("font-size", "15");

    //txt Subtitle
    g_header_content
      .append("text")
      .classed("subtitle-text", true)
      .attr("x", "100")
      .attr("y", "39")
      .style("fill", prop_color_text_header)
      .style("font-size", "13");

    return g_header;
  }

  export function fn_crear_encabezado(): d3.Selection<any, any, any, any> {
    let g_header = d3.select(
      document.createElementNS("http://www.w3.org/2000/svg", "g")
    );

    g_header.attr("transform", "translate(0,0)");

    g_header
      .append("rect")
      .classed("head_rect", true)
      .attr("width", "100%")
      .attr("height", prop_height_header)
      .attr("fill", prop_color_primary);

    let g_header_content = g_header
      .append("g")
      .attr("transform", "translate(0,0)")
      .classed("g_content_flecha_header", true)
      .attr("fill", prop_color_primary);

    g_header_content
      .append("rect")
      .classed("head_back_rect", true)
      .attr("width", "100%")
      .attr("height", prop_height_header)
      .attr("fill", prop_color_primary);

    let g_header_menu = g_header_content
      .append("g")
      .attr("transform", "translate(0,0)")
      .classed("g_flecha_header", true);

    g_header_menu
      .append("rect")
      .attr("width", "50")
      .attr("height", "50");

    g_header_menu
      .append("path")
      .attr(
        "d",
        "M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z"
      )
      .attr("fill", prop_color_text_header)
      .attr("transform", "translate(15,13)");

    //txt title
    g_header_content
      .append("text")
      .classed("title-text", true)
      .attr("x", "50")
      .attr("y", "31")
      .style("fill", prop_color_text_header)
      .style("font-size", "18");

    //button More options
    let g_header_opts = g_header_content
      .append("g")
      .attr(
        "transform",
        "translate(" + (MainPage._template.fun_get_width() - 50) + ",0)"
      )
      .classed("g_more_header", true);

    g_header_opts
      .append("rect")
      .attr("width", "50")
      .attr("height", "50");

    g_header_opts
      .append("path")
      .attr(
        "d",
        "M24 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
      )
      .attr("fill", prop_color_text_header)
      .attr("transform", "translate(5,9) scale(0.7)");

    return g_header;
  }

  export function fn_crear_piedepagina(
    callBack: VoidFunction
  ): d3.Selection<any, any, any, any> {
    _width_footer_container = MainPage._template.fun_get_width() - 50; //50=>width icon
    let g_footer = d3.select(
      document.createElementNS("http://www.w3.org/2000/svg", "g")
    );

    g_footer.attr("transform", "translate(0,0)");

    g_footer
      .append("rect")
      .classed("footer_rect", true)
      .attr("width", "100%")
      .attr("height", prop_height_footer)
      .attr("fill", "#FFFFFF");

    let g_footer_content = g_footer
      .append("g")
      .attr("transform", "translate(0,0)")
      .classed("g_content_footer", true)
      .attr("fill", "#FFFFFF");

    g_footer_content
      .append("rect")
      .classed("fotter_back_rect", true)
      .attr("width", _width_footer_container)
      .attr("height", prop_height_footer)
      .attr("fill", "#FFFFFF");

    //Icon Arrow
    let g_footer_back = g_footer
      .append("g")
      .attr("transform", "translate(" + _width_footer_container + ",0)")
      .classed("g_flecha_footer", true)
      .attr("fill", "#FFFFFF")
      .on("click", callBack);

    g_footer_back
      .append("rect")
      .attr("width", "50")
      .attr("height", "50");

    g_footer_back
      .append("path")
      .attr("d", "M36 16 L36 20 L18 4 L0 20 L0 16 L18 0")
      .classed("arrow-footer", true)
      .attr("fill", "#262626")
      .attr("width", "30")
      .attr("height", "30")
      .attr("transform", "translate(0,12)");

    return g_footer;
  }

  export function fn_actualizar_pie_pagina(
    g_footer: d3.Selection<any, any, any, any>,
    to_show: boolean
  ) {
    g_footer.select(".footer_rect").attr("height", prop_height_footer);

    g_footer.select("fotter_back_rect").attr("height", prop_height_footer);

    let itemArrow = g_footer.select(".arrow-footer");

    if (to_show) {
      itemArrow
        .attr("d", "M36 16 L36 20 L18 36 L0 20 L0 16 L18 32")
        .attr("transform", "translate(0,0)");
    } else {
      itemArrow
        .attr("d", "M36 16 L36 20 L18 4 L0 20 L0 16 L18 0")
        .attr("transform", "translate(0,12)");
    }
  }

  export function fn_crear_footer_button(
    text: string
  ): d3.Selection<any, any, any, any> {
    _width_footer_button = _width_footer_container / 2 - 10;
    _height_footer_button = 34;

    let g_content_btn = d3
      .select(document.createElementNS("http://www.w3.org/2000/svg", "g"))
      .attr("width", _width_footer_button)
      .attr("height", _height_footer_button);

    g_content_btn
      .append("rect")
      .classed("rect-footer-button", true)
      .attr("width", _width_footer_button)
      .attr("height", _height_footer_button)
      .style("stroke-width", "2")
      .style("stroke", "#262626")
      .attr("rx", 20)
      .attr("ry", 20)
      .attr("fill", "white");

    g_content_btn
      .append("text")
      .classed("txt-footer-button", true)
      .attr("font-size", "18")
      .attr("y", "22")
      .attr("x", _width_footer_button / 2)
      .style("text-anchor", "middle")
      .style("fill", "#262626")
      .text(text);

    return g_content_btn;
  }

  export function fn_crear_footer_more_button(
    contenedor: d3.Selection<any, any, any, any>
  ): d3.Selection<any, any, any, any> {
    let g_content_btn = contenedor.append("g");
    var width_button = _width_footer_container / 2 - 10;
    var height_button = 38;

    //Button LLegada
    let rect_btn = g_content_btn
      .append("rect")
      .attr("width", width_button)
      .attr("height", height_button)
      .attr("x", "5")
      .attr("y", "6")
      .style("stroke-width", "2")
      .style("stroke", "#262626")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "white");

    let txt_btn = g_content_btn
      .append("text")
      .attr("font-size", "18")
      .attr("x", width_button / 2)
      .attr("y", "32")
      .style("text-anchor", "middle")
      .style("fill", "#262626")
      //.text("Llegada");
      .text("Entrega");

    // //Iniciar Asistencia
    // g_content_btn.append("rect")
    //     .attr("width", width_button)
    //     .attr("height", height_button)
    //     .attr("x", width_button + 10)
    //     .attr("y", "6")
    //     .style("stroke-width", "2")
    //     .style("stroke", "#2A9FD8")
    //     .attr("rx", 10)
    //     .attr("ry", 10)
    //     .attr("fill", "white");

    // g_content_btn.append("text")
    //     .attr("font-size", "18")
    //     .attr("x", width_button + 10 + (width_button / 2))
    //     .attr("y", "30")
    //     .style("text-anchor", "middle")
    //     .style("fill", "#2A9FD8")
    //     .text("Iniciar Asistente");

    return g_content_btn;
  }

  export function get_icon_marker(color: string) {
    return {
      path:
        "m0.62963,-47.4375c-8.14556,0 -14.74996,6.60292 -14.74996,14.75c0,2.28164 0.51855,4.44519 1.44476,6.37246c0.05184,0.10954 13.3052,26.07754 13.3052,26.07754l13.1454,-25.7549c1.0256,-2.0079 1.6046,-4.2838 1.6046,-6.6951c0,-8.14708 -6.6029,-14.75 -14.75,-14.75zm0,23.6c-4.88741,0 -8.85,-3.96406 -8.85,-8.85s3.96259,-8.85 8.85,-8.85c4.88594,0 8.85,3.96406 8.85,8.85s-3.9641,8.85 -8.85,8.85z",
      fillColor: color,
      fillOpacity: 1,
      anchor: new google.maps.Point(0, 0),
      strokeWeight: 0,
      scale: 0.6,
      rotation: 0
    };
  }

  // export function get_icon_current_location(): google.maps.Icon {
  //   return {
  //     path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
  //     fillColor: D3Utils.prop_color_acent,
  //     fillOpacity: 0.7,
  //     anchor: new google.maps.Point(0, 0),
  //     strokeWeight: 12,
  //     strokeColor: "#2f60a8",
  //     strokeOpacity: 0.5,
  //     scale: 0.4
  //   } as google.maps.Icon;
  // }

  //prueba
  export function fn_crearBtn(
    contenedor: d3.Selection<any, any, any, any>,
    width: number,
    text: string
  ): d3.Selection<any, any, any, any> {
    let g_content_btn = contenedor.append("g");

    let rect_btn = g_content_btn
      .append("rect")
      .attr("width", width)
      .attr("height", "50")
      .attr("x", "0")
      .attr("y", "0")
      .attr("fill", "#D7DBDD");

    let txt_btn = g_content_btn
      .append("text")
      .attr("font-size", "20")
      .attr("x", width / 2)
      .attr("y", "32")
      .style("text-anchor", "middle")
      .text(text);

    return g_content_btn;
  }

  export function met_toMSJSON(dt1: Date): string {
    var date = "/Date(" + dt1.getTime() + ")/";
    return date;
  }

  export function fun_es_dispositivo_movil() {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    )
      return true;
    else return false;
  }

  export interface iInfoWrap {
    filas: number;
    alto: number;
    total_dy: number;
  }

  export function wrap(
    el_texto: d3.Selection<any, any, any, any>,
    width: number,
    font_size: number,
    char?: string,
    num_filas?: number,
    sangria?: number,
    wrap_word = false
  ): iInfoWrap {
    // export function wrap(el_texto: d3.Selection<SVGTextElement, {}, null, undefined>, width: number, font_size: number, char?: string, num_filas?: number, sangria?: number, wrap_word = false): iInfoWrap {
    let v_dy: number = font_size / 3 + font_size;
    if (font_size)
      el_texto.attr("dy", v_dy).style("font-size", font_size + "px");
    if (!sangria) sangria = 0;
    if (!char) char = "";

    el_texto.each(function(d, i) {
      let text = d3.select(this),
        words = text.text().split(/\s+/),
        word,
        line: any = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x") || 0,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        cont_filas = 0,
        tspan: any = text
          .text(null)
          .attr("alignment-baseline", "middle")
          .attr("dominant-baseline", "middle")
          .append("tspan")
          .attr("index-row", cont_filas)
          .attr("x", x)
          .attr("dx", sangria)
          .attr("dy", function() {
            return +d3.select(this).attr("index-row") == 0 ? 0 : dy;
          })
          .text(word) //.style("text-anchor", "start")
          .attr("alignment-baseline", "middle")
          .attr("dominant-baseline", "middle");

      // let aux_char = "";
      while (
        (word = words.shift()) &&
        (num_filas ? cont_filas < num_filas : true)
      ) {
        line.push(word);

        // Verificar que la palabra no sea mayor al ancho del contenedor.
        if (wrap_word) {
          tspan.text(word);
          let filas = fun_wrap_word(tspan, width);
          if (filas && filas.length > 0) {
            line.pop();
            filas = filas.concat(words);
            words = filas;
            continue;
          }
        }

        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          cont_filas += 1;
          // if (cont_filas === num_filas - 1) aux_char = char;
          if (cont_filas === num_filas)
            fun_limitar_texto(tspan.text(line.join(" ")), width, 0, char);
          else {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("index-row", cont_filas)
              .attr("x", x)
              .attr("dy", function() {
                return +d3.select(this).attr("index-row") == 0 ? 0 : dy;
              })
              .text(word) /* .style("text-anchor", "start") */
              .attr("alignment-baseline", "middle")
              .attr("dominant-baseline", "middle");
          }
        }
      }
    });
    let filas = el_texto.selectAll("tspan").size();
    let total_filas = filas * font_size;
    let total_dy = (filas - 1) * (font_size / 3);
    let total_height = total_filas + total_dy;

    return { filas: filas, alto: total_height, total_dy: total_dy };
  }

  export function fun_limitar_texto(
    el_texto: d3.Selection<
      SVGTextElement | SVGTSpanElement,
      {},
      null,
      undefined
    >,
    width: number,
    padding_: any,
    char: string
  ): void {
    el_texto.each(function() {
      var self: any = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text();
      var padding = padding_;
      while (textLength > width - 2 * padding && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + char);
        textLength = self.node().getComputedTextLength();
      }
    });
  }

  export function fun_wrap_word(
    el_texto: d3.Selection<SVGTSpanElement, {}, null, undefined>,
    width: number
  ): Array<string> {
    // CUANDO EL ANCHO DE UNA PALABRA ES MAYOR AL ANCHO PERMITIDO. Se divide la palabra.
    if (el_texto.node().getComputedTextLength() > width) {
      let filas: Array<string> = [];
      let str_word = el_texto.text();
      // filas.push();
      let total_letras = 0;
      let contador = 0;
      while (total_letras < str_word.length) {
        el_texto.text(str_word.slice(total_letras, str_word.length));
        fun_limitar_texto(el_texto, width, 0, "");
        filas.push(el_texto.text());
        contador += 1;
        total_letras += el_texto.text().length;
      }
      return filas;
    }
    return null;
  }

  export namespace D3DateFormat {
    export let prop_formato_fecha_hora = "%d/%m/%Y %I:%M %p";
    export let prop_formato_fecha = "%d/%m/%Y";
  }

  export namespace D3Font {
    export let prop_font = "Arial, Verdana, Tahoma";
  }

  export namespace eventos {
    /**
     * Función para agregar evento click/touchend.
     * @param seleccion - Elemento seleccionado al que se le agregara el evento.
     * @param callBack - Función a ejecutar.
     * @param nombre - Nombre que se le agregara al evento.
     */
    export function fun_agregar_click(
      seleccion: d3.Selection<any, any, null, undefined>,
      callBack: (datum?: any, index?: number, allElement?: any) => void,
      nombre?: string
    ) {
      if (fun_es_dispositivo_movil()) {
        // prop_time_out_touch_start = null;
        // seleccion.on("touchend." + nombre, callBack);
        if (!callBack) {
          seleccion
            .on("touchstart." + (nombre || ""), null)
            .on("touchend." + (nombre || ""), null);
        } else {
          seleccion
            .on(
              "touchstart." + (nombre || ""),
              function() {
                fun_on_click_down.bind(this)();
                // let time_out = setTimeout(() => {
                //     console.log("time_out");
                // }, 1000);

                // d3.select(this).property("time_out", time_out);
              },
              false
            )
            .on(
              "touchend." + (nombre || ""),
              function(datum, index, allElement) {
                fun_on_click_up.bind(this)(callBack, datum, index, allElement);
                // clearTimeout(d3.select(this).property("time_out"));
              },
              false
            );
        }
      } else {
        if (!callBack) seleccion.on("click." + (nombre || ""), null);
        else
          seleccion.on(
            "click." + (nombre || ""),
            function(datum, index, allElement) {
              fun_on_click_up.bind(this)(callBack, datum, index, allElement);
            },
            false
          );
      }
    }

    function fun_on_click_down(): void {
      d3.select(this).property("init_evento_pos", d3.mouse(document.body));
      d3.select(this).property("init_evento_time", new Date().getTime());
    }

    function fun_on_click_up(
      fnc_callback_evento: Function,
      datum: any,
      index: any,
      allElement: any
    ): void {
      if (d3.event.defaultPrevented) return;

      // let fnc_callback_evento = d3.select(this).property("fnc_callback_evento");

      let init_evento_pos = d3.select(this).property("init_evento_pos");
      let init_evento_time = d3.select(this).property("init_evento_time");

      let fin_evento_pos = d3.mouse(document.body);

      let posicion_elemento = (<Element>this).getBoundingClientRect();
      if (
        (!init_evento_time && !init_evento_pos) ||
        (posicion_elemento.left <= init_evento_pos[0] &&
          posicion_elemento.right >= init_evento_pos[0] &&
          posicion_elemento.top <= init_evento_pos[1] &&
          posicion_elemento.bottom >= init_evento_pos[1] &&
          // Posicion evento final.
          posicion_elemento.left <= fin_evento_pos[0] &&
          posicion_elemento.right >= fin_evento_pos[0] &&
          posicion_elemento.top <= fin_evento_pos[1] &&
          posicion_elemento.bottom >= fin_evento_pos[1] &&
          // Tiempo presionado.
          new Date().getTime() - init_evento_time <= 1000)
      )
        fnc_callback_evento.bind(this)(datum, index, allElement);

      d3.select(this).property("init_evento_pos", null);
      d3.select(this).property("init_evento_time", null);

      let setPreventDefault = d3.select(this).property("setPrevent");
      if (!setPreventDefault) d3.event.preventDefault();
    }

    export function fun_ejecutar_click(
      elemento: d3.Selection<any, any, null, undefined>
    ): void {
      if (fun_es_dispositivo_movil()) elemento.dispatch("touchend");
      else elemento.dispatch("click");
    }
  }
}
