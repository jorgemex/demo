"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const Utils_1 = require("../general/Utils");
var Input;
(function (Input) {
    let prop_index_control_input = -1;
    let index_input_in_focus = null;
    let fun_callback_focus_out = null;
    let eTeclaKeyDown;
    (function (eTeclaKeyDown) {
        eTeclaKeyDown[eTeclaKeyDown["INICIO"] = 36] = "INICIO";
        eTeclaKeyDown[eTeclaKeyDown["FIN"] = 35] = "FIN";
    })(eTeclaKeyDown || (eTeclaKeyDown = {}));
    function fun_main(config) {
        let propiedades = {};
        propiedades.prop_config = config;
        propiedades.el_g_contenedor = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        propiedades.el_g_contenedor.property("propiedades", propiedades).classed("control-input", true);
        propiedades.el_g_contenedor.style("pointer-events", "all");
        propiedades.el_g_contenedor.append("defs");
        let obj_control = {
            prop_element: propiedades.el_g_contenedor.node(),
            prop_config: propiedades.prop_config,
            fun_actualizar: () => { fun_actualizar(propiedades); },
            fun_value: (value) => fun_value(propiedades, value),
            fun_assignValue: (value) => fun_assignValue(propiedades, value),
            fun_focus: () => { fun_on_click(propiedades); },
            fun_focus_out: () => { fun_on_click_body(propiedades); },
            fun_disable: () => { fun_toggle_enable(propiedades, false); },
            fun_enable: () => { fun_toggle_enable(propiedades, true); },
            fun_ir_a_pos_puntero: (posicion) => { fun_ir_a_pos_puntero(propiedades, posicion); }
        };
        fun_add_input_auxiliar();
        obj_control.fun_actualizar();
        return obj_control;
    }
    Input.fun_main = fun_main;
    function fun_add_input_auxiliar() {
        if (d3.select(document.body).select(".auxiliar-control-input").size() === 0) {
            d3.select(document.body).append("input")
                .attr("id", "auxiliar-control-input")
                .attr("class", "auxiliar-control-input")
                .attr("autocapitalize", "none")
                .style("position", "absolute")
                .style("top", "-1000px")
                .style("left", "-1000px");
        }
    }
    function fun_init_properties(propiedades) {
        if (!propiedades.prop_input_html_auxiliar)
            propiedades.prop_input_html_auxiliar = d3.select(".auxiliar-control-input");
        if (propiedades.prop_total_TextLength === undefined)
            propiedades.prop_total_TextLength = 0;
        if (propiedades.prop_index_control === undefined)
            propiedades.prop_index_control = prop_index_control_input += 1;
        if (propiedades.prop_puntero_posicion === undefined)
            propiedades.prop_puntero_posicion = 0;
        if (propiedades.prop_char_posicion === undefined)
            propiedades.prop_char_posicion = 0;
        if (propiedades.prop_x_transform === undefined)
            propiedades.prop_x_transform = 0;
        if (!propiedades.prop_config.prop_height)
            propiedades.prop_config.prop_height = 30;
        if (!propiedades.prop_config.prop_width)
            propiedades.prop_config.prop_width = 300;
        if (!propiedades.prop_config.prop_stroke_disable)
            propiedades.prop_config.prop_stroke_disable = "transparent";
        if (propiedades.prop_config.prop_stroke === undefined)
            propiedades.prop_config.prop_stroke = "#D1D6DA";
        if (propiedades.prop_config.prop_stroke_width === undefined)
            propiedades.prop_config.prop_stroke_width = 1;
        if (!propiedades.prop_config.prop_events)
            propiedades.prop_config.prop_events = {};
        if (!propiedades.prop_config.prop_configText)
            propiedades.prop_config.prop_configText = {};
        if (!propiedades.prop_config.prop_configText.prop_size_text)
            propiedades.prop_config.prop_configText.prop_size_text = 18;
        if (!propiedades.prop_config.prop_configText.prop_color)
            propiedades.prop_config.prop_configText.prop_color = "#000000";
        if (propiedades.prop_value === undefined)
            propiedades.prop_value = "";
        if (!propiedades.prop_config.prop_padding)
            propiedades.prop_config.prop_padding = {};
        if (!propiedades.prop_config.prop_padding.prop_left)
            propiedades.prop_config.prop_padding.prop_left = 5;
        if (!propiedades.prop_config.prop_padding.prop_right)
            propiedades.prop_config.prop_padding.prop_right = 5;
        propiedades.prop_top_text = (propiedades.prop_config.prop_height - propiedades.prop_config.prop_configText.prop_size_text) / 2;
        propiedades.prop_width_text = propiedades.prop_config.prop_width - propiedades.prop_config.prop_padding.prop_left - propiedades.prop_config.prop_padding.prop_right;
    }
    function fun_dibuja_input(propiedades) {
        if (!propiedades.el_g_translate) {
            propiedades.el_g_contenedor.attr("cursor", "text")
                .style("-webkit-user-select", "none")
                .style("-moz-user-select", "none")
                .style("-ms-user-select", "none")
                .style("user-select", "none")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => { fun_on_click(propiedades); });
            if (Utils_1.D3Utils.fun_es_dispositivo_movil()) {
                propiedades.el_g_contenedor.call(d3.drag()
                    .on("drag", () => {
                    propiedades.prop_x_transform -= d3.event.dx;
                    if (propiedades.prop_x_transform < 0 || propiedades.prop_total_TextLength < propiedades.prop_width_text) {
                        propiedades.prop_x_transform = 0;
                    }
                    else if (propiedades.prop_x_transform > propiedades.prop_total_TextLength - propiedades.prop_width_text) {
                        propiedades.prop_x_transform = propiedades.prop_total_TextLength - propiedades.prop_width_text;
                    }
                    fun_mover_grupo_texto(propiedades);
                }));
            }
            propiedades.el_g_contenedor.append("rect")
                .classed("control-input-background", true)
                .attr("stroke", propiedades.prop_config.prop_stroke)
                .attr("stroke-width", propiedades.prop_config.prop_stroke_width)
                .attr('rx', 1)
                .attr('ry', 1);
            let el_g_clippath = propiedades.el_g_contenedor.append("g").classed("control-g-clippath", true)
                .attr("clip-path", "url(#ClipPathInput_" + propiedades.prop_index_control + ")");
            propiedades.el_g_translate = el_g_clippath.append("g").classed("control-g-translate", true);
            propiedades.el_text_valor = propiedades.el_g_translate.append("text")
                .classed("txt-input-value", true)
                .attr("fill", propiedades.prop_config.prop_configText.prop_color)
                .attr("xml:space", "preserve");
            if (propiedades.prop_config.prop_tipo === "password")
                propiedades.el_text_valor.style("-webkit-text-security", "disc");
            propiedades.el_text_plaholder = propiedades.el_g_translate.append("text")
                .attr("fill", propiedades.prop_config.prop_configText.prop_color)
                .classed("control-input-placeholder", true)
                .attr("pointer-events", "none")
                .attr("opacity", .3);
            propiedades.el_puntero = propiedades.el_g_translate.append("line")
                .attr("stroke", propiedades.prop_config.prop_configText.prop_color)
                .attr("class", "line_puntero")
                .attr("stroke-width", 1)
                .attr("display", "none");
        }
        propiedades.el_g_contenedor.select(".control-input-background")
            .attr("width", propiedades.prop_config.prop_width)
            .attr("height", propiedades.prop_config.prop_height)
            .attr("fill", propiedades.prop_config.prop_fill || "#ffffff");
        propiedades.el_g_translate.attr("transform", "translate( " + propiedades.prop_config.prop_padding.prop_left + ", " + propiedades.prop_top_text + ")");
        propiedades.el_text_valor.attr("y", (propiedades.prop_config.prop_configText.prop_size_text / 4) * 3.2)
            .style("font-size", propiedades.prop_config.prop_configText.prop_size_text)
            .style("font-family", propiedades.prop_config.prop_configText.prop_font_family || null);
        propiedades.el_text_plaholder.attr("y", (propiedades.prop_config.prop_configText.prop_size_text / 4) * 3.2)
            .style("font-size", propiedades.prop_config.prop_configText.prop_size_text)
            .style("font-family", propiedades.prop_config.prop_configText.prop_font_family || null);
        propiedades.el_puntero.attr("x1", 0).attr("y1", 0).attr("stroke-width", 1)
            .attr("x2", 0).attr("y2", propiedades.prop_config.prop_configText.prop_size_text);
        fun_asignar_valor(propiedades);
    }
    function fun_move_puntero(propiedades) {
        propiedades.el_puntero.attr("display", "block")
            .attr("transform", "translate(" + propiedades.prop_puntero_posicion + ")");
    }
    function fun_asignar_valor(propiedades) {
        let text_placeholder = propiedades.prop_value.length > 0 ? "" : propiedades.prop_config.prop_placeholder;
        propiedades.el_text_plaholder.text(text_placeholder || "");
        propiedades.prop_input_html_auxiliar.property("value", propiedades.prop_value);
        propiedades.el_text_valor.text(propiedades.prop_value);
        try {
            propiedades.prop_total_TextLength = +propiedades.el_text_valor.node().getComputedTextLength();
        }
        catch (e) {
            propiedades.prop_total_TextLength = 0;
        }
    }
    function fun_intervalo_puntero(propiedades) {
        let esta_cursor_oculto = true;
        if (propiedades.prop_intervalo_puntero)
            propiedades.prop_intervalo_puntero.stop();
        propiedades.prop_intervalo_puntero = d3.interval(function () {
            esta_cursor_oculto = !esta_cursor_oculto;
            propiedades.el_puntero.attr("display", esta_cursor_oculto ? "block" : "none");
        }, 500);
    }
    function fun_get_posicion_char(selection, pos_x) {
        let text_principal = selection.text();
        let length_principal = text_principal.length;
        if (pos_x <= 0) {
            return { prop_char_index: 0, prop_pos_x: 0 };
        }
        else if (pos_x >= selection.node().getComputedTextLength()) {
            return { prop_char_index: text_principal.length, prop_pos_x: selection.node().getComputedTextLength() };
        }
        else {
            let next_text_length = 0;
            let prev_text_length = 0;
            let aux_span = selection.append("tspan").attr("xml:space", "preserve");
            let index = 0;
            for (index = 0; index < length_principal; index++) {
                let text_t_span = text_principal.slice(0, index + 1);
                aux_span.text(text_t_span);
                next_text_length = (aux_span.node().getSubStringLength(0, text_t_span.length));
                if (prev_text_length < pos_x && next_text_length >= pos_x) {
                    let diferencia = next_text_length - prev_text_length;
                    if (prev_text_length + (diferencia / 2) < pos_x) {
                        index += 1;
                        prev_text_length = next_text_length;
                    }
                    break;
                }
                prev_text_length = next_text_length;
            }
            aux_span.remove();
            return { prop_char_index: index, prop_pos_x: prev_text_length };
        }
    }
    function fun_get_posicion_puntero(selection, value, char_posicion) {
        let aux_span_ = selection.append("tspan").attr("xml:space", "preserve");
        aux_span_.text(value.slice(0, char_posicion));
        let puntero_posicion = aux_span_.node().getComputedTextLength();
        aux_span_.remove();
        return puntero_posicion;
    }
    function fun_x_transform(propiedades) {
        if (propiedades.prop_total_TextLength > propiedades.prop_width_text) {
            if (propiedades.prop_total_TextLength >= propiedades.prop_x_transform + propiedades.prop_width_text) {
                let puntero_pos_centro = propiedades.prop_puntero_posicion - (propiedades.prop_width_text / 2);
                if (propiedades.prop_puntero_posicion < propiedades.prop_x_transform) {
                    propiedades.prop_x_transform = puntero_pos_centro < 0 ? 0 : puntero_pos_centro;
                }
                else if ((propiedades.prop_puntero_posicion - propiedades.prop_x_transform) >= propiedades.prop_width_text) {
                    let text_length_menos_widht = propiedades.prop_total_TextLength - propiedades.prop_width_text;
                    propiedades.prop_x_transform = puntero_pos_centro > text_length_menos_widht ? text_length_menos_widht : puntero_pos_centro;
                }
            }
            else
                propiedades.prop_x_transform = propiedades.prop_total_TextLength - propiedades.prop_width_text;
        }
        else
            propiedades.prop_x_transform = 0;
        fun_mover_grupo_texto(propiedades);
    }
    function fun_mover_grupo_texto(propiedades) {
        propiedades.el_g_translate.attr("transform", `translate(${-propiedades.prop_x_transform + propiedades.prop_config.prop_padding.prop_left} ,${propiedades.prop_top_text})`);
    }
    function fun_dibuja_clippath(propiedades) {
        let el_clippath = propiedades.el_g_contenedor.select("defs").select("clipPath");
        if (el_clippath.size() === 0) {
            el_clippath = propiedades.el_g_contenedor.select("defs").append("clipPath")
                .attr("id", "ClipPathInput_" + propiedades.prop_index_control);
            el_clippath.append("rect");
        }
        el_clippath.select("rect")
            .attr("x", propiedades.prop_config.prop_padding.prop_left)
            .attr("height", propiedades.prop_config.prop_height)
            .attr("width", propiedades.prop_width_text);
    }
    function fun_on_focus(propiedades) {
        propiedades.el_g_contenedor.classed("focus-active", true);
        propiedades.el_g_contenedor.select(".control-input-background").attr("stroke", "#000000");
        if (!propiedades.prop_intervalo_puntero)
            fun_intervalo_puntero(propiedades);
    }
    function fun_on_focus_out(propiedades) {
        fun_on_keyDown(propiedades, eTeclaKeyDown.INICIO, true);
        propiedades.el_g_contenedor.classed("focus-active", false);
        propiedades.el_puntero.attr("display", "none");
        propiedades.el_g_contenedor.select(".control-input-background")
            .attr("stroke", propiedades.prop_config.prop_stroke);
        propiedades.prop_intervalo_puntero.stop();
        propiedades.prop_intervalo_puntero = null;
    }
    function fun_on_keyUp(propiedades) {
        if (propiedades.prop_config.prop_events.keyUp) {
            propiedades.prop_config.prop_events.keyUp(d3.event, propiedades.prop_char_posicion);
        }
    }
    function fun_on_keyPress(propiedades) {
    }
    function fun_on_input(propiedades) {
        propiedades.prop_value = propiedades.prop_input_html_auxiliar.property("value");
        propiedades.prop_char_posicion = propiedades.prop_input_html_auxiliar.node().selectionEnd;
        propiedades.prop_input_html_auxiliar.node().setSelectionRange(propiedades.prop_char_posicion, propiedades.prop_char_posicion);
        propiedades.prop_puntero_posicion = fun_get_posicion_puntero(propiedades.el_text_valor, propiedades.prop_value, propiedades.prop_char_posicion);
        fun_asignar_valor(propiedades);
        fun_x_transform(propiedades);
        fun_move_puntero(propiedades);
        if (propiedades.prop_config.prop_events.input) {
            propiedades.prop_config.prop_events.input(propiedades.prop_char_posicion);
        }
    }
    function fun_on_change(propiedades) {
        if (propiedades.prop_config.prop_events.change)
            propiedades.prop_config.prop_events.change(d3.event, propiedades.prop_char_posicion);
    }
    function fun_on_keyDown(propiedades, tecla_key_down = null, no_evento = false) {
        if (!tecla_key_down && d3.event)
            tecla_key_down = d3.event.keyCode;
        if (tecla_key_down === 37) {
            if (propiedades.prop_char_posicion > 0) {
                propiedades.prop_char_posicion -= 1;
            }
        }
        else if (tecla_key_down === 39) {
            if (propiedades.prop_char_posicion < propiedades.prop_value.length) {
                propiedades.prop_char_posicion += 1;
            }
        }
        else if (tecla_key_down === 36) {
            propiedades.prop_char_posicion = 0;
        }
        else if (tecla_key_down === 35) {
            propiedades.prop_char_posicion = propiedades.prop_value.length;
        }
        propiedades.prop_puntero_posicion = fun_get_posicion_puntero(propiedades.el_text_valor, propiedades.prop_value, propiedades.prop_char_posicion);
        fun_move_puntero(propiedades);
        fun_x_transform(propiedades);
        if (d3.event instanceof KeyboardEvent && !no_evento && propiedades.prop_config.prop_events.keyDown) {
            propiedades.prop_config.prop_events.keyDown(d3.event, propiedades.prop_char_posicion);
        }
    }
    function fun_on_click(propiedades) {
        if (propiedades.prop_esta_inactivo_input)
            return;
        let posicion_x = 0;
        if (d3.event) {
            d3.event.preventDefault();
            d3.event.stopPropagation();
            posicion_x = d3.mouse(propiedades.el_g_contenedor.node())[0];
        }
        if (index_input_in_focus != propiedades.prop_index_control) {
            if (fun_callback_focus_out)
                fun_callback_focus_out();
            index_input_in_focus = propiedades.prop_index_control;
            fun_callback_focus_out = function () { fun_on_focus_out(propiedades); };
            propiedades.prop_input_html_auxiliar
                .on("keydown", function () { fun_on_keyDown(propiedades); })
                .on("keyup", function () { fun_on_keyUp(propiedades); })
                .on("input", function () { fun_on_input(propiedades); })
                .on("change", function () { fun_on_change(propiedades); })
                .on("focusout", function () { fun_on_click_body(propiedades); });
            d3.select(document.body).call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                fun_on_click_body(propiedades);
            }, "eventFocusOutInput");
            propiedades.prop_input_html_auxiliar.property("value", propiedades.prop_value);
            fun_on_focus(propiedades);
        }
        let x_click = posicion_x + propiedades.prop_x_transform - propiedades.prop_config.prop_padding.prop_left;
        let posicion = fun_get_posicion_char(propiedades.el_text_valor, x_click);
        propiedades.prop_char_posicion = posicion.prop_char_index;
        propiedades.prop_puntero_posicion = posicion.prop_pos_x;
        fun_move_puntero(propiedades);
        propiedades.prop_input_html_auxiliar.node().focus();
        propiedades.prop_input_html_auxiliar.node().setSelectionRange(propiedades.prop_char_posicion, propiedades.prop_char_posicion);
        if (propiedades.prop_config.prop_events.focus)
            propiedades.prop_config.prop_events.focus();
    }
    function fun_on_click_body(propiedades) {
        if (fun_callback_focus_out)
            fun_callback_focus_out();
        fun_callback_focus_out = null;
        index_input_in_focus = null;
        propiedades.prop_input_html_auxiliar.node().blur();
        propiedades.prop_input_html_auxiliar.property("value", "");
        propiedades.prop_input_html_auxiliar.on("keydown", null).on("input", null);
        d3.select(document.body).call(Utils_1.D3Utils.eventos.fun_agregar_click, null, "eventFocusOutInput");
    }
    function fun_actualizar(propiedades) {
        fun_init_properties(propiedades);
        fun_dibuja_clippath(propiedades);
        fun_dibuja_input(propiedades);
    }
    Input.fun_actualizar = fun_actualizar;
    function fun_value(propiedades, value = null) {
        if (value != null || value != undefined) {
            propiedades.prop_value = value;
            fun_asignar_valor(propiedades);
        }
        fun_ir_a_pos_puntero(propiedades);
        return propiedades.prop_value;
    }
    function fun_toggle_enable(propiedades, toggle) {
        if (toggle) {
            propiedades.prop_esta_inactivo_input = false;
            propiedades.el_g_contenedor.style("pointer-events", "all");
            propiedades.el_g_contenedor.select(".control-input-background").attr("stroke", propiedades.prop_config.prop_stroke);
        }
        else {
            propiedades.prop_esta_inactivo_input = true;
            propiedades.el_g_contenedor.style("pointer-events", "none");
            propiedades.el_g_contenedor.select(".control-input-background").attr("stroke", propiedades.prop_config.prop_stroke_disable);
        }
        fun_on_click_body(propiedades);
    }
    function fun_ir_a_pos_puntero(propiedades, posicion) {
        if (propiedades.prop_intervalo_puntero === null || propiedades.prop_intervalo_puntero === undefined)
            return;
        if (posicion != null && posicion != undefined)
            propiedades.prop_char_posicion = posicion;
        propiedades.prop_puntero_posicion = fun_get_posicion_puntero(propiedades.el_text_valor, propiedades.prop_value, propiedades.prop_char_posicion);
        fun_move_puntero(propiedades);
        propiedades.prop_input_html_auxiliar.node().setSelectionRange(propiedades.prop_char_posicion, propiedades.prop_char_posicion);
    }
    function fun_input_out() {
        let propiedades = d3.select(".control-input").property("propiedades");
        fun_on_click_body(propiedades);
    }
    Input.fun_input_out = fun_input_out;
    function fun_assignValue(propiedades, value = null) {
        if (value != null || value != undefined) {
            propiedades.prop_value = value;
            let text_placeholder = propiedades.prop_value.length > 0 ? "" : propiedades.prop_config.prop_placeholder;
            propiedades.el_text_plaholder.text(text_placeholder || "");
            propiedades.el_text_valor.text(propiedades.prop_value);
            try {
                propiedades.prop_total_TextLength = +propiedades.el_text_valor.node().getComputedTextLength();
            }
            catch (e) {
                propiedades.prop_total_TextLength = 0;
            }
        }
    }
})(Input = exports.Input || (exports.Input = {}));
