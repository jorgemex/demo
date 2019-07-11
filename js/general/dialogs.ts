import * as d3 from "d3";
import { Entidades } from "../general/Entidades";
import { D3Utils } from "../general/Utils";
import { Input } from "../controles/control_svg_input";
import { Map } from "d3";
import { MainPage } from "../MainPage";
import { Main } from "../Main";
import { Usuario } from "../data/Usuario";
import { Dashboard } from "../pantallas/dashboard";

export namespace dialogs {
  export var confirm_dialog: d3.Selection<any, any, any, any> = null;
  export let mnu_content: d3.Selection<any, any, any, any> = null;
  export let mnu_opts: d3.Selection<any, any, any, any> = null;

  //agregado para infoalerta
  export let prop_inputInfMotivo: Input.iObjetoControl = null;
  var pos_y_select_input: number = 0;
  let margin_default: number = 25;

  let g_main_container = d3.select(
    document.createElementNS("http://www.w3.org/2000/svg", "g")
  );
  g_main_container
    .classed("svg_frmLogin", true)
    .attr("transform", "translate(" + margin_default + ", 0)");
  //agregado para infoalerta

  export function show_confirm_dialog(
    title: string,
    body: string,
    okCallback: Function,
    cancelCallback?: Function
  ) {
    if (confirm_dialog == null) {
      let hgt_alert_dlg = 150,
        wth_alert_dlg = 250;
      confirm_dialog = MainPage.svg_top_parent
        .append("g")
        .style("pointer-events", "all");

      confirm_dialog
        .append("rect")
        .attr("width", MainPage._template.fun_get_width())
        .attr(
          "height",
          MainPage._template.fun_get_height_content() +
            MainPage._template.fun_get_height_header() +
            MainPage._template.fun_get_height_footer()
        )
        .style("fill", "#000000")
        .style("opacity", "0.1");

      let content_in = confirm_dialog
        .append("g")
        .style("fill", "aliceblue")
        .attr(
          "transform",
          "translate(" +
            (MainPage._template.fun_get_width() - wth_alert_dlg) / 2 +
            ", " +
            (MainPage._template.fun_get_height_content() - hgt_alert_dlg) / 2 +
            ")"
        )
        .classed("shadowed-card", true);

      content_in
        .append("rect")
        .attr("height", hgt_alert_dlg)
        .attr("width", wth_alert_dlg)
        .attr("rx", 8)
        .attr("ry", 8)
        .style("fill", "aliceblue");

      content_in
        .append("text")
        .text(title)
        .attr("x", wth_alert_dlg / 2)
        .attr("y", "25")
        .style("fill", "gray")
        .style("font-size", "22")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold");

      content_in
        .append("line")
        .attr("y1", 35)
        .attr("x2", wth_alert_dlg)
        .attr("y2", 35)
        .attr("stroke-width", "1")
        .attr("stroke", D3Utils.prop_color_acent)
        .attr("stroke-opacity", 0.3);
      // .attr("stroke", "#e4e4e4");

      let txt_content = content_in
        .append("text")
        .text(body)
        .attr("x", wth_alert_dlg / 2)
        .attr("y", "65")
        .style("fill", "gray")
        .style("font-size", "18")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold");
      D3Utils.wrap(txt_content, wth_alert_dlg - 6, 19, "...", 3);

      content_in
        .append("rect")
        .attr("height", 30)
        .attr("width", wth_alert_dlg)
        .attr("rx", 8)
        .attr("ry", 8)
        .attr("x", 0)
        .attr("y", 120)
        .style("fill", D3Utils.prop_color_acent);
      //Buttons
      let wth_button = wth_alert_dlg / 2,
        hgt_button = 30;
      let g_container_button = content_in
        .append("g")
        .attr("transform", "translate(0, " + 120 + ")")
        .call(D3Utils.eventos.fun_agregar_click, () => {
          if (d3.event.defaultPrevented) return;

          confirm_dialog.style("display", "none");
          if (cancelCallback) cancelCallback();
        });
      createButton(g_container_button, wth_button, hgt_button, "Cancelar");

      let g_container_button2 = content_in
        .append("g")
        .attr(
          "transform",
          "translate(" + (wth_alert_dlg - wth_button) + ", " + 120 + ")"
        )
        .call(D3Utils.eventos.fun_agregar_click, () => {
          if (d3.event.defaultPrevented) return;

          confirm_dialog.style("display", "none");
          okCallback();
        });
      createButton(g_container_button2, wth_button, hgt_button, "Confirmar");

      content_in
        .append("line")
        .attr("y1", 120)
        .attr("x1", wth_alert_dlg / 2)
        .attr("y2", 150)
        .attr("x2", wth_alert_dlg / 2)
        .attr("stroke-width", "1")
        .attr("stroke", "#e4e4e4");
    } else {
      confirm_dialog.style("display", "block");
    }
  }
  //dialogo de aleras
  export function show_alert_dialog(
    title: string,
    body: string,
    cancelCallback?: Function
  ) {
    if (confirm_dialog == null) {
      let hgt_alert_dlg = 150,
        wth_alert_dlg = 250;
      confirm_dialog = MainPage.svg_top_parent
        .append("g")
        .style("pointer-events", "all");

      confirm_dialog
        .append("rect")
        .attr("width", MainPage._template.fun_get_width())
        .attr(
          "height",
          MainPage._template.fun_get_height_content() +
            MainPage._template.fun_get_height_header() +
            MainPage._template.fun_get_height_footer()
        )
        .style("fill", "#000000")
        .style("opacity", "0.1");

      let content_in = confirm_dialog
        .append("g")
        .style("fill", "aliceblue")
        .attr(
          "transform",
          "translate(" +
            (MainPage._template.fun_get_width() - wth_alert_dlg) / 2 +
            ", " +
            (MainPage._template.fun_get_height_content() - hgt_alert_dlg) / 2 +
            ")"
        )
        .classed("shadowed-card", true);

      content_in
        .append("rect")
        .attr("height", hgt_alert_dlg)
        .attr("width", wth_alert_dlg)
        .attr("rx", 8)
        .attr("ry", 8)
        .style("fill", "aliceblue");

      content_in
        .append("text")
        .text(title)
        .attr("x", wth_alert_dlg / 2)
        .attr("y", "25")
        .style("fill", "gray")
        .style("font-size", "22")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold");

      let txt_content = content_in
        .append("text")
        .text(body)
        .attr("x", wth_alert_dlg / 2)
        .attr("y", "65")
        .style("fill", "gray")
        .style("font-size", "18")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold");
      D3Utils.wrap(txt_content, wth_alert_dlg - 6, 19, "...", 3);

      //Buttons
      let wth_button = wth_alert_dlg,
        hgt_button = 30;
      let g_container_button = content_in
        .append("g")
        .attr("transform", "translate(0, " + 120 + ")")
        .call(D3Utils.eventos.fun_agregar_click, () => {
          if (d3.event.defaultPrevented) return;

          confirm_dialog.style("display", "none");
          if (cancelCallback) cancelCallback();
        });
      createButton(g_container_button, wth_button, hgt_button, "Aceptar");
    } else {
      confirm_dialog.style("display", "block");
    }
  }
  //
  // export function show_InofoAlert_dialog(title: string, body: string, cancelCallback?: Function) {
  //     if (confirm_dialog == null) {
  //         let hgt_alert_dlg = 470,
  //             wth_alert_dlg = 300;
  //         confirm_dialog = MainPage.svg_top_parent.append("g")
  //             .style("pointer-events", "all");

  //         confirm_dialog.append("rect")
  //             .attr("width", MainPage._template.fun_get_width())
  //             .attr("height", MainPage._template.fun_get_height_content() + MainPage._template.fun_get_height_header() + MainPage._template.fun_get_height_footer())
  //             .style("fill", "#000000")
  //             .style("opacity", "0.1");

  //         let content_in = confirm_dialog.append("g")
  //             .style("fill", "aliceblue")
  //             .attr("transform", "translate(" + ((MainPage._template.fun_get_width() - wth_alert_dlg) / 2) + ", " + ((MainPage._template.fun_get_height_content() - hgt_alert_dlg) / 2) + ")")
  //             .classed("shadowed-card", true);

  //         content_in.append("rect")
  //             .attr("height", hgt_alert_dlg)
  //             .attr("width", wth_alert_dlg)
  //             .attr("rx", 8)
  //             .attr("ry", 8)
  //             .style("fill", "aliceblue");

  //         content_in.append("text")
  //             .text(title)
  //             .attr("x", wth_alert_dlg / 2)
  //             .attr("y", "25")
  //             .style("fill", "gray")
  //             .style("font-size", "22")
  //             .attr("text-anchor", "middle")
  //             .style("font-weight", "bold");

  //         let txt_content = content_in.append("text")
  //             .text(body)
  //             .attr("x", wth_alert_dlg / 2)
  //             .attr("y", "65")
  //             .style("fill", "gray")
  //             .style("font-size", "18")
  //             .attr("text-anchor", "middle")
  //             .style("font-weight", "bold");
  //         D3Utils.wrap(txt_content, (wth_alert_dlg - 6), 19, "...", 3);

  //         //Buttons
  //         let wth_button = wth_alert_dlg,
  //             hgt_button = 30;
  //         let g_container_button = content_in.append("g")
  //             .attr("transform", "translate(0, " + 440 + ")")
  //             .call(D3Utils.eventos.fun_agregar_click, () => {
  //                 if (d3.event.defaultPrevented) return;

  //                 confirm_dialog.style("display", "none");
  //                 if (cancelCallback)
  //                     cancelCallback();
  //             });
  //         createButton(g_container_button, wth_button, hgt_button, "Enviar reporte");
  //     } else {
  //         confirm_dialog.style("display", "block");
  //     }
  // }

  function createButton(
    g_container_button: d3.Selection<any, any, any, any>,
    wth_button: number,
    hgt_button: number,
    text: string
  ): d3.Selection<any, any, any, any> {
    let ggg = g_container_button
      .append("g")
      .attr("transform", "translate(0, 0)")
      .classed("centerText", true);

    let button2 = ggg
      .append("g")
      .style("fill", D3Utils.prop_color_acent)
      .attr("width", wth_button)
      .attr("height", hgt_button);

    button2
      .append("rect")
      .classed("select-button", true)
      .property("setPrevent", true)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", wth_button)
      .attr("height", hgt_button)
      .attr("rx", 5)
      .attr("ry", 5)
      .call(D3Utils.eventos.fun_agregar_click, () => {
        if (d3.event.defaultPrevented) return;
      });

    button2
      .append("text")
      .attr("y", hgt_button / 2)
      .attr("x", wth_button / 2)
      .style("fill", "#FFFFFF")
      .style("font-size", "18")
      .text(text)
      .style("pointer-events", "none")
      .classed("centerText", true);

    return ggg;
  }
  // //Container DATA
  // let hgt_input = 35;
  // let sum_sizes = 50;

  // let g_general = g_main_container.append("g")
  //     .attr("transform", "translate(0, " + sum_sizes + ")");

  // //Group User
  // let g_container_user = g_general.append("g");

  // g_container_user.append("rect")
  //     .attr("height", hgt_input)
  //     .attr("width", hgt_input)
  //     .style("fill", "#EDEDED");
  // g_container_user.append("image")
  //     .attr("width", hgt_input)
  //     .attr("height", hgt_input)
  //     .attr("xlink:href", "images/ic_user.png");

  // prop_inputInfMotivo = Input.fun_main({
  //     prop_height: hgt_input,
  //     prop_width: (MainPage.prop_template_login.fun_get_width() - 50 - hgt_input),
  //     prop_stroke: "#CACACA",
  //     prop_stroke_width: 0.5,
  //     prop_placeholder: "Usuario",
  //     prop_padding: { prop_left: 15, prop_right: 15 },
  //     prop_configText: { prop_size_text: 20, prop_font_family: D3Utils.D3Font.prop_font, prop_weight: "normal", prop_color: "black" },
  //     prop_events: {
  //         focus: () => {
  //             let rect_input_user: any = prop_inputInfMotivo.prop_element.getBoundingClientRect();
  //             pos_y_select_input = rect_input_user.y;
  //         },
  //         keyDown: (e) => {
  //             if (e.keyCode == 13) {
  //                 // prop_inputPassword.fun_focus();
  //             }
  //         },
  //         input: (puntero_posicion) => { }
  //     }
  // });

  // g_container_user.append(() => prop_inputInfMotivo.prop_element).attr("transform", "translate(" + hgt_input + ",0)");

  export function fn_salir() {
    Usuario.fn_sesion_en_proceso().then((response: any) => {
      if (response && response.SesionEnProcesoResult == 1) {
        Usuario.fn_cerrar_sesion().then((result: any) => {
          if (result && result.CerrarSesionResult == 1) {
            fn_destroy_for_login();
          }
        });
      } else if (response.SesionEnProcesoResult == 0) {
        fn_destroy_for_login();
      } else {
        MainPage.fn_show_message("¡Ocurrio un error!");
      }
    });
  }

  function fn_destroy_for_login() {
    Dashboard.fn_destroy();
    mnu_content = null;
    mnu_opts = null;
    confirm_dialog = null;
    //  Main.fn_mostrar_login();
  }
}
