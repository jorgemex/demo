import * as d3 from 'd3';
import {D3Utils} from '../general/Utils';
// // export namespace _ui {
// //     export namespace control_svg {
        /**
         * Ejemplo de como se usa el control.
         * @example Configuracion de ejemplo.
         * 
         * ui.control_svg.input_v3.fun_main({
         *      prop_height: 40
         *      , prop_width: 300
         *      , prop_stroke: "red"
         *      , prop_stroke_width: 5
         *      , prop_placeholder: "Placeholder..."
         *      , prop_padding: { prop_left: 5, prop_right: 5 }
         *      , prop_configText: { prop_size_text: 17, prop_font_family: "Arial, Verdana, Tahoma", prop_weight: "normal", prop_color: "blue" }
         *      , prop_events: {
         *          keyDown: (e) => {
         *              if (e.keyCode === 13) console.log("Click en enter.");
         *          }, input: () => {
         *              console.log("Se hizo un cambio en el input")
         *          }
         *      }
         *   });
         * 
         *   _svg.append(() => input_1.prop_element).attr("transform", "translate(10, 10)");
         * 
         *   input_1.fun_value("Este es el valor que se va a mostrar en el input... esta función actualiza y retorna el valor");
         */
        export namespace Input {
            let prop_index_control_input: number = -1;

            let index_input_in_focus: number = null;
            let fun_callback_focus_out: () => void = null;
            export interface iObjetoControl {
                prop_element: SVGGElement;
                prop_config: iConfigInput;
                fun_actualizar(): void;
                fun_value(value?: string): string;
                fun_focus(): void;
                fun_focus_out(): void;
                fun_ir_a_pos_puntero(posicion?: number): void;
                fun_disable(): void;
                fun_enable(): void;
                fun_assignValue(value?: string): void;//new
            }

            export interface iConfigInput {
                prop_width?: number;
                prop_height?: number;
                prop_fill?: string;
                prop_stroke?: string;
                prop_stroke_disable?: string;
                prop_stroke_width?: number;
                prop_tipo?: tTipoInput;
                prop_placeholder?: string;
                prop_padding?: tPadding;
                prop_configText?: tConfigText;
                prop_events?: iEventInput;
            }

            type tPadding = {
                prop_left?: number;
                prop_right?: number;
            }

            type tConfigText = {
                prop_size_text?: number;
                prop_font_family?: string;
                prop_weight?: string;
                prop_color?: string;
            }

            type tPosicionPuntero = {
                prop_char_index: number;
                prop_pos_x: number;
            }            

            type tTipoInput = "input" | "password" /* | "number" */;

            interface iProperties {
                el_g_contenedor?: d3.Selection<SVGGElement | d3.BaseType, {}, null, undefined>;
                /**
                 * 
                 */
                el_g_translate?: d3.Selection<SVGGElement | d3.BaseType, {}, null, undefined>;
                /**
                 * 
                 */
                el_text_valor?: d3.Selection<SVGTextElement | d3.BaseType, {}, null, undefined>;
                /**
                 * 
                 */
                el_text_plaholder?: d3.Selection<SVGTextElement | d3.BaseType, {}, null, undefined>;
                /**
                 * 
                 */
                el_puntero?: d3.Selection<SVGLineElement | d3.BaseType, {}, null, undefined>;
                /**
                 * 
                 */
                prop_config?: iConfigInput;
                /** 
                 * Intervalo de tiempo para parpadeo de puntero 
                 */
                prop_intervalo_puntero?: d3.Timer;
                /**
                 * Indice de la letra en donde esta posicionado el puntero.
                 */
                prop_char_posicion?: number;
                /**
                 * Posicion del puntero...
                 */
                prop_puntero_posicion?: number;
                /**
                 * Ancho total del texto.
                 */
                prop_total_TextLength?: number;
                /**
                 * 
                 */
                prop_x_transform?: number;
                /**
                 * Ancho del input exluyendo el padding -left and right
                 */
                prop_width_text?: number;
                /**
                 * 
                 */
                prop_top_text?: number;

                /**
                 * Numero de control, indice que pertenece el control.
                 */
                prop_index_control?: number;
                /**
                 * Valor que se le asigno al input
                 */
                prop_value?: string;
                prop_esta_inactivo_input?: boolean;
                /**
                 * Input auxiliar, es necesario para que muestra teclado de celulares y tabletas.
                 */
                prop_input_html_auxiliar?: d3.Selection<HTMLInputElement, {}, null, undefined>;
            }

            enum eTeclaKeyDown {
                INICIO = 36
                , FIN = 35
            }

            interface iEventInput {
                focus?(): void;
                /**
                 * Se ejecuta despues de presionar una tecla.
                 */
                keyUp?(e?: KeyboardEvent, puntero_posicion?: number): void;
                /**
                 * Se ejecuta cuando se presiona una tecla.
                 */
                keyDown?(e?: KeyboardEvent, puntero_posicion?: number): void;
                /**
                 * Se ejecuta en el momento en que el input tiene un cambio en su valor.
                 */
                input?(puntero_posicion?: number): void;
                /**
                 * Se ejecuta cuando el valor del input auxiliar ha sido cambiado.
                 */
                change?(e?: Event, puntero_posicion?: number): void;
            }

            export function fun_main(config: iConfigInput): iObjetoControl {
                let propiedades: iProperties = {};
                propiedades.prop_config = config;
                propiedades.el_g_contenedor = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
                propiedades.el_g_contenedor.property("propiedades", propiedades).classed("control-input", true);
                propiedades.el_g_contenedor.style("pointer-events", "all");
                propiedades.el_g_contenedor.append("defs");
                let obj_control: iObjetoControl = {
                    prop_element: <SVGGElement>propiedades.el_g_contenedor.node()
                    , prop_config: propiedades.prop_config
                    , fun_actualizar: () => { fun_actualizar(propiedades) }
                    , fun_value: (value?: string) => fun_value(propiedades, value)
                    , fun_assignValue: (value?: string) => fun_assignValue(propiedades, value)//new
                    , fun_focus: () => { fun_on_click(propiedades); }
                    , fun_focus_out: () => { fun_on_click_body(propiedades); }
                    , fun_disable: () => { fun_toggle_enable(propiedades, false); }
                    , fun_enable: () => { fun_toggle_enable(propiedades, true); }
                    , fun_ir_a_pos_puntero: (posicion?) => { fun_ir_a_pos_puntero(propiedades, posicion); }
                }
                fun_add_input_auxiliar();
                obj_control.fun_actualizar();
                return obj_control;
            }

            function fun_add_input_auxiliar(): void {
                if (d3.select(document.body).select(".auxiliar-control-input").size() === 0) {
                    d3.select(document.body).append("input")
                        .attr("id", "auxiliar-control-input")
                        .attr("class", "auxiliar-control-input")
                        // .attr("type", "number")
                        .attr("autocapitalize", "none")
                        .style("position", "absolute")
                        .style("top", "-1000px")
                        .style("left", "-1000px");                        
                }
            }

            function fun_init_properties(propiedades: iProperties): void {
                // d3.select(document.body).select<HTMLInputElement>(".auxiliar-control-input").node().
                if (!propiedades.prop_input_html_auxiliar) propiedades.prop_input_html_auxiliar = <any>d3.select(".auxiliar-control-input");
                if (propiedades.prop_total_TextLength === undefined) propiedades.prop_total_TextLength = 0;
                if (propiedades.prop_index_control === undefined) propiedades.prop_index_control = prop_index_control_input += 1;
                if (propiedades.prop_puntero_posicion === undefined) propiedades.prop_puntero_posicion = 0;
                if (propiedades.prop_char_posicion === undefined) propiedades.prop_char_posicion = 0;
                if (propiedades.prop_x_transform === undefined) propiedades.prop_x_transform = 0;

                if (!propiedades.prop_config.prop_height) propiedades.prop_config.prop_height = 30;
                if (!propiedades.prop_config.prop_width) propiedades.prop_config.prop_width = 300;
                if (!propiedades.prop_config.prop_stroke_disable) propiedades.prop_config.prop_stroke_disable = "transparent";
                if (propiedades.prop_config.prop_stroke === undefined) propiedades.prop_config.prop_stroke = "#D1D6DA";
                if (propiedades.prop_config.prop_stroke_width === undefined) propiedades.prop_config.prop_stroke_width = 1;
                if (!propiedades.prop_config.prop_events) propiedades.prop_config.prop_events = {};
                if (!propiedades.prop_config.prop_configText) propiedades.prop_config.prop_configText = {};
                if (!propiedades.prop_config.prop_configText.prop_size_text) propiedades.prop_config.prop_configText.prop_size_text = 18;
                if (!propiedades.prop_config.prop_configText.prop_color) propiedades.prop_config.prop_configText.prop_color = "#000000";

                if (propiedades.prop_value === undefined) propiedades.prop_value = "";

                if (!propiedades.prop_config.prop_padding) propiedades.prop_config.prop_padding = {};
                if (!propiedades.prop_config.prop_padding.prop_left) propiedades.prop_config.prop_padding.prop_left = 5;
                if (!propiedades.prop_config.prop_padding.prop_right) propiedades.prop_config.prop_padding.prop_right = 5;

                propiedades.prop_top_text = (propiedades.prop_config.prop_height - propiedades.prop_config.prop_configText.prop_size_text) / 2;
                propiedades.prop_width_text = propiedades.prop_config.prop_width - propiedades.prop_config.prop_padding.prop_left - propiedades.prop_config.prop_padding.prop_right;
            }

            function fun_dibuja_input(propiedades: iProperties): void {
                if (!propiedades.el_g_translate) {
                    propiedades.el_g_contenedor.attr("cursor", "text")
                        .style("-webkit-user-select", "none")
                        .style("-moz-user-select", "none")
                        .style("-ms-user-select", "none")
                        .style("user-select", "none")
                        .call(D3Utils.eventos.fun_agregar_click, ()=> { fun_on_click(propiedades); });
                        // .call(modulos._funciones.eventos.fun_agregar_click, () => { fun_on_click(propiedades); });


                    // if (modulos._funciones.fun_es_dispositivo_movil()) {
                    if (D3Utils.fun_es_dispositivo_movil()) {
                        propiedades.el_g_contenedor.call(d3.drag()
                            .on("drag", () => {
                                propiedades.prop_x_transform -= d3.event.dx;
                                if (propiedades.prop_x_transform < 0 || propiedades.prop_total_TextLength < propiedades.prop_width_text) {
                                    propiedades.prop_x_transform = 0;
                                } else if (propiedades.prop_x_transform > propiedades.prop_total_TextLength - propiedades.prop_width_text) {
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

                // propiedades.el_text_valor.attr("y", (propiedades.prop_config.prop_configText.prop_size_text / 4) * 3)// Nota
                propiedades.el_text_valor.attr("y", (propiedades.prop_config.prop_configText.prop_size_text / 4) * 3.2)// Nota
                    .style("font-size", propiedades.prop_config.prop_configText.prop_size_text)
                    .style("font-family", propiedades.prop_config.prop_configText.prop_font_family || null);

                // // propiedades.el_text_plaholder.attr("y", (propiedades.prop_config.prop_configText.prop_size_text / 4) * 3)// Nota
                propiedades.el_text_plaholder.attr("y", (propiedades.prop_config.prop_configText.prop_size_text / 4) * 3.2)// Nota
                    .style("font-size", propiedades.prop_config.prop_configText.prop_size_text)
                    .style("font-family", propiedades.prop_config.prop_configText.prop_font_family || null);

                propiedades.el_puntero.attr("x1", 0).attr("y1", 0).attr("stroke-width", 1)
                    .attr("x2", 0).attr("y2", propiedades.prop_config.prop_configText.prop_size_text);

                fun_asignar_valor(propiedades);
            }

            function fun_move_puntero(propiedades: iProperties): void {
                propiedades.el_puntero.attr("display", "block")
                    .attr("transform", "translate(" + propiedades.prop_puntero_posicion + ")");
            }

            // --------------------------------------------------------------------------------
            function fun_asignar_valor(propiedades: iProperties): void {
                let text_placeholder = propiedades.prop_value.length > 0 ? "" : propiedades.prop_config.prop_placeholder;
                propiedades.el_text_plaholder.text(text_placeholder || "");

                propiedades.prop_input_html_auxiliar.property("value", propiedades.prop_value);

                propiedades.el_text_valor.text(propiedades.prop_value);
                // Cuando se abre el input en internet explorer y el control aun no se ha agregado al DOM la función getComputedTextLength causa un error.
                try {
                    propiedades.prop_total_TextLength = +(<SVGTextElement>propiedades.el_text_valor.node()).getComputedTextLength();
                } catch (e) {
                    propiedades.prop_total_TextLength = 0;
                }
            }

            function fun_intervalo_puntero(propiedades: iProperties): void {
                // let display_actual = "block";
                let esta_cursor_oculto = true;
                if (propiedades.prop_intervalo_puntero) propiedades.prop_intervalo_puntero.stop();
                propiedades.prop_intervalo_puntero = d3.interval(function () {
                    esta_cursor_oculto = !esta_cursor_oculto;
                    propiedades.el_puntero.attr("display", esta_cursor_oculto ? "block" : "none");
                }, 500);
            }

            function fun_get_posicion_char(selection: d3.Selection<SVGTextElement, {}, null, undefined>, pos_x: number): tPosicionPuntero {
                let text_principal = selection.text();
                let length_principal = text_principal.length;
                if (pos_x <= 0) {
                    return { prop_char_index: 0, prop_pos_x: 0 }
                } else if (pos_x >= selection.node().getComputedTextLength()) {
                    return { prop_char_index: text_principal.length, prop_pos_x: selection.node().getComputedTextLength() }
                } else {
                    let next_text_length = 0;
                    let prev_text_length = 0;
                    let aux_span = selection.append<SVGTSpanElement>("tspan").attr("xml:space", "preserve");
                    let index = 0;
                    for (index = 0; index < length_principal; index++) {
                        let text_t_span = text_principal.slice(0, index + 1);
                        aux_span.text(text_t_span);
                        next_text_length = (aux_span.node().getSubStringLength(0, text_t_span.length))//(<any>aux_span.node()).getComputedTextLength();

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
                    return { prop_char_index: index, prop_pos_x: prev_text_length }
                }
            }

            function fun_get_posicion_puntero(selection: d3.Selection<any, any, any, any>, value: any, char_posicion: number): number {
                let aux_span_ = selection.append("tspan").attr("xml:space", "preserve");
                aux_span_.text(value.slice(0, char_posicion));
                let puntero_posicion = (<any>aux_span_.node()).getComputedTextLength();
                aux_span_.remove();
                return puntero_posicion;
            }

            /**
             * Cuando el texto es mayor que el contenedor. Aplica el transform.
             */
            function fun_x_transform(propiedades: iProperties): void {
                if (propiedades.prop_total_TextLength > propiedades.prop_width_text) {
                    if (propiedades.prop_total_TextLength >= propiedades.prop_x_transform + propiedades.prop_width_text) {
                        let puntero_pos_centro = propiedades.prop_puntero_posicion - (propiedades.prop_width_text / 2);
                        // Cuando el cursor del input auxiliar se desplaza a la izquierda.
                        if (propiedades.prop_puntero_posicion < propiedades.prop_x_transform) {

                            // Para centrar puntero en el input
                            propiedades.prop_x_transform = puntero_pos_centro < 0 ? 0 : puntero_pos_centro;
                            // Descomentar si no se quiere centrar puntero en el input.
                            // propiedades.prop_x_transform = propiedades.prop_puntero_posicion;

                            // Cuando el cursor del input auxiliar se desplaza a la derecha.
                        } else if ((propiedades.prop_puntero_posicion - propiedades.prop_x_transform) >= propiedades.prop_width_text) {
                            // Para centrar puntero en el input
                            let text_length_menos_widht = propiedades.prop_total_TextLength - propiedades.prop_width_text;
                            propiedades.prop_x_transform = puntero_pos_centro > text_length_menos_widht ? text_length_menos_widht : puntero_pos_centro;
                            // Descomentar si no se quiere centrar puntero en el input.
                            // propiedades.prop_x_transform = propiedades.prop_puntero_posicion - propiedades.prop_width_text;
                        }
                    } else propiedades.prop_x_transform = propiedades.prop_total_TextLength - propiedades.prop_width_text;
                } else propiedades.prop_x_transform = 0;

                fun_mover_grupo_texto(propiedades);
            }

            /**
             * Cambia de posicion el grupo que contiene el elemento TEXT.
             */
            function fun_mover_grupo_texto(propiedades: iProperties): void {
                propiedades.el_g_translate.attr("transform", `translate(${-propiedades.prop_x_transform + propiedades.prop_config.prop_padding.prop_left} ,${propiedades.prop_top_text})`);
            }

            function fun_dibuja_clippath(propiedades: iProperties) {
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

            // -------------------------------------------------------------------------
            // FUNCIONES EVENTOS - Default
            // -------------------------------------------------------------------------
            function fun_on_focus(propiedades: iProperties): void {
                propiedades.el_g_contenedor.classed("focus-active", true);
                // Se aplica borde, simula el foco al input
                // // propiedades.el_g_contenedor.select(".control-input-background").attr("stroke", "#7FC4FA");//cambio
                propiedades.el_g_contenedor.select(".control-input-background").attr("stroke", "#000000");

                if (!propiedades.prop_intervalo_puntero) fun_intervalo_puntero(propiedades);
            }

            function fun_on_focus_out(propiedades: iProperties): void {
                fun_on_keyDown(propiedades, eTeclaKeyDown.INICIO, true);
                propiedades.el_g_contenedor.classed("focus-active", false);
                propiedades.el_puntero.attr("display", "none");
                propiedades.el_g_contenedor.select(".control-input-background")
                    .attr("stroke", propiedades.prop_config.prop_stroke);
                propiedades.prop_intervalo_puntero.stop();
                propiedades.prop_intervalo_puntero = null;
            }

            function fun_on_keyUp(propiedades: iProperties): void {
                //  Ejecutar el callback del evento actual.
                if (propiedades.prop_config.prop_events.keyUp) {
                    propiedades.prop_config.prop_events.keyUp(d3.event, propiedades.prop_char_posicion);
                }
            }

            function fun_on_keyPress(propiedades: iProperties): void {

            }

            /**
             * Función que se ejecuta cuando hay un cambio en el valor del input auxiliar.
             * @param propiedades 
             */
            function fun_on_input(propiedades: iProperties): void {
                // Obtener ek valor del input auxiliar.
                propiedades.prop_value = propiedades.prop_input_html_auxiliar.property("value");
                // Obtener la posicion del cursor en el input auxiliar, la posicion en el caracter actual.
                propiedades.prop_char_posicion = propiedades.prop_input_html_auxiliar.node().selectionEnd;              
                
                // Iniciar el rango de selección, si no se inicializan las propiedades <selectionStart y selectionEnd> 
                // toman el inicio y fin de la palabra en donde el cursor esta posicionado.
                propiedades.prop_input_html_auxiliar.node().setSelectionRange(propiedades.prop_char_posicion, propiedades.prop_char_posicion);
                // Obtener la posicion del cursor en el input control creado, la posicion en PX.
                propiedades.prop_puntero_posicion = fun_get_posicion_puntero(propiedades.el_text_valor, propiedades.prop_value, propiedades.prop_char_posicion);
                fun_asignar_valor(propiedades);
                fun_x_transform(propiedades);

                fun_move_puntero(propiedades);
                //  Ejecutar el callback del evento actual.
                if (propiedades.prop_config.prop_events.input) {
                    propiedades.prop_config.prop_events.input(propiedades.prop_char_posicion);
                }
            }

            /**
             * Se ejecuta cuando el valor del input auxiliar ha sido cambiado.
             * @param propiedades 
             */
            function fun_on_change(propiedades: iProperties): void {
                //  Ejecutar el callback del evento actual.
                if (propiedades.prop_config.prop_events.change)
                    propiedades.prop_config.prop_events.change(d3.event, propiedades.prop_char_posicion);
            }

            /**
             * 
             * @param propiedades 
             * @param tecla_key_down 
             * @param no_evento - Si la función solo se manda a llamar sin ejecutar evento keydown del input es inicializa con true.
             */
            function fun_on_keyDown(propiedades: iProperties, tecla_key_down: eTeclaKeyDown = null, no_evento = false): void {
                // propiedades.prop_char_posicion = propiedades.prop_input_html_auxiliar.node().selectionStart;
                if (!tecla_key_down && d3.event) tecla_key_down = d3.event.keyCode;
                if (tecla_key_down === 37) {
                    if (propiedades.prop_char_posicion > 0) {
                        propiedades.prop_char_posicion -= 1;
                    }
                } else if (tecla_key_down === 39) {
                    if (propiedades.prop_char_posicion < propiedades.prop_value.length) {
                        propiedades.prop_char_posicion += 1;
                    }
                } else if (tecla_key_down === 36) {
                    propiedades.prop_char_posicion = 0;
                } else if (tecla_key_down === 35) {
                    propiedades.prop_char_posicion = propiedades.prop_value.length;
                }

                // Obtener la posicion del cursor en el input control creado, la posicion en PX.
                propiedades.prop_puntero_posicion = fun_get_posicion_puntero(propiedades.el_text_valor, propiedades.prop_value, propiedades.prop_char_posicion);
                fun_move_puntero(propiedades);

                fun_x_transform(propiedades);

                //  Ejecutar el callback del evento actual.
                if (d3.event instanceof KeyboardEvent && !no_evento && propiedades.prop_config.prop_events.keyDown) {
                    propiedades.prop_config.prop_events.keyDown(d3.event, propiedades.prop_char_posicion);
                }
            }

            function fun_on_click(propiedades: iProperties): void {
                if (propiedades.prop_esta_inactivo_input) return;
                // Posicion "X" en donde se ejecuto el evento click/touchend
                let posicion_x = 0;
                if (d3.event) {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();

                    posicion_x = d3.mouse(<any>propiedades.el_g_contenedor.node())[0];
                }
                // Si el evento click es realizado en otro input al que actualmente tiene el foco.
                // Se hace perder el foco al input que lo tiene, usando la función callback general, 
                // para despues aplicar el foco al input al que se le dio click.
                if (index_input_in_focus != propiedades.prop_index_control) {
                    // Se verifica que se tenga un callback para ejecutarlo.
                    if (fun_callback_focus_out) fun_callback_focus_out();
                    // Se cambia el indice del input que tiene el foco.
                    index_input_in_focus = propiedades.prop_index_control;
                    // Se cambia el valor del callback por el del input actualmente seleccionado.
                    fun_callback_focus_out = function () { fun_on_focus_out(propiedades); };

                    // Se inicializa los valores de los eventos a utilizar en el input.
                    propiedades.prop_input_html_auxiliar
                        .on("keydown", function () { fun_on_keyDown(propiedades); })
                        .on("keyup", function () { fun_on_keyUp(propiedades); })
                        .on("input", function () { fun_on_input(propiedades); })
                        .on("change", function () { fun_on_change(propiedades); })
                        .on("focusout", function () { fun_on_click_body(propiedades); });

                    // Se crea evento click en el body con el nombre eventFocusOutInput para diferenciarlo del resto de eventos.
                    // El evento es eliminado al ser llamado.
                    // // d3.select(document.body).call(modulos._funciones.eventos.fun_agregar_click, () => {
                    d3.select(document.body).call(D3Utils.eventos.fun_agregar_click, () => {
                        fun_on_click_body(propiedades);
                    }, "eventFocusOutInput");

                    propiedades.prop_input_html_auxiliar.property("value", propiedades.prop_value);
                    // Aplicar el foco al control input.
                    fun_on_focus(propiedades);
                }

                // Posicion del puntero dentro del texto.
                let x_click = posicion_x + propiedades.prop_x_transform - propiedades.prop_config.prop_padding.prop_left;
                // Obtiene el indice de la letra en la que el cursor esta actualmente, tambien obtiene la posicion en "PX".
                let posicion = fun_get_posicion_char(<any>propiedades.el_text_valor, x_click);
                // Indice de la letra en la que esta posicionado el puntero.
                propiedades.prop_char_posicion = posicion.prop_char_index;
                // Coordenada x en la que el puntero esta posicionado.
                propiedades.prop_puntero_posicion = posicion.prop_pos_x;
                fun_move_puntero(propiedades);
                // Asignar el foco al input auxiliar.
                propiedades.prop_input_html_auxiliar.node().focus();
                // Se cambia la posicion del cursor en el input auxiliar.
                propiedades.prop_input_html_auxiliar.node().setSelectionRange(propiedades.prop_char_posicion, propiedades.prop_char_posicion);

                if (propiedades.prop_config.prop_events.focus) propiedades.prop_config.prop_events.focus();
            }            

            function fun_on_click_body(propiedades: iProperties): void {
                if (fun_callback_focus_out) fun_callback_focus_out();
                // Inicializar el callback de focus out con  null.
                fun_callback_focus_out = null;
                // Se cambia el indice del input que tiene el foco a null.
                index_input_in_focus = null;
                // Quita el foco al input auxiliar.
                propiedades.prop_input_html_auxiliar.node().blur();
                propiedades.prop_input_html_auxiliar.property("value", "");
                // Quita eventos en el input auxiliar.
                propiedades.prop_input_html_auxiliar.on("keydown", null).on("input", null);
                // Eliminar el evento creado en el body.
                // // d3.select(document.body).call(modulos._funciones.eventos.fun_agregar_click, null, "eventFocusOutInput");
                d3.select(document.body).call(D3Utils.eventos.fun_agregar_click, null, "eventFocusOutInput");

            }

            // -------------------------------------------------------------------------
            // FUNCIONES - Objeto
            // -------------------------------------------------------------------------
            export function fun_actualizar(propiedades: iProperties): void {
                fun_init_properties(propiedades);
                fun_dibuja_clippath(propiedades);
                fun_dibuja_input(propiedades);
            }

            function fun_value(propiedades: iProperties, value: string = null): string {
                if (value != null || value != undefined) {
                    propiedades.prop_value = value;
                    fun_asignar_valor(propiedades);

                    // if (!propiedades.el_g_contenedor.classed("focus-active")) {
                    //     fun_on_keyDown(propiedades, eTeclaKeyDown.INICIO, true);
                    //     propiedades.el_puntero.attr("display", "none")
                    // } else fun_on_keyDown(propiedades, eTeclaKeyDown.FIN, true);
                }

                fun_ir_a_pos_puntero(propiedades);

                return propiedades.prop_value;
            }

            function fun_toggle_enable(propiedades: iProperties, toggle: boolean): void {
                if (toggle) {
                    propiedades.prop_esta_inactivo_input = false;
                    propiedades.el_g_contenedor.style("pointer-events", "all");
                    propiedades.el_g_contenedor.select(".control-input-background").attr("stroke", propiedades.prop_config.prop_stroke);
                } else {
                    propiedades.prop_esta_inactivo_input = true;
                    propiedades.el_g_contenedor.style("pointer-events", "none");
                    propiedades.el_g_contenedor.select(".control-input-background").attr("stroke", propiedades.prop_config.prop_stroke_disable);
                }

                fun_on_click_body(propiedades);
            }

            // // function fun_ir_a_pos_puntero(propiedades: iProperties, posicion?: number): void {
            // //     if (propiedades.prop_intervalo_puntero === null || propiedades.prop_intervalo_puntero === undefined) return;
            // //     if (posicion != null && posicion != undefined) propiedades.prop_char_posicion = posicion;
            // //     propiedades.prop_puntero_posicion = fun_get_posicion_puntero(propiedades.el_text_valor, propiedades.prop_value, propiedades.prop_char_posicion);
            // //     fun_move_puntero(propiedades);
            // // }

            // //FUNCION MODIFICADA NEW
            function fun_ir_a_pos_puntero(propiedades: iProperties, posicion?: number): void {
                if (propiedades.prop_intervalo_puntero === null || propiedades.prop_intervalo_puntero === undefined) return;
                if (posicion != null && posicion != undefined) propiedades.prop_char_posicion = posicion;
                propiedades.prop_puntero_posicion = fun_get_posicion_puntero(propiedades.el_text_valor, propiedades.prop_value, propiedades.prop_char_posicion);
                fun_move_puntero(propiedades);
                // Se cambia la posicion del cursor en el input auxiliar.
                propiedades.prop_input_html_auxiliar.node().setSelectionRange(propiedades.prop_char_posicion, propiedades.prop_char_posicion);

                // // //de prueba
                // setTimeout(() => {
                //     console.log("reposicionar");                    
                //     propiedades.prop_input_html_auxiliar.node().setSelectionRange(propiedades.prop_char_posicion, propiedades.prop_char_posicion);
                // }, 50);
            }            

            // function fun_(propiedades: iProperties): void {
            //     propiedades.el_g_contenedor.style("pointer-events", "none");
            // }

            // function fun_enable(propiedades: iProperties): void {
            //     propiedades.el_g_contenedor.style("pointer-events", "all");
            // }

            //new function
            export function fun_input_out(): void {                
                let propiedades: iProperties = d3.select(".control-input").property("propiedades");
                fun_on_click_body(propiedades);
            }

            //new de prueba
            function fun_assignValue(propiedades: iProperties, value: string = null): void {
                if (value != null || value != undefined) {
                    propiedades.prop_value = value;                    
                    
                    let text_placeholder = propiedades.prop_value.length > 0 ? "" : propiedades.prop_config.prop_placeholder;
                    propiedades.el_text_plaholder.text(text_placeholder || "");                    

                    propiedades.el_text_valor.text(propiedades.prop_value);                    
                    try {
                        propiedades.prop_total_TextLength = +(<SVGTextElement>propiedades.el_text_valor.node()).getComputedTextLength();
                    } catch (e) {
                        propiedades.prop_total_TextLength = 0;
                    }
                }                
            }
        }
// //     }
// // }