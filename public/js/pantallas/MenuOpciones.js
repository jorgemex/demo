"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const control_svg_lista_1 = require("../controles/control_svg_lista");
const MainPage_1 = require("../MainPage");
const Utils_1 = require("../general/Utils");
var MenuOpciones;
(function (MenuOpciones) {
    let prop_listaMenuD3 = null;
    MenuOpciones.mnu_content = null;
    MenuOpciones.mnu_opts = null;
    let _menu;
    let _height_item_menu = 35;
    MenuOpciones.isMenuShown = false;
    MenuOpciones.isMnuOptnsShown = false;
    MenuOpciones.confirm_dialog = null;
    console.log("menu", prop_listaMenuD3);
    function fn_mostrar_ocultar_opciones(parent) {
        if (!MenuOpciones.isMnuOptnsShown) {
            if (MenuOpciones.mnu_opts == null) {
                MenuOpciones.mnu_opts = parent.append("g").style("pointer-events", "all");
                MenuOpciones.mnu_opts
                    .append("rect")
                    .attr("x", "0")
                    .attr("y", "0")
                    .attr("width", MainPage_1.MainPage._template.fun_get_width())
                    .attr("height", MainPage_1.MainPage._template.fun_get_height_content() +
                    MainPage_1.MainPage._template.fun_get_height_header() +
                    MainPage_1.MainPage._template.fun_get_height_footer())
                    .style("fill", "#000000")
                    .style("opacity", "0.04");
                MenuOpciones.mnu_opts.call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                    fn_hide_menu_opciones();
                });
                let list_in = MenuOpciones.mnu_opts
                    .append("g")
                    .style("fill", Utils_1.D3Utils.prop_color_acent)
                    .attr("transform", "translate(" +
                    (MainPage_1.MainPage._template.fun_get_width() / 2 - 11) +
                    ", " +
                    (Utils_1.D3Utils.prop_height_header + 3) +
                    ")");
                list_in
                    .append("path")
                    .attr("fill", "#262626")
                    .attr("transform", "translate(167, -12)")
                    .attr("d", "M32 16 L16 0 L0 16");
                _menu = [
                    { ID: 1, Title: "Sitios", TextColor: "white" },
                    { ID: 2, Title: "Información de entrega", TextColor: "white" }
                ];
                list_in
                    .append("rect")
                    .attr("x", "0")
                    .attr("y", "0")
                    .attr("height", _height_item_menu * _menu.length + 8)
                    .attr("width", MainPage_1.MainPage._template.fun_get_width() / 2 + 8)
                    .attr("rx", 8)
                    .attr("ry", 8)
                    .style("fill", "#262626")
                    .classed("shadowed-card", true);
                let list_in2 = list_in.append("g").attr("transform", "translate(4, 4)");
                fn_crear_tabla_lista(list_in2, _menu, MainPage_1.MainPage._template.fun_get_width() / 2, _height_item_menu * _menu.length, Utils_1.D3Utils.prop_color_acent, fn_item_selected_options);
            }
            else {
                MenuOpciones.mnu_opts.style("display", "block");
            }
            MenuOpciones.isMnuOptnsShown = true;
        }
        else {
            fn_hide_menu_opciones();
        }
    }
    MenuOpciones.fn_mostrar_ocultar_opciones = fn_mostrar_ocultar_opciones;
    function fn_hide_menu_opciones() {
        MenuOpciones.mnu_opts.style("display", "none");
        MenuOpciones.isMnuOptnsShown = false;
    }
    function fn_item_selected_options(datum, index, outerIndex) {
        if (d3.event.defaultPrevented)
            return;
        fn_hide_menu_opciones();
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
    function fn_crear_tabla_lista(contenedor, data, wth_menu, hgt_menu, background_color, callback) {
        prop_listaMenuD3 = control_svg_lista_1.Lista.fun_main({
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
                on: {
                    click: callback
                },
                fun_on_dibuja_fila: (g_fila, datum, cx, cy) => {
                    fn_crear_fila_menu(d3.select(g_fila), datum);
                },
                fun_on_actualiza_fila: (g_fila, datum, cx, cy) => { }
            }
        });
        contenedor
            .append(() => prop_listaMenuD3.element)
            .attr("transform", "translate(0,0)");
    }
    function fn_crear_fila_menu(fila, datum) {
        let g_content_texts = fila
            .append("g")
            .attr("transform", "translate(10, 0)");
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
})(MenuOpciones = exports.MenuOpciones || (exports.MenuOpciones = {}));
