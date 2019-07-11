"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const MainPage_1 = require("../MainPage");
const template_1 = require("../controles/template");
const control_svg_carga_1 = require("../controles/control_svg_carga");
const Utils_1 = require("../general/Utils");
var infoEntrega;
(function (infoEntrega) {
    let prop_content_infoentrega = null;
    let prop_ejecutandoClick = false;
    let prop_listaControlD3 = null;
    let prop_g_detalles_InfoEntrega = null;
    let listRutaPuntos;
    let background_prop_item = "#ffffff";
    let lastVisited = 0;
    function fn_createviewinfo() {
        if (MainPage_1.MainPage._template_infoentrega == null) {
            MainPage_1.MainPage._template_infoentrega = template_1.Template.fun_main({
                el_content: MainPage_1.MainPage.prop_contenedor_principal,
                prop_height_footer: 0,
                prop_height_header: 50,
                prop_orientation: "portrait",
            });
            MainPage_1.MainPage.prop_content_template = MainPage_1.MainPage._template_infoentrega.fun_get_g_content();
            let g_contentCarga = MainPage_1.MainPage._template_infoentrega.fun_get_g_content().append("g")
                .classed("g_content_crga", true);
            fn_crearControlCarga(g_contentCarga);
        }
        let g_header_infoEntrega = MainPage_1.MainPage._template_infoentrega.fun_get_g_header().append(() => Utils_1.D3Utils.fn_crear_encabezado_atras(() => {
            window.location.assign("#DsH");
        }).node());
        g_header_infoEntrega.select(".title-text").text("Informacion de Entrega");
        prop_content_infoentrega = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        prop_content_infoentrega.classed("g_content_infoentrega", true);
        let g_content_titles = prop_content_infoentrega.append("g")
            .attr("width", MainPage_1.MainPage._template_infoentrega.fun_get_width() - 20)
            .attr("transform", "translate(10,5)");
        g_content_titles.append("text")
            .text("Nombre de la sucursal")
            .attr("x", "15")
            .attr("y", "30")
            .style("fill", Utils_1.D3Utils.prop_color_primary)
            .style("font-size", "18")
            .style("font-weight", "bold");
        g_content_titles.append("text")
            .text("cemento")
            .attr("x", "15")
            .attr("y", "80")
            .style("fill", "#000000")
            .style("font-size", "18")
            .style("font-weight", "bold");
        g_content_titles.append("text")
            .text("Barilla")
            .attr("x", "15")
            .attr("y", "120")
            .style("fill", "#000000")
            .style("font-size", "18")
            .style("font-weight", "bold");
        MainPage_1.MainPage.prop_content_template.append(() => prop_content_infoentrega.node());
        let g_content_client = prop_content_infoentrega.append("g")
            .attr("transform", "translate(0,50)");
        prop_g_detalles_InfoEntrega = g_content_client;
    }
    infoEntrega.fn_createviewinfo = fn_createviewinfo;
    function fn_actualizarVentana() {
        MainPage_1.MainPage._template_infoentrega.prop_element.setAttribute("style", "display: block;");
    }
    function fn_crearControlCarga(parent) {
        if (MainPage_1.MainPage.prop_cargaLogin == null) {
            MainPage_1.MainPage.prop_cargaLogin = control_svg_carga_1.Carga.fun_main({
                prop_diametro: 150,
                width: MainPage_1.MainPage._template_infoentrega.fun_get_width(),
                height: MainPage_1.MainPage._template_infoentrega.fun_get_height_content(),
                opacity: 0.7,
                background: "#ffffff",
                color: "#000000",
                el_contenedor_padre: parent
            });
        }
    }
    function fn_destroyinfo() {
        prop_listaControlD3 = null;
        prop_g_detalles_InfoEntrega = null;
        MainPage_1.MainPage._template_infoentrega.prop_element.remove();
        MainPage_1.MainPage._template_infoentrega = null;
    }
    infoEntrega.fn_destroyinfo = fn_destroyinfo;
})(infoEntrega = exports.infoEntrega || (exports.infoEntrega = {}));
