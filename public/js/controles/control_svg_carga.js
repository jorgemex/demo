"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Carga;
(function (Carga) {
    var contenido_svg = `
                    <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="110px" height="110px" viewBox="0 0 106 106" enable-background="new 0 0 110 110" xml:space="preserve">
                        <circle class="animacion-circulo" cx="53" cy="53" r="50" fill="transparent" stroke="rgb(63, 63, 63)" stroke-width="3" stroke-dasharray="20, 8">
                            <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                from="0 53 53"
                                to="360 53 53"
                                dur="10s"
                                repeatCount="indefinite"/>
                        </circle>
                        <text class="texto-centro" x="18" y="60" font-size="14px" font-weight="300" font-family="Roboto-Bold, Roboto" fill="#000">CARGANDO</text>
                    </svg>`;
    function fun_main(config) {
        let g_datum = {};
        g_datum.prop_config = config;
        g_datum.el_g_contenedor = g_datum.prop_config.el_contenedor_padre.append("g")
            .classed("control-cargando", true)
            .style("pointer-events", "all")
            .attr("display", "none");
        g_datum.el_rect_background = g_datum.el_g_contenedor.append("rect")
            .attr("fill", g_datum.prop_config.background || "#ffffff")
            .attr("width", g_datum.prop_config.width)
            .attr("height", g_datum.prop_config.height)
            .attr("opacity", config.opacity || 0.5);
        if (!g_datum.prop_config.prop_diametro)
            g_datum.prop_config.prop_diametro = 110;
        g_datum.el_g_contenedor_animacion = g_datum.el_g_contenedor.append("g");
        let obj_control = {
            config: g_datum.prop_config,
            prop_el_contenedor_carga: g_datum.el_g_contenedor,
            met_mostrar: () => { on_mostrar(g_datum); },
            met_ocultar: () => { on_ocultar(g_datum); }
        };
        return obj_control;
    }
    Carga.fun_main = fun_main;
    function on_mostrar(g_datum) {
        if (g_datum.el_g_contenedor) {
            g_datum.prop_config.el_contenedor_padre.append(() => g_datum.el_g_contenedor.node());
            g_datum.el_g_contenedor_animacion.html(contenido_svg);
            g_datum.el_g_contenedor_animacion.select("svg")
                .attr("x", (g_datum.prop_config.width - g_datum.prop_config.prop_diametro) / 2)
                .attr("y", (g_datum.prop_config.height - g_datum.prop_config.prop_diametro) / 2)
                .attr("height", g_datum.prop_config.prop_diametro)
                .attr("width", g_datum.prop_config.prop_diametro);
            g_datum.el_g_contenedor_animacion.select(".animacion-circulo")
                .attr("stroke", g_datum.prop_config.color || "rgb(63, 63, 63)");
            g_datum.el_g_contenedor_animacion.select(".texto-centro")
                .attr("fill", g_datum.prop_config.color || "rgb(63, 63, 63)");
            g_datum.el_g_contenedor.attr("display", "block");
            if (g_datum.prop_config.fn_callBack_mostrar)
                g_datum.prop_config.fn_callBack_mostrar();
        }
    }
    function on_ocultar(g_datum) {
        if (g_datum.el_g_contenedor) {
            g_datum.el_g_contenedor_animacion.html("");
            g_datum.el_g_contenedor.attr("display", "none");
            if (g_datum.prop_config.fn_callBack_ocultar)
                g_datum.prop_config.fn_callBack_ocultar();
        }
    }
})(Carga = exports.Carga || (exports.Carga = {}));
