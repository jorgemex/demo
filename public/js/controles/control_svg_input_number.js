"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const Utils_1 = require("../general/Utils");
const control_svg_input_1 = require("../controles/control_svg_input");
var Input_number;
(function (Input_number) {
    let prop_index_control_input = -1;
    function fun_main(config) {
        let propiedades = {};
        propiedades.prop_config = config;
        propiedades.el_g_contenedor = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        propiedades.el_g_contenedor.property("propiedades", propiedades).classed("control-input-number", true);
        propiedades.el_g_contenedor.style("pointer-events", "all");
        propiedades.el_g_contenedor.append("defs");
        let obj_control = {
            prop_element: propiedades.el_g_contenedor.node(),
            prop_config: propiedades.prop_config,
            fun_actualizar: () => { fun_actualizar(propiedades); },
            fun_value: (value) => fun_value(propiedades, value),
            fun_focus: () => { propiedades.prop_control_input.fun_focus(); },
            fun_focus_out: () => { propiedades.prop_control_input.fun_focus_out(); },
            fun_disable: () => { fun_toggle_enable(propiedades, false); },
            fun_enable: () => { fun_toggle_enable(propiedades, true); }
        };
        obj_control.fun_actualizar();
        return obj_control;
    }
    Input_number.fun_main = fun_main;
    function fun_init_properties(propiedades) {
        if (propiedades.prop_index_control === undefined)
            propiedades.prop_index_control = prop_index_control_input += 1;
        if (propiedades.prop_config.prop_incremento === undefined)
            propiedades.prop_config.prop_incremento = 1;
        if (propiedades.prop_config.prop_width === undefined)
            propiedades.prop_config.prop_width = 100;
        if (propiedades.prop_config.prop_height === undefined)
            propiedades.prop_config.prop_height = 30;
        if (propiedades.prop_config.prop_configSpinner === undefined)
            propiedades.prop_config.prop_configSpinner = {};
        if (propiedades.prop_config.prop_configSpinner.prop_fill === undefined)
            propiedades.prop_config.prop_configSpinner.prop_fill = "grey";
        if (!propiedades.prop_config.prop_height)
            propiedades.prop_config.prop_height = 30;
        if (!propiedades.prop_config.prop_width)
            propiedades.prop_config.prop_width = 300;
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
        if (!propiedades.prop_config.prop_padding)
            propiedades.prop_config.prop_padding = {};
        if (!propiedades.prop_config.prop_padding.prop_left)
            propiedades.prop_config.prop_padding.prop_left = 5;
        if (!propiedades.prop_config.prop_padding.prop_right)
            propiedades.prop_config.prop_padding.prop_right = 5;
        if (propiedades.prop_config.prop_spinner === false)
            propiedades.prop_width = propiedades.prop_config.prop_width;
        else
            propiedades.prop_width = propiedades.prop_config.prop_width - propiedades.prop_config.prop_height;
        if (propiedades.prop_control_input === undefined) {
            let config = {
                prop_height: propiedades.prop_config.prop_height,
                prop_width: propiedades.prop_width,
                prop_tipo: "input",
                prop_fill: propiedades.prop_config.prop_fill,
                prop_padding: {
                    prop_left: propiedades.prop_config.prop_padding.prop_left,
                    prop_right: propiedades.prop_config.prop_padding.prop_right
                },
                prop_placeholder: propiedades.prop_config.prop_placeholder,
                prop_stroke: propiedades.prop_config.prop_stroke,
                prop_stroke_width: propiedades.prop_config.prop_stroke_width,
                prop_stroke_disable: "#cccccc",
                prop_configText: {
                    prop_color: propiedades.prop_config.prop_configText.prop_color,
                    prop_size_text: propiedades.prop_config.prop_configText.prop_size_text,
                    prop_weight: propiedades.prop_config.prop_configText.prop_weight,
                    prop_font_family: propiedades.prop_config.prop_configText.prop_font_family
                },
                prop_events: {
                    input: (puntero_pos) => {
                        let _val = fun_value(propiedades);
                        _val = _val.replace(",", ".");
                        let regexp_decimal = "";
                        if (propiedades.prop_config.prop_decimal)
                            regexp_decimal = "[.]?[0-9]*";
                        let exp = new RegExp("^[0-9]*" + regexp_decimal + "$");
                        let borrar_letra = false;
                        if (!exp.test(_val) || +_val < propiedades.prop_config.prop_min_value || +_val > propiedades.prop_config.prop_max_value) {
                            borrar_letra = true;
                        }
                        if (borrar_letra) {
                            let chars = _val.split("");
                            chars.splice(puntero_pos - 1, 1);
                            fun_value(propiedades, chars.join(""));
                        }
                        else
                            propiedades.prop_value = _val;
                        propiedades.prop_control_input.fun_ir_a_pos_puntero();
                        if (propiedades.prop_config.prop_events.input)
                            propiedades.prop_config.prop_events.input();
                    },
                    keyUp: (e) => {
                        if (propiedades.prop_config.prop_events.keyUp)
                            propiedades.prop_config.prop_events.keyUp(e);
                    },
                    keyDown: (e) => {
                        let _keyCode = e.which | e.keyCode;
                        if (e.keyCode === 40)
                            fun_on_click_down(propiedades);
                        else if (_keyCode === 38)
                            fun_on_click_up(propiedades);
                        if (propiedades.prop_config.prop_events.keyDown)
                            propiedades.prop_config.prop_events.keyDown(e);
                    }
                }
            };
            propiedades.prop_control_input = control_svg_input_1.Input.fun_main(config);
        }
    }
    function fun_dibujar_control(propiedades) {
        propiedades.el_g_contenedor.append(() => propiedades.prop_control_input.prop_element);
        if ((propiedades.prop_config.prop_spinner == undefined || propiedades.prop_config.prop_spinner) && !propiedades.el_svg_spinner) {
            propiedades.el_svg_spinner = propiedades.el_g_contenedor.append("svg")
                .classed("number-svg-spinner", true)
                .attr("height", propiedades.prop_config.prop_height)
                .attr("width", propiedades.prop_config.prop_height)
                .attr("preserveAspectRatio", "xMinYMin")
                .attr("x", propiedades.prop_width)
                .attr("viewBox", "0 0 30 30");
            propiedades.el_svg_spinner.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", propiedades.prop_config.prop_configSpinner.prop_fill);
            let g_up = propiedades.el_svg_spinner.append("g")
                .classed("g-icon-up", true)
                .style("cursor", "pointer")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => { fun_on_click_up(propiedades); });
            g_up.append("rect").attr("fill", "transparent")
                .attr("width", 30).attr("height", 15);
            g_up.append("path").attr("fill", "#CCCCCC")
                .attr("transform", "translate(15, 7.5)")
                .attr("d", "M0,-5.0971327345413675L5.885661912765424,5.0971327345413675 -5.885661912765424,5.0971327345413675Z");
            let g_down = propiedades.el_svg_spinner.append("g")
                .attr("transform", "translate(0, 15)")
                .classed("g-icon-down", true)
                .style("cursor", "pointer")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => { fun_on_click_down(propiedades); });
            g_down.append("rect").attr("fill", "transparent")
                .attr("width", 30).attr("height", 15);
            g_down.append("path").attr("fill", "#CCCCCC")
                .attr("transform", "translate(15, 7.5)")
                .attr("d", "M0,5.0971327345413675L5.885661912765424,-5.0971327345413675 -5.885661912765424,-5.0971327345413675Z");
        }
    }
    function fun_on_click_up(propiedades) {
        let _val = parseFloat((+fun_value(propiedades) + propiedades.prop_config.prop_incremento).toFixed(2));
        if (_val > propiedades.prop_config.prop_max_value)
            _val = propiedades.prop_config.prop_max_value;
        fun_value(propiedades, _val + "");
        propiedades.prop_control_input.fun_ir_a_pos_puntero();
        if (propiedades.prop_config.prop_events.keyUp)
            propiedades.prop_config.prop_events.keyUp(d3.event);
    }
    function fun_on_click_down(propiedades) {
        let _val = parseFloat((+fun_value(propiedades) - propiedades.prop_config.prop_incremento).toFixed(2));
        if (_val < propiedades.prop_config.prop_min_value)
            _val = propiedades.prop_config.prop_min_value;
        fun_value(propiedades, _val + "");
        propiedades.prop_control_input.fun_ir_a_pos_puntero();
        if (propiedades.prop_config.prop_events.keyDown)
            propiedades.prop_config.prop_events.keyDown(d3.event);
    }
    function fun_actualizar(propiedades) {
        fun_init_properties(propiedades);
        fun_dibujar_control(propiedades);
    }
    Input_number.fun_actualizar = fun_actualizar;
    function fun_toggle_enable(propiedades, toggle) {
        if (toggle) {
            propiedades.prop_esta_desactivado = false;
            propiedades.prop_control_input.fun_enable();
            propiedades.el_g_contenedor.style("pointer-events", "all");
            propiedades.el_g_contenedor.select(".number-svg-spinner").attr("display", "block");
        }
        else {
            propiedades.prop_esta_desactivado = true;
            propiedades.prop_control_input.fun_disable();
            propiedades.el_g_contenedor.style("pointer-events", "none");
        }
        fun_value(propiedades, propiedades.prop_value);
    }
    function fun_value(propiedades, value) {
        if (value != null || value != undefined) {
            propiedades.prop_value = value;
            let etiqueta = "";
            if (propiedades.prop_esta_desactivado && propiedades.prop_config.prop_etiqueta)
                etiqueta = " " + propiedades.prop_config.prop_etiqueta;
            propiedades.prop_control_input.fun_value(value + "" + etiqueta);
        }
        return propiedades.prop_control_input.fun_value();
    }
})(Input_number = exports.Input_number || (exports.Input_number = {}));
