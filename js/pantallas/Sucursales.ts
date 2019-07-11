import * as d3 from 'd3';
import { MainPage } from "../MainPage";
import { Template } from "../controles/template";
import { Carga } from '../controles/control_svg_carga';
import { Lista } from '../controles/control_svg_lista';
import { Entidades } from '../general/Entidades';
import { D3Utils } from '../general/Utils';
import { RutaPuntos } from '../data/RutaPuntos';

export namespace Sucursales {
    let prop_content_sucursal: d3.Selection<any, any, any, any> = null;
    let prop_ejecutandoClick: boolean = false;
    let prop_listaControlD3: Lista.iObjetoControl = null;
    let prop_g_detalles_sucursal: d3.Selection<any, any, any, any> = null;
    let listRutaPuntos: Array<Entidades.IRutaPunto>;

    let background_prop_item = "#ffffff";
    let lastVisited = 0;

    export function fn_createView() {
        if (MainPage._template_sucursal == null) {
            MainPage._template_sucursal = Template.fun_main({
                el_content: MainPage.prop_contenedor_principal
                , prop_height_footer: 0
                , prop_height_header: 50
                , prop_orientation: "portrait"
            });

            MainPage.prop_content_template = MainPage._template_sucursal.fun_get_g_content();

            let g_contentCargaa = MainPage._template_sucursal.fun_get_g_content().append("g")
                .classed("g_content_carga", true);

            fn_crearControlCarga(g_contentCargaa);
        } else {
            fn_actualizarVentana();
            return;
        }
        //Menu
        let g_header_sucursal = MainPage._template_sucursal.fun_get_g_header().append(() => D3Utils.fn_crear_encabezado_atras(() => {
            window.location.assign("#DsH");
        }).node());
        g_header_sucursal.select(".title-text").text("Sitios header");


        // Body Screen
        prop_content_sucursal = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        prop_content_sucursal.classed("g_content_sucursales", true);

        let g_content_titles = prop_content_sucursal.append("g")
            .attr("width", MainPage._template_sucursal.fun_get_width() - 20)
            .attr("transform", "translate(10, 5)");

        g_content_titles.append("text")
            .text("Nº")
            .attr("x", "15")
            .attr("y", "30")
            .style("fill", D3Utils.prop_color_primary)
            .style("font-size", "18")
            .style("font-weight", "bold");

        g_content_titles.append("text")
            .text("Sitio")
            .attr("x", "60")
            .attr("y", "30")
            .style("fill", D3Utils.prop_color_primary)
            .style("font-size", "18")
            .style("font-weight", "bold");


        MainPage.prop_content_template.append(() => prop_content_sucursal.node());

        //Lista sucursales
        let g_content_client = prop_content_sucursal.append("g")
            .attr("transform", "translate(0, 50)");

        prop_g_detalles_sucursal = g_content_client;

        fn_load_sucursales();
    }

    function fn_crearControlCarga(parent: d3.Selection<any, any, any, any>) {
        if (MainPage.prop_cargaLogin == null) {
            MainPage.prop_cargaLogin = Carga.fun_main({
                prop_diametro: 150,
                width: MainPage._template_sucursal.fun_get_width(),
                height: MainPage._template_sucursal.fun_get_height_content(),
                opacity: 0.7,
                background: "#ffffff",
                color: "#000000",
                el_contenedor_padre: parent
            });
        }
    }

    function fn_load_sucursales() {//Cargar lista de sucursales
        RutaPuntos.fn_get_all_rutas().then(function (result: any) {
            let temp_routes: Array<Entidades.IRutaPunto> = [];
            let i = 0;

            result.forEach((item: any, pos: number) => {
                if (pos == 0 && !D3Utils.consider_base_route)
                    return;

                if (item.FechaSalida != null)
                    lastVisited = i + 1;
                else if (item.FechaLlegada != null)
                    lastVisited = i;

                temp_routes.push(item);

                i++;
            });

            let listRutaPuntos = temp_routes.filter((item: any, i: number) => i <= lastVisited);

            fn_crear_lista_sucursales(prop_g_detalles_sucursal, listRutaPuntos);
        });
    }

    function fn_actualizarVentana() {
        MainPage._template_sucursal.prop_element.setAttribute("style", "display: block;");

        fn_load_sucursales();
    }


    function fn_crear_lista_sucursales(contenedor: d3.Selection<any, any, any, any>, data: Array<Entidades.IRutaPunto>) {
        if (prop_listaControlD3 == null) {
            prop_listaControlD3 = Lista.fun_main({
                height: MainPage._template_sucursal.fun_get_height_content() - 50,
                width: MainPage._template_sucursal.fun_get_width(),
                prop_data: data,
                prop_campo_clave_fila: "key",
                prop_scroll: {
                    prop_mantener_scroll: true,
                    prop_virtualScroll: true,
                    prop_activarScrollY: true,
                    prop_evento_scroll: {
                        scroll: () => {
                            //get
                        }
                    }
                },
                prop_config_fila: {
                    prop_height: 45,
                    prop_background: background_prop_item,
                    prop_border_width: 1,
                    prop_border_color: "#EDEDEDFF",
                    fun_on_dibuja_fila: (g_fila: SVGGElement, datum: Entidades.IRutaPunto, cx: number, cy: number, i: number) => {
                        fn_crear_fila_lista(d3.select(g_fila), datum, i);
                    },
                    fun_on_actualiza_fila: null
                }
            });

            contenedor.append(() => prop_listaControlD3.element).attr("transform", "translate(0,0)");
        } else {
            fn_actualizarDatosTabla(data);
        }
    }

    export function fn_actualizarDatosTabla(data: Array<Entidades.IRutaPunto>) {
        if (prop_listaControlD3) {
            if (prop_content_sucursal.style("display") != "none") {
                prop_listaControlD3.config.prop_data = data;
            }
        }
    }

    function fn_crear_fila_lista(fila: d3.Selection<any, any, any, any>, datum: Entidades.IRutaPunto, i: number): void {
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

            if (diff <= D3Utils.visit_time) {
                circle_test.attr("fill", "#4CAF50");
                tx_num.attr("fill", "white");
            } else {
                circle_test.attr("fill", "orange");//
                tx_num.attr("fill", "white");
            }

        } else if (i < lastVisited) {
            circle_test.attr("fill", "#F44336");
            tx_num.attr("fill", "white");
        } else if (datum.FechaLlegada == null && datum.FechaSalida == null) {
            circle_test.style("stroke-width", "2")
                .style("stroke", "#cacaca")
            tx_num.attr("fill", "#cacaca");
        } else {
            circle_test.style("stroke-width", "2")
                .style("stroke", "orange")
            tx_num.attr("fill", "orange");
        }

        g_content_texts.append("text")
            .classed("text_nombre_sucursal", true)
            .attr("font-size", "16")
            .attr("text-anchor", "start")
            .attr("x", "60")
            .attr("y", "25")
            .attr("fill", D3Utils.prop_color_primary)
            .style("opacity", "0.95")
            .text(() => {
                return datum.NombreSitio;
            });

        fila.append("line")
            .attr("y1", "39")
            .attr("x2", (MainPage._template_sucursal.fun_get_width()))
            .attr("y2", "39")
            .attr("stroke-width", "1")
            .attr("stroke", "#e4e4e4");

    }

    export function fn_destroy() {
        prop_listaControlD3 = null;
        prop_g_detalles_sucursal = null;

        MainPage._template_sucursal.prop_element.remove();
        MainPage._template_sucursal = null;
    }

}