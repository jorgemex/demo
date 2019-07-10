import { D3Utils } from '../general/Utils';
// // namespace _ui {
// //     export namespace control_svg {
export namespace Notificacion {
    export interface iObjetoControl {
        prop_element?: SVGGElement;
        prop_config: iConfigCarga
        fun_mostrar(mensanje: string, tipo: tTipoNotificacion): void;
        fun_ocultar(): void;
    }

    export interface iConfigCarga {
        width: number;
        height: number;
        prop_medida_icono: number;
        opacity?: number;
        background?: string;
        el_contenedor_padre: d3.Selection<d3.BaseType, {}, null, undefined>;
        prop_configText?: iConfigText;
        fun_callback_mostrar?(): void;
    }

    interface iConfigText {
        prop_size_text?: number;
        prop_font_family?: string;
        prop_weight?: string;
        prop_color?: string;
    }

    type tTipoNotificacion = "info" | "warning" | "error" | "success";

    interface iProperties {
        el_g_contenedor?: d3.Selection<SVGGElement, {}, null, undefined>;
        el_rect_background?: d3.Selection<SVGRectElement, {}, null, undefined>;
        el_g_contenedor_info?: d3.Selection<SVGGElement, {}, null, undefined>;
        el_g_contenedor_imagen_tipo?: d3.Selection<SVGGElement, {}, null, undefined>;
        el_texto_mensaje?: d3.Selection<SVGTextElement, {}, null, undefined>;
        // el_g_contenedor_animacion?: d3.Selection<SVGGElement, {}, null, undefined>;
        prop_time_out?: number;
        prop_config?: iConfigCarga;
    }
    let prop_icono_warning = '<svg viewBox="15 15 70 70" width="30" height="30">' +
        '   <g><path d="M52.614669,61.9445904 L47.7622907,61.9445904 L47.5,16 L52.9206748,16 L52.614669,61.9445904 Z M46.5,76.5891554 C46.5,75.5982744 ' +
        '           46.8205743,74.7604096 47.4617326,74.075536 C48.1028909,73.3906624 48.9771846,73.0482307 50.0846398,73.0482307 C51.192095,73.0482307 ' +
        '           52.0736744,73.3906624 52.7294045,74.075536 C53.3851346,74.7604096 53.7129947,75.5982744 53.7129947,76.5891554 C53.7129947,77.5508928 ' +
        '           53.3851346,78.3596144 52.7294045,79.0153445 C52.0736744,79.6710745 51.192095,79.9989347 50.0846398,79.9989347 C48.9771846,79.9989347 ' +
        '           48.1028909,79.6710745 47.4617326,79.0153445 C46.8205743,78.3596144 46.5,77.5508928 46.5,76.5891554 Z" fill="#D0A653"/>' +
        '   </g></svg>';

    let prop_icono_info = '<svg viewBox="0 0 100 100" width="30" height="30">' +
        '   <g fill="#408CE7" transform="translate(45, 5)">' +
        '       <circle r="9" cy="8.75" cx="8.75"></circle>' +
        '       <rect width="17" height="60" y="25"></rect>' +
        '   </g></svg>';

    let prop_icono_error = '<svg viewBox="20 20 60 60" width="30" height="30">' +
        '   <g><polygon xmlns="http://www.w3.org/2000/svg" points="50.5 48.3786797 31.5 29.3786797 29.3786797 31.5 48.3786797 50.5 29.8486916 69.029988 31.970012 ' +
        '           71.1513084 50.5 52.6213203 69.029988 71.1513084 71.1513084 69.029988 52.6213203 50.5 71.6213203 31.5 69.5 29.3786797 50.5 48.3786797" fill="#FF4652"/>' +
        '   </g></svg>';;

    let prop_icono_success = '<svg viewBox="0 0 100 100" width="30" height="30">' +
        '   <g transform="translate(26.000000, 48.500000) rotate(13.000000) translate(-26.000000, -48.500000) translate(5.000000, 27.000000)">' +
        '       <polygon fill="#82FB99" points="0.58313687 2.69526469 39.1841781 42.3121227 41.3328668 40.2185286 2.73182563 0.601670511"></polygon>' +
        '   </g><polygon fill="#82FB99" points="41.0159493 72.1212604 109.12126 2.98405067 106.984051 0.878739615 38.8787396 70.0159493"></polygon></svg>';

    export function fun_main(config: iConfigCarga): iObjetoControl {
        let propiedades: iProperties = {};
        propiedades.prop_config = config;
        propiedades.el_g_contenedor = config.el_contenedor_padre.append<SVGGElement>("g")
            .classed("control-notificacion", true)
            .style("pointer-events", "all")
            .property("propiedades", propiedades);

        let obj_control: iObjetoControl = {
            prop_config: propiedades.prop_config,
            prop_element: propiedades.el_g_contenedor.node(),
            fun_mostrar: (mensaje, tipo) => { fun_mostrar(propiedades, mensaje, tipo); },
            fun_ocultar: () => { fun_ocultar(propiedades); }
        }
        init_properties(propiedades);
        fun_dibuja_notificacion(propiedades);
        return obj_control;
    }

    function init_properties(propiedades: iProperties): void {
        if (!propiedades.prop_config.prop_medida_icono) propiedades.prop_config.prop_medida_icono = 110;
        if (propiedades.prop_config.prop_configText === undefined) propiedades.prop_config.prop_configText = {};
        if (propiedades.prop_config.prop_configText.prop_color === undefined) propiedades.prop_config.prop_configText.prop_color = "#ffffff";
        if (propiedades.prop_config.prop_configText.prop_font_family === undefined) propiedades.prop_config.prop_configText.prop_font_family = "Roboto-Light, Roboto";
        if (propiedades.prop_config.prop_configText.prop_size_text === undefined) propiedades.prop_config.prop_configText.prop_size_text = 14;
        if (propiedades.prop_config.prop_configText.prop_weight === undefined) propiedades.prop_config.prop_configText.prop_weight = "300";
    }

    function fun_dibuja_notificacion(propiedades: iProperties): void {

        propiedades.el_g_contenedor.attr("display", "none").style("opacity", 0)
            .call(D3Utils.eventos.fun_agregar_click, () => { fun_ocultar(propiedades) });

        propiedades.el_rect_background = propiedades.el_g_contenedor.append<SVGRectElement>("rect")
            .attr("fill", propiedades.prop_config.background || "#ffffff")
            .attr("width", propiedades.prop_config.width)
            .attr("height", propiedades.prop_config.height)
            .attr("opacity", propiedades.prop_config.opacity || 0.5);

        propiedades.el_g_contenedor_info = propiedades.el_g_contenedor.append<SVGGElement>("g")

        propiedades.el_g_contenedor_imagen_tipo = propiedades.el_g_contenedor_info.append<SVGGElement>("g");

        propiedades.el_texto_mensaje = propiedades.el_g_contenedor_info.append<SVGTextElement>("text")
            .classed("notificacion-text-menaje", true)
            .attr("fill", propiedades.prop_config.prop_configText.prop_color)
            .attr("font-size", propiedades.prop_config.prop_configText.prop_size_text)
            .attr("font-family", propiedades.prop_config.prop_configText.prop_font_family)
            .attr("font-weight", propiedades.prop_config.prop_configText.prop_weight)
            .attr("text-anchor", "middle")
            .attr("x", propiedades.prop_config.prop_medida_icono);
    }

    function fun_mostrar(propiedades: iProperties, mensaje: string, tipo: tTipoNotificacion) {
        propiedades.prop_config.el_contenedor_padre.append(() => propiedades.el_g_contenedor.node());
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////
        let icono = "";
        switch (tipo) {
            case "info":
                icono = prop_icono_info;
                break;
            case "error":
                icono = prop_icono_error;
                break;
            case "success":
                icono = prop_icono_success;
                break;
            case "warning":
                icono = prop_icono_warning;
                break;
            default:
                break;
        }

        propiedades.el_texto_mensaje.text(mensaje)
            .attr("x", propiedades.prop_config.width / 2)
            .attr("y", propiedades.prop_config.prop_medida_icono + 10);

        D3Utils.wrap(propiedades.el_texto_mensaje, propiedades.prop_config.width - 10, propiedades.prop_config.prop_configText.prop_size_text, null, null, null, true)
        propiedades.el_g_contenedor_imagen_tipo.html(icono);

        propiedades.el_g_contenedor_imagen_tipo.select("svg")
            .attr("width", propiedades.prop_config.prop_medida_icono)
            .attr("height", propiedades.prop_config.prop_medida_icono)
            .attr("x", (propiedades.prop_config.width - propiedades.prop_config.prop_medida_icono) / 2)

        let contenido_height = propiedades.el_g_contenedor_info.node().getBoundingClientRect().height;
        propiedades.el_g_contenedor_info.attr("transform", "translate(0, " + ((propiedades.prop_config.height - contenido_height) / 2) + ")")
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////
        propiedades.el_g_contenedor.transition()
            .duration(500).style("display", "block")
            .style("opacity", 1)
            .on("end", () => { propiedades.el_g_contenedor.style("display", "block"); });

        propiedades.el_g_contenedor.style("pointer-events", "all");
        if (propiedades.prop_config.fun_callback_mostrar) propiedades.prop_config.fun_callback_mostrar();
        propiedades.prop_time_out = setTimeout(() => { fun_ocultar(propiedades); }, 2000);
    }

    function fun_ocultar(propiedades: iProperties) {
        propiedades.el_g_contenedor.style("pointer-events", "none");
        propiedades.el_g_contenedor.transition()
            .duration(500).style("opacity", 0)
            .on("end", () => { propiedades.el_g_contenedor.style("display", "none"); });

        clearTimeout(propiedades.prop_time_out);
        propiedades.prop_time_out = null;
    }
}
// //     }
// // }