"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const Utils_1 = require("../general/Utils");
const MainPage_1 = require("../MainPage");
const Usuario_1 = require("../data/Usuario");
const dashboard_1 = require("../pantallas/dashboard");
var dialogs;
(function (dialogs) {
    dialogs.confirm_dialog = null;
    dialogs.mnu_content = null;
    dialogs.mnu_opts = null;
    dialogs.prop_inputInfMotivo = null;
    var pos_y_select_input = 0;
    let margin_default = 25;
    let g_main_container = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
    g_main_container
        .classed("svg_frmLogin", true)
        .attr("transform", "translate(" + margin_default + ", 0)");
    function show_confirm_dialog(title, body, okCallback, cancelCallback) {
        if (dialogs.confirm_dialog == null) {
            let hgt_alert_dlg = 150, wth_alert_dlg = 250;
            dialogs.confirm_dialog = MainPage_1.MainPage.svg_top_parent
                .append("g")
                .style("pointer-events", "all");
            dialogs.confirm_dialog
                .append("rect")
                .attr("width", MainPage_1.MainPage._template.fun_get_width())
                .attr("height", MainPage_1.MainPage._template.fun_get_height_content() +
                MainPage_1.MainPage._template.fun_get_height_header() +
                MainPage_1.MainPage._template.fun_get_height_footer())
                .style("fill", "#000000")
                .style("opacity", "0.1");
            let content_in = dialogs.confirm_dialog
                .append("g")
                .style("fill", "#262626")
                .attr("transform", "translate(" +
                (MainPage_1.MainPage._template.fun_get_width() - wth_alert_dlg) / 2 +
                ", " +
                (MainPage_1.MainPage._template.fun_get_height_content() - hgt_alert_dlg) / 2 +
                ")")
                .classed("shadowed-card", true);
            content_in
                .append("rect")
                .attr("height", hgt_alert_dlg)
                .attr("width", wth_alert_dlg)
                .attr("rx", 8)
                .attr("ry", 8)
                .style("fill", "#262626");
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
                .attr("stroke", Utils_1.D3Utils.prop_color_acent)
                .attr("stroke-opacity", 0.3);
            let txt_content = content_in
                .append("text")
                .text(body)
                .attr("x", wth_alert_dlg / 2)
                .attr("y", "65")
                .style("fill", "gray")
                .style("font-size", "18")
                .attr("text-anchor", "middle")
                .style("font-weight", "bold");
            Utils_1.D3Utils.wrap(txt_content, wth_alert_dlg - 6, 19, "...", 3);
            content_in
                .append("rect")
                .attr("height", 30)
                .attr("width", wth_alert_dlg)
                .attr("rx", 8)
                .attr("ry", 8)
                .attr("x", 0)
                .attr("y", 120)
                .style("fill", Utils_1.D3Utils.prop_color_acent);
            let wth_button = wth_alert_dlg / 2, hgt_button = 30;
            let g_container_button = content_in
                .append("g")
                .attr("transform", "translate(0, " + 120 + ")")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                if (d3.event.defaultPrevented)
                    return;
                dialogs.confirm_dialog.style("display", "none");
                if (cancelCallback)
                    cancelCallback();
            });
            createButton(g_container_button, wth_button, hgt_button, "Cancelar");
            let g_container_button2 = content_in
                .append("g")
                .attr("transform", "translate(" + (wth_alert_dlg - wth_button) + ", " + 120 + ")")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                if (d3.event.defaultPrevented)
                    return;
                dialogs.confirm_dialog.style("display", "none");
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
        }
        else {
            dialogs.confirm_dialog.style("display", "block");
        }
    }
    dialogs.show_confirm_dialog = show_confirm_dialog;
    function show_alert_dialog(title, body, cancelCallback) {
        if (dialogs.confirm_dialog == null) {
            let hgt_alert_dlg = 150, wth_alert_dlg = 250;
            dialogs.confirm_dialog = MainPage_1.MainPage.svg_top_parent
                .append("g")
                .style("pointer-events", "all");
            dialogs.confirm_dialog
                .append("rect")
                .attr("width", MainPage_1.MainPage._template.fun_get_width())
                .attr("height", MainPage_1.MainPage._template.fun_get_height_content() +
                MainPage_1.MainPage._template.fun_get_height_header() +
                MainPage_1.MainPage._template.fun_get_height_footer())
                .style("fill", "#000000")
                .style("opacity", "0.1");
            let content_in = dialogs.confirm_dialog
                .append("g")
                .style("fill", "aliceblue")
                .attr("transform", "translate(" +
                (MainPage_1.MainPage._template.fun_get_width() - wth_alert_dlg) / 2 +
                ", " +
                (MainPage_1.MainPage._template.fun_get_height_content() - hgt_alert_dlg) / 2 +
                ")")
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
            Utils_1.D3Utils.wrap(txt_content, wth_alert_dlg - 6, 19, "...", 3);
            let wth_button = wth_alert_dlg, hgt_button = 30;
            let g_container_button = content_in
                .append("g")
                .attr("transform", "translate(0, " + 120 + ")")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                if (d3.event.defaultPrevented)
                    return;
                dialogs.confirm_dialog.style("display", "none");
                if (cancelCallback)
                    cancelCallback();
            });
            createButton(g_container_button, wth_button, hgt_button, "Aceptar");
        }
        else {
            dialogs.confirm_dialog.style("display", "block");
        }
    }
    dialogs.show_alert_dialog = show_alert_dialog;
    function createButton(g_container_button, wth_button, hgt_button, text) {
        let ggg = g_container_button
            .append("g")
            .attr("transform", "translate(0, 0)")
            .classed("centerText", true);
        let button2 = ggg
            .append("g")
            .style("fill", Utils_1.D3Utils.prop_color_acent)
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
            .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
            if (d3.event.defaultPrevented)
                return;
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
    function fn_salir() {
        Usuario_1.Usuario.fn_sesion_en_proceso().then((response) => {
            if (response && response.SesionEnProcesoResult == 1) {
                Usuario_1.Usuario.fn_cerrar_sesion().then((result) => {
                    if (result && result.CerrarSesionResult == 1) {
                        fn_destroy_for_login();
                    }
                });
            }
            else if (response.SesionEnProcesoResult == 0) {
                fn_destroy_for_login();
            }
            else {
                MainPage_1.MainPage.fn_show_message("¡Ocurrio un error!");
            }
        });
    }
    dialogs.fn_salir = fn_salir;
    function fn_destroy_for_login() {
        dashboard_1.Dashboard.fn_destroy();
        dialogs.mnu_content = null;
        dialogs.mnu_opts = null;
        dialogs.confirm_dialog = null;
    }
})(dialogs = exports.dialogs || (exports.dialogs = {}));
