"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const Utils_1 = require("../general/Utils");
var Scroll;
(function (Scroll) {
    var prop_index_control_scroll = -1;
    let tipo_scroll;
    (function (tipo_scroll) {
        tipo_scroll[tipo_scroll["x"] = 1] = "x";
        tipo_scroll[tipo_scroll["y"] = 2] = "y";
        tipo_scroll[tipo_scroll["contenido"] = 0] = "contenido";
    })(tipo_scroll || (tipo_scroll = {}));
    function fun_main(svg_g_element, config) {
        var propiedades = {};
        propiedades.prop_es_dispositivo_movil = Utils_1.D3Utils.fun_es_dispositivo_movil();
        propiedades.prop_config = config;
        propiedades.el_contenido_ = d3.select(svg_g_element);
        propiedades.el_contenedor_scroll = d3
            .select(document.createElementNS("http://www.w3.org/2000/svg", "g"))
            .classed("control-scroll", true)
            .property("propiedades", propiedades)
            .on("wheel", function () {
            fun_on_wheel(propiedades);
        })
            .on("mouseenter", function () {
            if (propiedades.prop_es_dispositivo_movil)
                return;
            propiedades.prop_evento_mouse_enter_activo = true;
            fun_mostrar_scroll(propiedades, true);
        })
            .on("mouseleave", function () {
            propiedades.prop_evento_mouse_enter_activo = false;
            fun_mostrar_scroll(propiedades, false);
        });
        propiedades.el_contenido_.style("pointer-events", "all");
        var obj_control = {
            element: propiedades.el_contenedor_scroll.node(),
            config: propiedades.prop_config,
            fun_actualizar: fun_actualizar,
            fun_set_scrollTop: (posicion) => {
                fun_set_scroll_top(propiedades, posicion);
            },
            fun_get_scrollTop: () => fun_get_scroll_top(propiedades),
            fun_set_scrollLeft: (posicion) => {
                fun_set_scroll_left(propiedades, posicion);
            },
            fun_get_scrollLeft: () => fun_get_scroll_left(propiedades)
        };
        obj_control.fun_actualizar();
        return obj_control;
    }
    Scroll.fun_main = fun_main;
    function fun_init_properties(propiedades) {
        if (propiedades.prop_config.prop_width === undefined)
            propiedades.prop_config.prop_width = 0;
        if (propiedades.prop_config.prop_height === undefined)
            propiedades.prop_config.prop_height = 0;
        if (propiedades.prop_config.prop_height_total === undefined)
            propiedades.prop_config.prop_height_total = 0;
        propiedades.prop_width = propiedades.prop_config.prop_width;
        propiedades.prop_height = propiedades.prop_config.prop_height;
        var width_total = propiedades.prop_config.prop_width;
        if (propiedades.prop_config.mostrar_scroll_x) {
            if (propiedades.prop_config.prop_width_total)
                width_total = propiedades.prop_config.prop_width_total;
            else
                width_total = propiedades.el_contenido_.node().getBBox().width;
        }
        propiedades.prop_aux_scroll_x =
            propiedades.prop_config.mostrar_scroll_x &&
                propiedades.prop_width < width_total
                ? true
                : false;
        propiedades.prop_aux_scroll_y =
            propiedades.prop_config.mostrar_scroll_y &&
                propiedades.prop_height < propiedades.prop_config.prop_height_total
                ? true
                : false;
        propiedades.prop_height_total = propiedades.prop_aux_scroll_y
            ? propiedades.prop_config.prop_height_total
            : propiedades.prop_height;
        propiedades.prop_width_total = propiedades.prop_aux_scroll_x
            ? width_total
            : propiedades.prop_width;
        if (propiedades.prop_config.prop_stroke_width === undefined)
            propiedades.prop_config.prop_stroke_width = 5;
        if (propiedades.prop_config.prop_stroke === undefined)
            propiedades.prop_config.prop_stroke = "#000000";
        if (!propiedades.prop_config.event_scroll)
            propiedades.prop_config.event_scroll = {};
        if (propiedades.prop_config.mostrar_scroll_x) {
            if (!propiedades.prop_scroll_x)
                propiedades.prop_scroll_x = {};
            if (!propiedades.prop_scroll_x.prop_scale_linear)
                propiedades.prop_scroll_x.prop_scale_linear = d3.scaleLinear();
            if (!propiedades.prop_scroll_x.prop_posicion)
                propiedades.prop_scroll_x.prop_posicion = {
                    x: 0,
                    y: 0,
                    index: tipo_scroll.x
                };
            propiedades.prop_scroll_x.prop_scale_linear
                .range([0, propiedades.prop_width])
                .domain([0, propiedades.prop_width_total]);
        }
        if (propiedades.prop_config.mostrar_scroll_y) {
            if (!propiedades.prop_scroll_y)
                propiedades.prop_scroll_y = {};
            if (!propiedades.prop_scroll_y.prop_scale_linear)
                propiedades.prop_scroll_y.prop_scale_linear = d3.scaleLinear();
            if (!propiedades.prop_scroll_y.prop_posicion)
                propiedades.prop_scroll_y.prop_posicion = {
                    x: 0,
                    y: 0,
                    index: tipo_scroll.y
                };
            propiedades.prop_scroll_y.prop_scale_linear
                .range([0, propiedades.prop_height])
                .domain([0, propiedades.prop_height_total]);
        }
        if (!propiedades.prop_drag) {
            propiedades.prop_drag = d3
                .drag()
                .on("start", function (d) {
                fun_on_drag_start(propiedades, this);
            })
                .on("drag", function (d) {
                fun_on_drag(propiedades, this);
            })
                .on("end", function (d) {
                fun_on_drag_end(propiedades, this);
            });
        }
        if (propiedades.prop_index_control === undefined)
            propiedades.prop_index_control = prop_index_control_scroll += 1;
    }
    function fun_control_scroll(propiedades) {
        fun_init_properties(propiedades);
        fun_clipPath(propiedades);
        fun_agregar_contenido(propiedades);
        fun_dibuja_scroll(propiedades);
        fun_mostrar_scroll(propiedades, false);
    }
    function fun_clipPath(propiedades) {
        var el_clip_scroll_rect = propiedades.el_contenedor_scroll.select(".clip-scroll-rect");
        if (el_clip_scroll_rect.size() === 0) {
            el_clip_scroll_rect = propiedades.el_contenedor_scroll
                .append("defs")
                .append("clipPath")
                .attr("id", "clip_scroll_" + propiedades.prop_index_control)
                .append("rect")
                .attr("class", "clip-scroll-rect");
        }
        el_clip_scroll_rect
            .attr("width", propiedades.prop_width)
            .attr("height", propiedades.prop_height);
    }
    function fun_dibuja_scroll(propiedades) {
        var g_scroll = propiedades.el_contenedor_scroll.select(".g-scroll-contenido");
        if (g_scroll.size() === 0) {
            g_scroll = propiedades.el_contenedor_scroll
                .append("g")
                .attr("class", "g-scroll-contenido");
            if (propiedades.prop_config.mostrar_scroll_x) {
                g_scroll
                    .append("rect")
                    .attr("y", 0)
                    .classed("scroll-x", true)
                    .classed("scroll-extent", true)
                    .call(propiedades.prop_drag)
                    .property("element_event", tipo_scroll.x);
            }
            if (propiedades.prop_config.mostrar_scroll_y) {
                g_scroll
                    .append("rect")
                    .attr("x", 0)
                    .classed("scroll-y", true)
                    .classed("scroll-extent", true)
                    .call(propiedades.prop_drag)
                    .property("element_event", tipo_scroll.y);
            }
        }
        g_scroll.style("opacity", 0.6).attr("pointer-events", "all");
        if (propiedades.prop_config.mostrar_scroll_x) {
            propiedades.prop_scroll_x.prop_extent_value = propiedades.prop_scroll_x.prop_scale_linear(propiedades.prop_width);
            propiedades.prop_scroll_x.prop_posicion.y =
                propiedades.prop_height - propiedades.prop_config.prop_stroke_width;
            propiedades.prop_scroll_x.el_barra = g_scroll
                .select(".scroll-x")
                .style("opacity", propiedades.prop_aux_scroll_x ? 1 : 0)
                .attr("y", propiedades.prop_scroll_x.prop_posicion.y)
                .attr("width", propiedades.prop_scroll_x.prop_extent_value)
                .attr("height", propiedades.prop_config.prop_stroke_width)
                .attr("fill", propiedades.prop_config.prop_stroke);
        }
        if (propiedades.prop_config.mostrar_scroll_y) {
            propiedades.prop_scroll_y.prop_extent_value = propiedades.prop_scroll_y.prop_scale_linear(propiedades.prop_height);
            propiedades.prop_scroll_y.prop_posicion.x =
                propiedades.prop_width - propiedades.prop_config.prop_stroke_width;
            propiedades.prop_scroll_y.el_barra = g_scroll
                .select(".scroll-y")
                .style("opacity", propiedades.prop_aux_scroll_y ? 1 : 0)
                .attr("x", propiedades.prop_scroll_y.prop_posicion.x)
                .attr("height", propiedades.prop_scroll_y.prop_extent_value)
                .attr("width", propiedades.prop_config.prop_stroke_width)
                .attr("fill", propiedades.prop_config.prop_stroke);
        }
    }
    function fun_agregar_contenido(propiedades) {
        var el_g_contenido_clip = propiedades.el_contenedor_scroll.select(".g-contenido-clip");
        if (el_g_contenido_clip.size() === 0) {
            propiedades.el_contenedor_scroll
                .append("rect")
                .classed("scroll-background", true)
                .attr("fill", propiedades.prop_config.prop_background_color || "#ffffff");
            el_g_contenido_clip = propiedades.el_contenedor_scroll
                .append("g")
                .attr("class", "g-contenido-clip")
                .call(propiedades.prop_drag)
                .property("element_event", tipo_scroll.contenido)
                .style("clip-path", "url(#clip_scroll_" + propiedades.prop_index_control + ")");
            el_g_contenido_clip
                .append("rect")
                .classed("contenido-background", true)
                .attr("fill", propiedades.prop_config.prop_background_color || "#ffffff");
            el_g_contenido_clip
                .datum(null)
                .append(() => propiedades.el_contenido_.node())
                .attr("transform", "translate(0, 0)");
        }
        propiedades.el_contenedor_scroll
            .select(".scroll-background")
            .attr("width", propiedades.prop_config.prop_width)
            .attr("height", propiedades.prop_config.prop_height);
        el_g_contenido_clip
            .select(".contenido-background")
            .attr("width", propiedades.prop_width)
            .attr("height", propiedades.prop_height);
    }
    function fun_asignar_top_scroll(propiedades, _tipo_scroll, dx, dy, invert, transicion = false) {
        fun_translate_scroll_x(propiedades, dx, _tipo_scroll, invert, transicion);
        fun_translate_scroll_y(propiedades, dy, _tipo_scroll, invert, transicion);
        fun_translate_contenido(propiedades, dx, dy, transicion);
    }
    function fun_escalar_posicion_scroll(propiedades) {
        if (!propiedades.prop_height ||
            !propiedades.prop_width ||
            !propiedades.prop_config.prop_height ||
            !propiedades.prop_config.prop_width)
            return;
        if (propiedades.prop_scroll_y) {
            var posicion_contenido = propiedades.prop_scroll_y.prop_scale_linear.invert(propiedades.prop_scroll_y.prop_posicion.y);
            propiedades.prop_scroll_y.prop_posicion.y =
                (posicion_contenido /
                    (propiedades.prop_config.prop_height_total || 1)) *
                    propiedades.prop_config.prop_height;
        }
        if (propiedades.prop_scroll_x) {
            propiedades.prop_scroll_x.prop_posicion.x =
                (propiedades.prop_scroll_x.prop_posicion.x / propiedades.prop_width) *
                    propiedades.prop_config.prop_width;
        }
    }
    function fun_translate_scroll_x(propiedades, pos_x, tipo_evento, invert, transition = false) {
        if (propiedades.prop_config.mostrar_scroll_x &&
            (tipo_evento === tipo_scroll.contenido || tipo_evento === tipo_scroll.x)) {
            pos_x *= !invert ? -1 : 1;
            if (!invert)
                pos_x = propiedades.prop_scroll_x.prop_scale_linear(pos_x);
            var min_value = Math.min(propiedades.prop_width - propiedades.prop_scroll_x.prop_extent_value, propiedades.prop_scroll_x.prop_posicion.x + pos_x);
            propiedades.prop_scroll_x.prop_posicion.x = Math.max(0, min_value);
            if (!transition)
                propiedades.prop_scroll_x.el_barra.attr("x", propiedades.prop_scroll_x.prop_posicion.x);
            else
                propiedades.prop_scroll_x.el_barra.attr("x", propiedades.prop_scroll_x.prop_posicion.x);
        }
    }
    function fun_translate_scroll_y(propiedades, pos_y, tipo_evento, invert, transition = false) {
        if (propiedades.prop_config.mostrar_scroll_y &&
            (tipo_evento === 0 || tipo_evento === tipo_scroll.y)) {
            pos_y *= !invert ? -1 : 1;
            if (!invert)
                pos_y = propiedades.prop_scroll_y.prop_scale_linear(pos_y);
            var min_value = Math.min(propiedades.prop_height - propiedades.prop_scroll_y.prop_extent_value, propiedades.prop_scroll_y.prop_posicion.y + pos_y);
            propiedades.prop_scroll_y.prop_posicion.y = Math.max(0, min_value);
            if (!transition)
                propiedades.prop_scroll_y.el_barra.attr("y", propiedades.prop_scroll_y.prop_posicion.y);
            else
                propiedades.prop_scroll_y.el_barra.attr("y", propiedades.prop_scroll_y.prop_posicion.y);
        }
    }
    function fun_translate_contenido(propiedades, t_x, t_y, transition = false) {
        fun_mostrar_scroll(propiedades, true);
        fun_timer_ocultar_scroll(propiedades);
        var posicion_contendido = {
            x: 0,
            y: 0,
            index: tipo_scroll.contenido
        };
        if (propiedades.prop_config.mostrar_scroll_x && t_x !== null) {
            t_x = propiedades.prop_scroll_x.prop_scale_linear.invert(propiedades.prop_scroll_x.prop_posicion.x);
            posicion_contendido.x = Math.max(propiedades.prop_width - propiedades.prop_width_total, Math.min(0, -t_x));
        }
        if (propiedades.prop_config.mostrar_scroll_y && t_y !== null) {
            t_y = propiedades.prop_scroll_y.prop_scale_linear.invert(propiedades.prop_scroll_y.prop_posicion.y);
            posicion_contendido.y = Math.max(propiedades.prop_height - propiedades.prop_height_total, Math.min(0, -t_y));
        }
        if (!transition)
            propiedades.el_contenido_.attr("transform", "translate(" +
                posicion_contendido.x +
                ", " +
                posicion_contendido.y +
                ")");
        else
            propiedades.el_contenido_.attr("transform", "translate(" +
                posicion_contendido.x +
                ", " +
                posicion_contendido.y +
                ")");
        if (propiedades.prop_config.event_scroll &&
            propiedades.prop_config.event_scroll.scroll)
            propiedades.prop_config.event_scroll.scroll();
    }
    function fun_timer_ocultar_scroll(propiedades) {
        if (!propiedades.prop_evento_mouse_enter_activo) {
            if (propiedades.prop_timer_ocultar_scroll != undefined)
                clearTimeout(propiedades.prop_timer_ocultar_scroll);
            propiedades.prop_timer_ocultar_scroll = setTimeout(() => {
                fun_mostrar_scroll(propiedades, false);
                propiedades.prop_timer_ocultar_scroll = undefined;
            }, 1500);
        }
    }
    function fun_mostrar_scroll(propiedades, toggle) {
        if (propiedades.prop_scroll_esta_visible === toggle ||
            propiedades.prop_config.prop_no_ocultar)
            return;
        propiedades.prop_scroll_esta_visible = toggle;
        propiedades.el_contenedor_scroll
            .select(".g-scroll-contenido")
            .attr("pointer-events", toggle ? "all" : "none")
            .interrupt()
            .transition()
            .duration(100)
            .style("opacity", toggle ? 0.6 : 0);
    }
    function fun_actualizar() {
        var obj_control = this;
        var propiedades = (d3.select(obj_control.element).property("propiedades"));
        fun_escalar_posicion_scroll(propiedades);
        fun_control_scroll(propiedades);
        fun_asignar_top_scroll(propiedades, tipo_scroll.contenido, 0, 0, false);
    }
    function fun_set_scroll_top(propiedades, posicion) {
        var posicion_contenido = propiedades.prop_scroll_y.prop_scale_linear.invert(propiedades.prop_scroll_y.prop_posicion.y);
        fun_asignar_top_scroll(propiedades, tipo_scroll.contenido, 0, -posicion + posicion_contenido, false);
    }
    function fun_get_scroll_top(propiedades) {
        return propiedades.prop_scroll_y.prop_scale_linear.invert(propiedades.prop_scroll_y.prop_posicion.y);
    }
    function fun_set_scroll_left(propiedades, posicion) {
        var posicion_contenido = propiedades.prop_scroll_x.prop_scale_linear.invert(propiedades.prop_scroll_x.prop_posicion.x);
        fun_asignar_top_scroll(propiedades, tipo_scroll.contenido, -posicion + posicion_contenido, 0, false);
    }
    function fun_get_scroll_left(propiedades) {
        return propiedades.prop_scroll_x.prop_scale_linear.invert(propiedades.prop_scroll_x.prop_posicion.x);
    }
    function fun_on_drag_start(propiedades, elemento) {
        d3.select(elemento).style("touch-action", null);
        if (propiedades.prop_config.event_scroll.scroll_start)
            propiedades.prop_config.event_scroll.scroll_start();
    }
    function fun_on_drag(propiedades, elemento) {
        var pos_x = 0;
        var pos_y = 0;
        var _tipo_scroll = d3.select(elemento).property("element_event");
        var invert_scroll_contenido = false;
        if (_tipo_scroll === tipo_scroll.x) {
            invert_scroll_contenido = true;
            pos_x = d3.event.dx;
        }
        else if (_tipo_scroll === tipo_scroll.y) {
            pos_y = d3.event.dy;
            invert_scroll_contenido = true;
        }
        else if (_tipo_scroll === tipo_scroll.contenido) {
            pos_x = d3.event.dx;
            pos_y = d3.event.dy;
        }
        fun_asignar_top_scroll(propiedades, _tipo_scroll, pos_x, pos_y, invert_scroll_contenido);
        d3.event.sourceEvent.preventDefault();
    }
    function fun_on_drag_end(propiedades, elemento) {
        d3.select(elemento).style("touch-action", "none");
        if (propiedades.prop_config.event_scroll.scroll_end)
            propiedades.prop_config.event_scroll.scroll_end();
    }
    function fun_on_wheel(propiedades) {
        var wheel_event = d3.event;
        var value = wheel_event.wheelDelta | -wheel_event.deltaY;
        var pos_y = propiedades.prop_scroll_y.prop_scale_linear(propiedades.prop_height / 4) *
            (value > 0 ? -1 : 1);
        fun_asignar_top_scroll(propiedades, tipo_scroll.y, 0, pos_y, true, true);
        d3.event.preventDefault();
    }
})(Scroll = exports.Scroll || (exports.Scroll = {}));
