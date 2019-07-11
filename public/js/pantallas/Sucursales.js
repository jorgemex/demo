"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const MainPage_1 = require("../MainPage");
const template_1 = require("../controles/template");
const control_svg_carga_1 = require("../controles/control_svg_carga");
const control_svg_lista_1 = require("../controles/control_svg_lista");
const Utils_1 = require("../general/Utils");
const RutaPuntos_1 = require("../data/RutaPuntos");
var Sucursales;
(function (Sucursales) {
    let prop_content_sucursal = null;
    let prop_ejecutandoClick = false;
    let prop_listaControlD3 = null;
    let prop_g_detalles_sucursal = null;
    let listRutaPuntos;
    let background_prop_item = "#ffffff";
    let lastVisited = 0;
    function fn_createView() {
        if (MainPage_1.MainPage._template_sucursal == null) {
            MainPage_1.MainPage._template_sucursal = template_1.Template.fun_main({
                el_content: MainPage_1.MainPage.prop_contenedor_principal,
                prop_height_footer: 0,
                prop_height_header: 50,
                prop_orientation: "portrait"
            });
            MainPage_1.MainPage.prop_content_template = MainPage_1.MainPage._template_sucursal.fun_get_g_content();
            let g_contentCargaa = MainPage_1.MainPage._template_sucursal.fun_get_g_content().append("g")
                .classed("g_content_carga", true);
            fn_crearControlCarga(g_contentCargaa);
        }
        else {
            fn_actualizarVentana();
            return;
        }
        let g_header_sucursal = MainPage_1.MainPage._template_sucursal.fun_get_g_header().append(() => Utils_1.D3Utils.fn_crear_encabezado_atras(() => {
            window.location.assign("#DsH");
        }).node());
        g_header_sucursal.select(".title-text").text("Sitios header");
        prop_content_sucursal = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        prop_content_sucursal.classed("g_content_sucursales", true);
        let g_content_titles = prop_content_sucursal.append("g")
            .attr("width", MainPage_1.MainPage._template_sucursal.fun_get_width() - 20)
            .attr("transform", "translate(10, 5)");
        g_content_titles.append("text")
            .text("Nº")
            .attr("x", "15")
            .attr("y", "30")
            .style("fill", Utils_1.D3Utils.prop_color_primary)
            .style("font-size", "18")
            .style("font-weight", "bold");
        g_content_titles.append("text")
            .text("Sitio")
            .attr("x", "60")
            .attr("y", "30")
            .style("fill", Utils_1.D3Utils.prop_color_primary)
            .style("font-size", "18")
            .style("font-weight", "bold");
        MainPage_1.MainPage.prop_content_template.append(() => prop_content_sucursal.node());
        let g_content_client = prop_content_sucursal.append("g")
            .attr("transform", "translate(0, 50)");
        prop_g_detalles_sucursal = g_content_client;
        fn_load_sucursales();
    }
    Sucursales.fn_createView = fn_createView;
    function fn_crearControlCarga(parent) {
        if (MainPage_1.MainPage.prop_cargaLogin == null) {
            MainPage_1.MainPage.prop_cargaLogin = control_svg_carga_1.Carga.fun_main({
                prop_diametro: 150,
                width: MainPage_1.MainPage._template_sucursal.fun_get_width(),
                height: MainPage_1.MainPage._template_sucursal.fun_get_height_content(),
                opacity: 0.7,
                background: "#ffffff",
                color: "#000000",
                el_contenedor_padre: parent
            });
        }
    }
    function fn_load_sucursales() {
        RutaPuntos_1.RutaPuntos.fn_get_all_rutas().then(function (result) {
            let temp_routes = [];
            let i = 0;
            result.forEach((item, pos) => {
                if (pos == 0 && !Utils_1.D3Utils.consider_base_route)
                    return;
                if (item.FechaSalida != null)
                    lastVisited = i + 1;
                else if (item.FechaLlegada != null)
                    lastVisited = i;
                temp_routes.push(item);
                i++;
            });
            let listRutaPuntos = temp_routes.filter((item, i) => i <= lastVisited);
            fn_crear_lista_sucursales(prop_g_detalles_sucursal, listRutaPuntos);
        });
    }
    function fn_actualizarVentana() {
        MainPage_1.MainPage._template_sucursal.prop_element.setAttribute("style", "display: block;");
        fn_load_sucursales();
    }
    function fn_crear_lista_sucursales(contenedor, data) {
        if (prop_listaControlD3 == null) {
            prop_listaControlD3 = control_svg_lista_1.Lista.fun_main({
                height: MainPage_1.MainPage._template_sucursal.fun_get_height_content() - 50,
                width: MainPage_1.MainPage._template_sucursal.fun_get_width(),
                prop_data: data,
                prop_campo_clave_fila: "key",
                prop_scroll: {
                    prop_mantener_scroll: true,
                    prop_virtualScroll: true,
                    prop_activarScrollY: true,
                    prop_evento_scroll: {
                        scroll: () => {
                        }
                    }
                },
                prop_config_fila: {
                    prop_height: 45,
                    prop_background: background_prop_item,
                    prop_border_width: 1,
                    prop_border_color: "#EDEDEDFF",
                    fun_on_dibuja_fila: (g_fila, datum, cx, cy, i) => {
                        fn_crear_fila_lista(d3.select(g_fila), datum, i);
                    },
                    fun_on_actualiza_fila: null
                }
            });
            contenedor.append(() => prop_listaControlD3.element).attr("transform", "translate(0,0)");
        }
        else {
            fn_actualizarDatosTabla(data);
        }
    }
    function fn_actualizarDatosTabla(data) {
        if (prop_listaControlD3) {
            if (prop_content_sucursal.style("display") != "none") {
                prop_listaControlD3.config.prop_data = data;
            }
        }
    }
    Sucursales.fn_actualizarDatosTabla = fn_actualizarDatosTabla;
    function fn_crear_fila_lista(fila, datum, i) {
        let g_content_texts = fila.append("g")
            .attr("transform", "translate(10, 0)")
            .classed("g_fila_content_lista", true);
        let g_circle = g_content_texts.append("g")
            .attr("transform", "translate(10, 6)");
        let circle_test = g_circle.append("rect")
            .attr("width", "26")
            .attr("height", "26")
            .attr("rx", "50%")
            .attr("ry", "50%");
        let tx_num = g_circle.append("text")
            .classed("text_num_sucursal", true)
            .attr("font-size", "18")
            .attr("x", "13")
            .attr("text-anchor", "middle")
            .attr("y", "19")
            .text(() => {
            return (i + 1);
        });
        if (datum.FechaLlegada != null && datum.FechaSalida != null) {
            let dtSalida = new Date(datum.FechaSalida);
            let dtLlegada = new Date(datum.FechaLlegada);
            let diff = dtSalida.getTime() - dtLlegada.getTime();
            diff = Math.trunc(diff / 60000);
            if (diff <= Utils_1.D3Utils.visit_time) {
                circle_test.attr("fill", "#4CAF50");
                tx_num.attr("fill", "white");
            }
            else {
                circle_test.attr("fill", "orange");
                tx_num.attr("fill", "white");
            }
        }
        else if (i < lastVisited) {
            circle_test.attr("fill", "#F44336");
            tx_num.attr("fill", "white");
        }
        else if (datum.FechaLlegada == null && datum.FechaSalida == null) {
            circle_test.style("stroke-width", "2")
                .style("stroke", "#cacaca");
            tx_num.attr("fill", "#cacaca");
        }
        else {
            circle_test.style("stroke-width", "2")
                .style("stroke", "orange");
            tx_num.attr("fill", "orange");
        }
        g_content_texts.append("text")
            .classed("text_nombre_sucursal", true)
            .attr("font-size", "16")
            .attr("text-anchor", "start")
            .attr("x", "60")
            .attr("y", "25")
            .attr("fill", Utils_1.D3Utils.prop_color_primary)
            .style("opacity", "0.95")
            .text(() => {
            return datum.NombreSitio;
        });
        fila.append("line")
            .attr("y1", "39")
            .attr("x2", (MainPage_1.MainPage._template_sucursal.fun_get_width()))
            .attr("y2", "39")
            .attr("stroke-width", "1")
            .attr("stroke", "#e4e4e4");
    }
    function fn_destroy() {
        prop_listaControlD3 = null;
        prop_g_detalles_sucursal = null;
        MainPage_1.MainPage._template_sucursal.prop_element.remove();
        MainPage_1.MainPage._template_sucursal = null;
    }
    Sucursales.fn_destroy = fn_destroy;
})(Sucursales = exports.Sucursales || (exports.Sucursales = {}));
