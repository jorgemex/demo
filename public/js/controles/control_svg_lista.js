"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const Utils_1 = require("../general/Utils");
const control_svg_scroll_1 = require("../controles/control_svg_scroll");
var Lista;
(function (Lista) {
    function fun_main(config) {
        let propiedades = {};
        let lista = config.prop_data;
        Object.defineProperty(config, "prop_data", {
            set: function (value) {
                this._prop_data = value;
                fun_actualizar(propiedades);
            },
            get: function () {
                return this._prop_data;
            }
        });
        propiedades.prop_config = config;
        propiedades.el_g_contenedor = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"))
            .classed("g-control-lista", true)
            .property("propiedades", propiedades);
        propiedades.el_g_contenedor.style("pointer-events", "all");
        propiedades.el_g_contenedor_items = propiedades.el_g_contenedor.append("g")
            .classed("lista-g-contenedor", true);
        let obj_control = {
            element: propiedades.el_g_contenedor.node(),
            config: propiedades.prop_config,
            fun_actualizar: () => fun_actualizar(propiedades),
            fun_seleccionar_fila: (id_row) => { fun_seleccionar_fila(propiedades, id_row, true); },
            fun_deseleccionar_fila: () => { fun_deseleccionar_fila(propiedades); },
            fun_ir_a: (id_row) => { fun_ir_a(propiedades, id_row); },
            fun_ocultar_filas: (ids_fila, todos) => fun_toggle_ocultar_filas(propiedades, true, ids_fila, todos),
            fun_mostrar_filas: (ids_fila, todos) => fun_toggle_ocultar_filas(propiedades, false, ids_fila, todos),
            fun_buscar: (buscar, columnas) => { fun_filtrar(propiedades, buscar, columnas); },
            fun_resultado_busqueda: () => fun_resultado_busqueda(propiedades),
            fun_ordenar: (columna, tipo) => { fun_ordenar(propiedades, columna, tipo); },
            fun_actualizar_fila: (id_fila) => fun_actualizar_fila(propiedades, id_fila)
        };
        propiedades.prop_config.prop_data = lista;
        return obj_control;
    }
    Lista.fun_main = fun_main;
    function fun_init_properties(propiedades) {
        if (propiedades.prop_config.prop_config_fila.isSelectable === undefined)
            propiedades.prop_config.prop_config_fila.isSelectable = false;
        if (propiedades.prop_index_fila_top === undefined)
            propiedades.prop_index_fila_top = 0;
        if (propiedades.prop_config.prop_config_ordenar === undefined)
            propiedades.prop_config.prop_config_ordenar = null;
        if (propiedades.prop_map_g_elemento_fila === undefined)
            propiedades.prop_map_g_elemento_fila = d3.map([], (d) => d.prop_clave);
        if (propiedades.prop_map_ids_fila_oculto === undefined)
            propiedades.prop_map_ids_fila_oculto = d3.map([], (d) => d);
        if (!propiedades.prop_config.prop_scroll)
            propiedades.prop_config.prop_scroll = {};
        if (!propiedades.prop_config.prop_scroll.prop_evento_scroll)
            propiedades.prop_config.prop_scroll.prop_evento_scroll = {};
        if (!propiedades.prop_config.prop_config_fila.on)
            propiedades.prop_config.prop_config_fila.on = {};
        if (!propiedades.prop_config.prop_config_fila.prop_configBorde)
            propiedades.prop_config.prop_config_fila.prop_configBorde = {};
        if (!propiedades.prop_config.prop_config_fila.prop_background_sec)
            propiedades.prop_config.prop_config_fila.prop_background_sec = propiedades.prop_config.prop_config_fila.prop_background;
        if (!propiedades.prop_control_scroll && (propiedades.prop_config.prop_scroll.prop_activarScrollX || propiedades.prop_config.prop_scroll.prop_activarScrollY)) {
            let config = {
                prop_height: propiedades.prop_config.height,
                prop_width: propiedades.prop_config.width,
                prop_height_total: 0,
                prop_stroke_width: 10,
                prop_stroke: "#666666",
                prop_background_color: propiedades.prop_config.prop_background,
                mostrar_scroll_x: propiedades.prop_config.prop_scroll.prop_activarScrollX,
                mostrar_scroll_y: propiedades.prop_config.prop_scroll.prop_activarScrollY,
                event_scroll: {
                    scroll_start: () => {
                        if (propiedades.prop_config.prop_scroll.prop_evento_scroll.scroll_start)
                            propiedades.prop_config.prop_scroll.prop_evento_scroll.scroll_start();
                    }, scroll: function () {
                        if (propiedades.prop_config.prop_scroll.prop_virtualScroll)
                            fun_get_fila_visible(propiedades);
                        if (propiedades.prop_config.prop_scroll.prop_evento_scroll.scroll)
                            propiedades.prop_config.prop_scroll.prop_evento_scroll.scroll();
                        if (d3.event && d3.event.sourceEvent)
                            d3.select(this).property("es_drag", true);
                    }, scroll_end: function () {
                        if (propiedades.prop_config.prop_scroll.prop_evento_scroll.scroll_end)
                            propiedades.prop_config.prop_scroll.prop_evento_scroll.scroll_end();
                        if (d3.select(this).property("es_drag"))
                            if (d3.event && d3.event.sourceEvent) {
                                d3.event.sourceEvent.preventDefault();
                                d3.select(this).property("es_drag", false);
                            }
                    },
                }
            };
            propiedades.prop_control_scroll = control_svg_scroll_1.Scroll.fun_main(propiedades.el_g_contenedor_items.node(), config);
        }
    }
    function is_DataCustom(datum) {
        return datum.prop_dato !== undefined;
    }
    function fun_calcular_posicion_lista_filas(propiedades, lista) {
        let lista_custom = [];
        if (lista.length === 0)
            return lista_custom;
        let sum_alto = 0;
        if (is_DataCustom(lista[0])) {
            for (let index = 0; index < lista.length; index++) {
                let e_data_fila = lista[index];
                if (e_data_fila.prop_ocultar)
                    continue;
                if (e_data_fila.prop_id === undefined)
                    e_data_fila.prop_id = index;
                if (e_data_fila.prop_height === null || e_data_fila.prop_height === undefined)
                    e_data_fila.prop_height = propiedades.prop_config.prop_config_fila.prop_height;
                if (propiedades.prop_config.prop_campo_height_fila)
                    e_data_fila.prop_height = lista[index].prop_dato[propiedades.prop_config.prop_campo_height_fila];
                e_data_fila.prop_posicion = sum_alto;
                sum_alto += e_data_fila.prop_height;
                lista_custom.push(e_data_fila);
            }
        }
        else {
            for (let index = 0; index < lista.length; index++) {
                let height_fila = propiedades.prop_config.prop_config_fila.prop_height;
                if (propiedades.prop_config.prop_campo_height_fila)
                    height_fila = lista[index][propiedades.prop_config.prop_campo_height_fila];
                let e_data_fila = {
                    prop_id: lista[index][propiedades.prop_config.prop_campo_clave_fila],
                    prop_dato: lista[index],
                    prop_height: height_fila,
                    prop_posicion: sum_alto
                };
                lista_custom.push(e_data_fila);
                sum_alto += e_data_fila.prop_height;
            }
        }
        return lista_custom;
    }
    function fun_dibuja_lista(propiedades) {
        let el_g_filas = propiedades.el_g_contenedor_items.selectAll(".list-g-list")
            .data(propiedades.prop_lista_custom_visible.filter((d) => !d.prop_ocultar), (datum) => datum.prop_id + "");
        el_g_filas.exit().remove();
        el_g_filas.enter().append((datum) => fun_get_contenedor_item(propiedades, datum))
            .attr("class", "list-g-list").attr("cursor", "default")
            .attr("visibility", "visible")
            .each(function (datum, index) { fun_dibujar_item_fila(propiedades, this, datum, index); })
            .merge(el_g_filas)
            .attr("transform", (d, i) => "translate(" + 0 + ", " + d.prop_posicion + ")")
            .call(Utils_1.D3Utils.eventos.fun_agregar_click, function (datum, index, all_element) { fun_on_click_fila(propiedades, this, datum, index, all_element); })
            .on("mouseenter.default", function (datum, index) { fun_on_mouseenter_fila(propiedades, datum, index, this); })
            .on("mouseleave.default", function (datum, index) { fun_on_mouseout_fila(propiedades, datum, index, this); })
            .each(function (datum, index) { fun_actualizar_item_fila(propiedades, this, datum, index); });
        if (propiedades.prop_id_fila_seleccionada != undefined)
            fun_seleccionar_fila(propiedades, propiedades.prop_id_fila_seleccionada, false);
    }
    function fun_get_contenedor_item(propiedades, datum) {
        if (propiedades.prop_map_g_elemento_fila.has(datum.prop_id + ""))
            return propiedades.prop_map_g_elemento_fila.get(datum.prop_id + "").el_g_fila;
        else
            return document.createElementNS("http://www.w3.org/2000/svg", "g");
    }
    function fun_dibujar_item_fila(propiedades, elemento, datum, index) {
        let dato_item = propiedades.prop_map_g_elemento_fila.get(datum.prop_id + "");
        if (!dato_item) {
            let el_fila_actual = d3.select(elemento);
            el_fila_actual.append("rect").attr("class", "list-row-rect");
            if (propiedades.prop_config.prop_config_fila.fun_on_dibuja_fila) {
                propiedades.prop_config.prop_config_fila.fun_on_dibuja_fila(elemento, datum.prop_dato, propiedades.prop_config.width / 2, datum.prop_height / 2, propiedades.prop_index_fila_top + index);
            }
            fun_agregar_borde_fila(propiedades, el_fila_actual, datum, index);
        }
    }
    function fun_actualizar_item_fila(propiedades, elemento, datum, index) {
        let dato_item = propiedades.prop_map_g_elemento_fila.get(datum.prop_id + "");
        if (!dato_item || dato_item && dato_item.prop_actualizar) {
            let el_fila_actual = d3.select(elemento);
            if (propiedades.prop_config.prop_config_fila.fun_on_actualiza_fila) {
                propiedades.prop_config.prop_config_fila.fun_on_actualiza_fila(elemento, datum.prop_dato, propiedades.prop_config.width / 2, datum.prop_height / 2, propiedades.prop_index_fila_top + index);
            }
            el_fila_actual.select(".list-row-rect")
                .attr("width", propiedades.prop_config.width)
                .attr("height", datum.prop_height)
                .attr("fill", fun_get_color_fila(propiedades, index));
            fun_agregar_borde_fila(propiedades, el_fila_actual, datum, index, true);
            propiedades.prop_map_g_elemento_fila.set(datum.prop_id + "", {
                prop_clave: datum.prop_id,
                el_g_fila: elemento,
                prop_actualizar: false
            });
        }
        d3.select(elemento).select(".list-row-rect")
            .attr("fill", fun_get_color_fila(propiedades, index));
    }
    function fun_agregar_borde_fila(propiedades, contenedor, datum, indice, actualizar = false) {
        if (!actualizar) {
            contenedor.append("line").classed("list-row-borde", true).classed("list-row-borde-top", true);
            contenedor.append("line").classed("list-row-borde", true).classed("list-row-borde-right", true);
            contenedor.append("line").classed("list-row-borde", true).classed("list-row-borde-bottom", true);
            contenedor.append("line").classed("list-row-borde", true).classed("list-row-borde-left", true);
        }
        else {
            if (propiedades.prop_config.prop_config_fila.prop_configBorde.top) {
                contenedor.select(".list-row-borde-top").attr("display", "block")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", propiedades.prop_config.width)
                    .attr("y2", 0);
            }
            else
                contenedor.select(".list-row-borde-top").attr("display", "none");
            if (propiedades.prop_config.prop_config_fila.prop_configBorde.right) {
                contenedor.select(".list-row-borde-right").attr("display", "block")
                    .attr("x1", propiedades.prop_config.width - 0)
                    .attr("y1", 0)
                    .attr("x2", propiedades.prop_config.width - 0)
                    .attr("y2", datum.prop_height);
            }
            else
                contenedor.select(".list-row-borde-right").attr("display", "none");
            if (propiedades.prop_config.prop_config_fila.prop_configBorde.bottom) {
                contenedor.select(".list-row-borde-bottom").attr("display", "block")
                    .attr("x1", 0)
                    .attr("y1", datum.prop_height - 0)
                    .attr("x2", propiedades.prop_config.width)
                    .attr("y2", datum.prop_height - 0);
            }
            else
                contenedor.select(".list-row-borde-bottom").attr("display", "none");
            if (propiedades.prop_config.prop_config_fila.prop_configBorde.left) {
                contenedor.select(".list-row-borde-left").attr("display", "block")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", datum.prop_height);
            }
            else
                contenedor.select(".list-row-borde-left").attr("display", "none");
            contenedor.selectAll(".list-row-borde")
                .attr("stroke", propiedades.prop_config.prop_config_fila.prop_border_color || "#ececec")
                .attr("stroke-width", propiedades.prop_config.prop_config_fila.prop_border_width || 0);
        }
    }
    function fun_get_color_fila(propiedades, index) {
        if ((index + propiedades.prop_index_fila_top) % 2 === 0)
            return propiedades.prop_config.prop_config_fila.prop_background;
        else
            return propiedades.prop_config.prop_config_fila.prop_background_sec;
    }
    function fun_get_indices_visible(propiedades) {
        let info = { prop_inicio: 0, prop_fin: 0 };
        let total_length = propiedades.prop_lista_custom_aux.length;
        propiedades.prop_lista_custom_aux.length;
        let scroll_top = propiedades.prop_control_scroll.fun_get_scrollTop();
        let scroll_bottom = scroll_top + propiedades.prop_config.height;
        let t_inicio = false;
        let t_fin = false;
        for (let index = 0; index < total_length && (!t_inicio || !t_fin); index++) {
            let pos_y = propiedades.prop_lista_custom_aux[index].prop_posicion;
            let alto = propiedades.prop_lista_custom_aux[index].prop_height;
            if (scroll_top >= pos_y && scroll_top <= (pos_y + alto)) {
                info.prop_inicio = index;
                t_inicio = true;
            }
            if (scroll_bottom >= pos_y && scroll_bottom <= (pos_y + alto) || index + 1 === total_length) {
                info.prop_fin = index + 1;
                t_fin = true;
            }
        }
        return info;
    }
    function fun_get_fila_visible(propiedades) {
        if (!propiedades.prop_control_scroll)
            return;
        let info = fun_get_indices_visible(propiedades);
        propiedades.prop_lista_custom_visible = propiedades.prop_lista_custom_aux.slice(info.prop_inicio, info.prop_fin);
        propiedades.prop_index_fila_top = info.prop_inicio;
        fun_dibuja_lista(propiedades);
    }
    function fun_actualizar_scroll(propiedades) {
        let total_filas = propiedades.prop_lista_custom_aux.length;
        propiedades.prop_control_scroll.config.prop_height = propiedades.prop_config.height;
        propiedades.prop_control_scroll.config.prop_width = propiedades.prop_config.width;
        if (propiedades.prop_config.prop_scroll.prop_activarScrollY)
            propiedades.prop_control_scroll.config.prop_height_total = d3.sum(propiedades.prop_lista_custom_aux, (d) => d.prop_height);
        propiedades.prop_control_scroll.fun_actualizar();
    }
    function fun_actualizar_contenido(propiedades) {
        propiedades.prop_lista_custom_aux = fun_calcular_posicion_lista_filas(propiedades, propiedades.prop_lista_custom_aux);
        if (!propiedades.prop_config.prop_scroll.prop_virtualScroll) {
            propiedades.prop_lista_custom_visible = propiedades.prop_lista_custom_aux;
            fun_dibuja_lista(propiedades);
        }
        else
            fun_get_fila_visible(propiedades);
        if (propiedades.prop_control_scroll) {
            fun_actualizar_scroll(propiedades);
            propiedades.el_g_contenedor.append(() => propiedades.prop_control_scroll.element);
        }
    }
    function fun_get_dy_scroll(propiedades) {
        if (!propiedades.prop_config.prop_scroll.prop_mantener_scroll)
            return;
        propiedades.prop_posicion_dy = 0;
        propiedades.prop_id_fila_top = undefined;
        if (propiedades.prop_lista_custom_aux !== undefined && propiedades.prop_lista_custom_aux.length > 0) {
            let top_fila_dato = null;
            let indice_top_aux = propiedades.prop_index_fila_top;
            let indice_buscado = null;
            let total_lenght = propiedades.prop_lista_custom_aux.length;
            while ((indice_buscado === null || indice_buscado < 0) && indice_top_aux < total_lenght) {
                top_fila_dato = propiedades.prop_lista_custom_aux[indice_top_aux];
                let lista = (propiedades.prop_config.prop_data || []);
                indice_buscado = lista.map((d) => d[propiedades.prop_config.prop_campo_clave_fila]).indexOf(top_fila_dato.prop_id);
                indice_top_aux += 1;
            }
            if (indice_buscado >= 0) {
                let posicion_scroll = propiedades.prop_control_scroll.fun_get_scrollTop();
                propiedades.prop_id_fila_top = top_fila_dato.prop_id;
                propiedades.prop_posicion_dy = posicion_scroll - top_fila_dato.prop_posicion;
            }
        }
    }
    function fun_actualizar(propiedades) {
        fun_init_properties(propiedades);
        fun_get_dy_scroll(propiedades);
        propiedades.prop_map_g_elemento_fila.clear();
        propiedades.prop_lista_custom = fun_calcular_posicion_lista_filas(propiedades, propiedades.prop_config.prop_data || []);
        propiedades.prop_lista_custom_aux = propiedades.prop_lista_custom.slice();
        propiedades.prop_lista_custom_visible = propiedades.prop_lista_custom.slice();
        fun_toggle_ocultar_filas(propiedades, true, propiedades.prop_map_ids_fila_oculto.values());
        if (propiedades.prop_id_fila_top !== undefined && propiedades.prop_config.prop_scroll.prop_mantener_scroll) {
            let indice_fila_top = propiedades.prop_lista_custom_aux.map((d) => d.prop_id).indexOf(propiedades.prop_id_fila_top);
            propiedades.prop_control_scroll.fun_set_scrollTop(propiedades.prop_lista_custom_aux[indice_fila_top].prop_posicion + propiedades.prop_posicion_dy);
        }
    }
    function fun_seleccionar_fila(propiedades, id_fila, ir_a_fila) {
        if (!propiedades.prop_config.prop_config_fila.prop_selectable)
            return;
        fun_deseleccionar_fila(propiedades);
        let indice_fila = propiedades.prop_lista_custom_aux.map((d) => d.prop_id).indexOf(id_fila);
        if (indice_fila >= 0) {
            propiedades.prop_id_fila_seleccionada = id_fila;
            if (ir_a_fila) {
                propiedades.prop_control_scroll.fun_set_scrollTop(propiedades.prop_lista_custom_aux[indice_fila].prop_posicion);
                if (propiedades.prop_config.prop_scroll.prop_virtualScroll)
                    fun_get_fila_visible(propiedades);
            }
            let g_fila_seleccionada = propiedades.el_g_contenedor_items.selectAll(".list-g-list")
                .filter((d, i) => d.prop_id === id_fila);
            g_fila_seleccionada.classed("list-g-list-selected", true).select(".list-row-rect")
                .attr("fill", propiedades.prop_config.prop_config_fila.prop_background_selectable || "#dddddd");
            g_fila_seleccionada.select(".list-row-text").style("font-weight", "bold");
        }
    }
    function fun_deseleccionar_fila(propiedades) {
        if (!propiedades.prop_config.prop_config_fila.prop_selectable)
            return;
        let indice_fila = null;
        if (propiedades.prop_id_fila_seleccionada !== undefined)
            indice_fila = propiedades.prop_lista_custom_aux.map((d) => d.prop_id).indexOf(propiedades.prop_id_fila_seleccionada);
        let el_g_lista = propiedades.el_g_contenedor_items.select(".list-g-list-selected")
            .classed("list-g-list-selected", false);
        el_g_lista.select(".list-row-rect").attr("fill", "green");
        el_g_lista.select(".list-row-text").attr("font-weight", "normal");
        propiedades.prop_id_fila_seleccionada = undefined;
    }
    function fun_ir_a(propiedades, id_fila) {
        let indice_fila = propiedades.prop_lista_custom_aux.map((d) => d.prop_id).indexOf(id_fila);
        if (indice_fila >= 0) {
            propiedades.prop_control_scroll.fun_set_scrollTop(propiedades.prop_lista_custom_aux[indice_fila].prop_posicion);
            if (propiedades.prop_config.prop_scroll.prop_virtualScroll)
                fun_get_fila_visible(propiedades);
        }
    }
    function fun_toggle_ocultar_filas(propiedades, toggle, ids_fila = [], todos = false) {
        let lista = [];
        if (!toggle && ids_fila.length === 0 || todos) {
            lista = propiedades.prop_lista_custom;
        }
        else {
            lista = propiedades.prop_lista_custom.filter((d) => {
                for (var index = 0, val_existe; index < ids_fila.length && !val_existe; index++)
                    val_existe = d.prop_id === ids_fila[index];
                return val_existe;
            });
        }
        for (var index = 0; index < ids_fila.length; index++) {
            if (!toggle && propiedades.prop_map_ids_fila_oculto.has(ids_fila[index] + ""))
                propiedades.prop_map_ids_fila_oculto.remove(ids_fila[index] + "");
            else if (toggle)
                propiedades.prop_map_ids_fila_oculto.set(ids_fila[index] + "", ids_fila[index]);
        }
        for (var index = 0; index < lista.length; index++)
            lista[index].prop_ocultar = toggle;
        propiedades.prop_lista_custom_aux = propiedades.prop_lista_custom.slice();
        if (propiedades.prop_filtro_activo)
            fun_filtrar(propiedades, propiedades.prop_filtro_activo.prop_buscar, propiedades.prop_filtro_activo.prop_columnas);
        else if (propiedades.prop_config.prop_config_ordenar)
            fun_ordenar(propiedades, propiedades.prop_config.prop_config_ordenar.prop_columna, propiedades.prop_config.prop_config_ordenar.prop_tipo);
        else
            fun_actualizar_contenido(propiedades);
    }
    function fun_actualizar_fila(propiedades, id_fila) {
        if (propiedades.prop_map_g_elemento_fila.has(id_fila)) {
            let dato_elemento_fila = propiedades.prop_map_g_elemento_fila.get(id_fila);
            dato_elemento_fila.prop_actualizar = true;
            if (dato_elemento_fila.el_g_fila.parentNode === null)
                return;
            let datum = d3.select(dato_elemento_fila.el_g_fila).datum();
            let indice = propiedades.prop_lista_custom_aux.indexOf(datum);
        }
        fun_toggle_ocultar_filas(propiedades, true, propiedades.prop_map_ids_fila_oculto.values());
    }
    function fun_filtrar(propiedades, buscar, columnas) {
        if (buscar === null || buscar === undefined || buscar.trim().length === 0) {
            propiedades.prop_filtro_activo = null;
            propiedades.prop_lista_custom_aux = propiedades.prop_lista_custom.slice();
        }
        else {
            propiedades.prop_filtro_activo = { prop_buscar: buscar, prop_columnas: columnas };
            propiedades.prop_lista_custom_aux = propiedades.prop_lista_custom.filter((datum) => {
                for (var index = 0, fila_coincide = false; index < columnas.length && !fila_coincide; index++) {
                    let item_campo = datum.prop_dato[columnas[index]].toString().toLocaleUpperCase();
                    fila_coincide = (item_campo.indexOf(buscar.toString().toLocaleUpperCase()) != -1);
                }
                return fila_coincide;
            });
        }
        if (!propiedades.prop_config.prop_config_ordenar)
            fun_actualizar_contenido(propiedades);
        else
            fun_ordenar(propiedades, propiedades.prop_config.prop_config_ordenar.prop_columna, propiedades.prop_config.prop_config_ordenar.prop_tipo);
    }
    function fun_ordenar(propiedades, columna, tipo = "DEFAULT") {
        let fun_sort = null;
        if (tipo === "ASC")
            fun_sort = d3.ascending;
        else if (tipo === "DESC")
            fun_sort = d3.descending;
        if (tipo === "DEFAULT") {
            propiedades.prop_config.prop_config_ordenar = null;
            if (!propiedades.prop_filtro_activo) {
                propiedades.prop_lista_custom_aux = propiedades.prop_lista_custom.slice();
                fun_actualizar_contenido(propiedades);
            }
            else
                fun_filtrar(propiedades, propiedades.prop_filtro_activo.prop_buscar, propiedades.prop_filtro_activo.prop_columnas);
        }
        else {
            propiedades.prop_config.prop_config_ordenar = { prop_tipo: tipo, prop_columna: columna };
            propiedades.prop_lista_custom_aux.sort((a, b) => fun_sort(a.prop_dato[columna], b.prop_dato[columna]));
            fun_actualizar_contenido(propiedades);
        }
    }
    function fun_resultado_busqueda(propiedades) {
        return propiedades.prop_lista_custom_aux.map((d) => d.prop_dato);
        ;
    }
    function fun_on_click_fila(propiedades, el_g_fila, datum, index, all_element) {
        if (d3.event.defaultPrevented)
            return;
        if (propiedades.prop_config.prop_config_fila.isSelectable) {
            let seleccionar = (propiedades.prop_id_fila_seleccionada == datum.prop_id);
            let dato = null;
            if (!seleccionar) {
                fun_deseleccionar_fila(propiedades);
                fun_seleccionar_fila(propiedades, datum.prop_id, false);
                dato = datum.prop_dato;
            }
            else {
                fun_deseleccionar_fila(propiedades);
            }
            if (propiedades.prop_config.prop_config_fila.on.click)
                propiedades.prop_config.prop_config_fila.on.click.bind(el_g_fila)(dato, index, all_element);
        }
        else {
            fun_deseleccionar_fila(propiedades);
            fun_seleccionar_fila(propiedades, datum.prop_id, false);
            if (propiedades.prop_config.prop_config_fila.on.click)
                propiedades.prop_config.prop_config_fila.on.click.bind(el_g_fila)(datum.prop_dato, index, all_element);
        }
    }
    function fun_on_mouseenter_fila(propiedades, datum, index, elemento) {
        if (d3.event.defaultPrevented || Utils_1.D3Utils.fun_es_dispositivo_movil())
            return;
        if (datum.prop_id === propiedades.prop_id_fila_seleccionada || !propiedades.prop_config.prop_config_fila.prop_hover)
            return;
        d3.select(elemento).select(".list-row-rect").attr("fill", propiedades.prop_config.prop_config_fila.prop_background_hover || "#eee");
    }
    function fun_on_mouseout_fila(propiedades, datum, index, elemento) {
        if (d3.event.defaultPrevented || Utils_1.D3Utils.fun_es_dispositivo_movil())
            return;
        if (datum.prop_id === propiedades.prop_id_fila_seleccionada || !propiedades.prop_config.prop_config_fila.prop_hover)
            return;
        let color = fun_get_color_fila(propiedades, index);
        d3.select(elemento).select(".list-row-rect").attr("fill", color);
    }
})(Lista = exports.Lista || (exports.Lista = {}));
