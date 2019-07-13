import * as d3 from "d3";
import { D3Utils } from "../general/Utils";

// export namespace control_svg {
/**
 * Crea scroll a un grupo.
 * Para instanciar el control es necesario llamar a la @func fun_main
 * Recibe dos parametros:
 * * @param svg_g_element: SVGGElement - Elemento al que se le aplicará scroll
 * * @param config: iConfig - Configuración del Scroll.
 *
 * Ejemplo de como utilizar el control.
 *
 * let config: _ui.control_svg.scroll.iConfig = {
 *              prop_height: 400, // Alto del rango visible.
 *              prop_width: 400, // Ancho del rango visible
 *              prop_height_total: 700, // Alto total - Se refiere al limite que el scroll vertical tiene para desplazarce.
 *              prop_width_total: 700, // Ancho total - Se refiere al limite que el scroll horizontal tiene para desplazarce.
 *              mostrar_scroll_x: true, // Opcional - Si esta en true muestra y activa el evento del scroll horizontal.
 *              mostrar_scroll_y: true, // Opcional - Si esta en true muestra y activa el evento del scroll vertical.
 *              event_scroll: { // Opcional - Funciona como callback
 *                  scroll_start: () => {
 *
 *                  }, scroll: function () {
 *
 *                  }, scroll_end: function () {
 *
 *                  },
 *              }
 *          };
 *
 *          let instancia_scroll = scroll.fun_main(<SVGGElement>d3.select(".Elemento").node(), config);
 *          seleccion.append(() => instancia_scroll.element);
 */
export namespace Scroll {
  /**
   * Contador de los controles *scroll* que se han creado.
   */
  var prop_index_control_scroll: number = -1;
  export interface iObjetoControl {
    element: SVGGElement;
    config: iConfig;
    fun_actualizar(): void;
    fun_set_scrollTop(posicion: number): void;
    fun_get_scrollTop(): number;
    fun_set_scrollLeft(posicion: number): void;
    fun_get_scrollLeft(): number;
  }

  export interface iEventoScroll {
    scroll_start?: () => void;
    scroll?: () => void;
    scroll_end?: () => void;
  }

  export interface iConfig {
    prop_width: number;
    prop_height: number;
    /**
     * Opcional Ancho total, este dato se usara para crear el rango de scroll.
     * Si no se agrega valor obtiene el ancho del elemento contenedor.
     */
    prop_width_total?: number;
    /**
     * Alto total, este dato se usara para crear el rango de scroll.
     */
    prop_height_total: number;
    /**
     * Cuando recibe el valor *true* activa el scroll horizontal
     */
    mostrar_scroll_x?: boolean;
    /**
     * Cuando recibe el valor *true* activa el scroll vertical
     */
    mostrar_scroll_y?: boolean;
    /**
     * Ancho que tendrá la barra del scroll horizontal y vertical.
     */
    prop_stroke_width?: number;
    /**
     * Color que tendrá la barra del scroll horizontal y vertical.
     */
    prop_stroke?: string;
    /**
     * Funcionan como callbacks.
     */
    event_scroll?: iEventoScroll;

    prop_background_color?: string;
    prop_no_ocultar?: boolean;
  }

  interface iProperties {
    /**
     * Timer para que despues de un tiempo sin actividad ocultar el scroll.
     */
    prop_timer_ocultar_scroll?: number;
    /**
     * Auxiliar, para cuando el evento mouse enter este activo el  timer para ocultar el scroll no se inicialice.
     */
    prop_evento_mouse_enter_activo?: boolean;
    /**
     * Parametro usado para identificar si el scroll esta activo y así controlar la transición.
     */
    prop_scroll_esta_visible?: boolean;
    /**
     * Auxiliar, si el scroll horizontal esta activo se valida que el
     * ancho del contenido sea mayor al permitido para mostrar el scroll.
     *
     */
    prop_aux_scroll_x?: boolean;
    /**
     * Auxiliar, si el scroll vertical esta activo se valida que el
     * alto del contenido sea mayor al permitido para mostrar el scroll.
     *  *
     */
    prop_aux_scroll_y?: boolean;
    /**
     * Auxiliar del alto recibido en el config. Para que cuando el alto cambie escalar la posición del scroll.
     */
    prop_height?: number;
    /**
     * Auxiliar del ancho recibido en el config. Para que cuando el ancho cambie escalar la posición del scroll.
     */
    prop_width?: number;
    /**
     * Auxiliar
     * * si no se recibe valor o es menor a @param *prop_height* se le asigna el valor de @param *prop_height*.
     */
    prop_height_total?: number;
    /**
     * Ancho total del grupo al que se le aplicara scroll.
     * Si @param *prop_aux_scroll_x* esta en *true* se inicializa con el valor del ancho total del grupo
     * si no entonces con el @param *prop_width*.
     */
    prop_width_total?: number;
    /**
     *
     */
    prop_drag?: d3.DragBehavior<Element, {}, {} | d3.SubjectPosition>;
    /**
     * Configuración del usuario al control.
     */
    prop_config?: iConfig;
    /**
     * Contenedor del scroll.
     */
    el_contenedor_scroll?: d3.Selection<SVGGElement, {}, null, undefined>;
    /**
     * Elemento que se recibe al inicializar el scroll. Grupo al que se aplicará el evento scroll.
     */
    el_contenido_?: d3.Selection<SVGGElement, {}, null, undefined>;
    //
    prop_es_dispositivo_movil?: boolean;
    prop_scroll_x?: iScroll;
    prop_scroll_y?: iScroll;
    /**
     * Indice de creación que ocupa el scroll usando el contador @global prop_index_control_scroll
     */
    prop_index_control?: number;
  }

  interface iScroll {
    /**
     * * Si es Scroll Horizontal:
     *  * Ancho de la barra.
     * * Si es Scroll Vertical:
     *  * Alto de la barra.
     */
    prop_extent_value?: number;
    /**
     *
     */
    prop_scale_linear?: d3.ScaleLinear<number, number>;
    /**
     *
     */
    el_barra?: d3.Selection<SVGRectElement, {}, null, undefined>;

    prop_posicion?: iCoordenada;
  }

  interface iCoordenada {
    x: number;
    y: number;
    index: number;
  }

  enum tipo_scroll {
    x = 1,
    y = 2,
    contenido = 0
  }

  /**
   *
   * @param svg_g_element
   * @param config
   */
  export function fun_main(
    svg_g_element: SVGGElement,
    config: iConfig
  ): iObjetoControl {
    var propiedades: iProperties = {};
    propiedades.prop_es_dispositivo_movil = D3Utils.fun_es_dispositivo_movil();
    propiedades.prop_config = config;
    propiedades.el_contenido_ = d3.select(svg_g_element);
    propiedades.el_contenedor_scroll = d3
      .select(document.createElementNS("http://www.w3.org/2000/svg", "g"))
      .classed("control-scroll", true)
      .property("propiedades", propiedades)
      .on("wheel", function() {
        fun_on_wheel(propiedades);
      })
      .on("mouseenter", function() {
        if (propiedades.prop_es_dispositivo_movil) return;
        propiedades.prop_evento_mouse_enter_activo = true;
        fun_mostrar_scroll(propiedades, true);
      })
      .on("mouseleave", function() {
        propiedades.prop_evento_mouse_enter_activo = false;
        fun_mostrar_scroll(propiedades, false);
      });

    propiedades.el_contenido_.style("pointer-events", "all");

    var obj_control: iObjetoControl = {
      element: propiedades.el_contenedor_scroll.node(),
      config: propiedades.prop_config,
      fun_actualizar: fun_actualizar,
      fun_set_scrollTop: (posicion: number) => {
        fun_set_scroll_top(propiedades, posicion);
      },
      fun_get_scrollTop: () => fun_get_scroll_top(propiedades),
      fun_set_scrollLeft: (posicion: number) => {
        fun_set_scroll_left(propiedades, posicion);
      },
      fun_get_scrollLeft: () => fun_get_scroll_left(propiedades)
    };

    obj_control.fun_actualizar();
    return obj_control;
  }

  function fun_init_properties(propiedades: iProperties): void {
    // Validar que las medidas no tenga el valor UNDEFINED, en caso de que tenga ese valor cambiar inicializar con valor cero(0).
    if (propiedades.prop_config.prop_width === undefined)
      propiedades.prop_config.prop_width = 0;
    if (propiedades.prop_config.prop_height === undefined)
      propiedades.prop_config.prop_height = 0;
    if (propiedades.prop_config.prop_height_total === undefined)
      propiedades.prop_config.prop_height_total = 0;

    propiedades.prop_width = propiedades.prop_config.prop_width;
    propiedades.prop_height = propiedades.prop_config.prop_height;

    var width_total = propiedades.prop_config.prop_width;
    // Si el scroll horizontal esta activo y prop_width_total es undefined entonces se obtiene el ancho total del contenido
    if (propiedades.prop_config.mostrar_scroll_x) {
      if (propiedades.prop_config.prop_width_total)
        width_total = propiedades.prop_config.prop_width_total;
      else width_total = propiedades.el_contenido_.node().getBBox().width;
    }
    // if (propiedades.prop_config.mostrar_scroll_x) width_total = propiedades.el_contenido_.node().getBBox().width;
    //
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
    //
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

    // Inicializa valores para el scroll X.
    if (propiedades.prop_config.mostrar_scroll_x) {
      if (!propiedades.prop_scroll_x) propiedades.prop_scroll_x = {};
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

    // Inicializa valores para el scroll Y.
    if (propiedades.prop_config.mostrar_scroll_y) {
      if (!propiedades.prop_scroll_y) propiedades.prop_scroll_y = {};
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
        .on("start", function(d: any) {
          fun_on_drag_start(propiedades, this);
        })
        .on("drag", function(d: any) {
          fun_on_drag(propiedades, this);
        })
        .on("end", function(d: any) {
          fun_on_drag_end(propiedades, this);
        });
    }

    // Inicializa el indice del control. Para distinguir clipath usado.
    if (propiedades.prop_index_control === undefined)
      propiedades.prop_index_control = prop_index_control_scroll += 1;
  }

  function fun_control_scroll(propiedades: iProperties): void {
    fun_init_properties(propiedades);
    fun_clipPath(propiedades);
    fun_agregar_contenido(propiedades);

    fun_dibuja_scroll(propiedades);
    fun_mostrar_scroll(propiedades, false);
  }

  function fun_clipPath(propiedades: iProperties): void {
    var el_clip_scroll_rect = propiedades.el_contenedor_scroll.select(
      ".clip-scroll-rect"
    );
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

  function fun_dibuja_scroll(propiedades: iProperties): void {
    var g_scroll = propiedades.el_contenedor_scroll.select(
      ".g-scroll-contenido"
    );

    if (g_scroll.size() === 0) {
      g_scroll = propiedades.el_contenedor_scroll
        .append("g")
        .attr("class", "g-scroll-contenido");

      // Se verifica si se activo el scroll horizontal para crear la barra.
      if (propiedades.prop_config.mostrar_scroll_x) {
        g_scroll
          .append("rect")
          .attr("y", 0)
          .classed("scroll-x", true)
          .classed("scroll-extent", true)
          .call(propiedades.prop_drag)
          .property("element_event", tipo_scroll.x);
      }

      // Se verifica si se activo el scroll vertical para crear la barra
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

    // Si se cumple la condicion asigna tamaño al scroll X
    if (propiedades.prop_config.mostrar_scroll_x) {
      // Obtener el tamaño del rect Extent
      propiedades.prop_scroll_x.prop_extent_value = propiedades.prop_scroll_x.prop_scale_linear(
        propiedades.prop_width
      );
      // Posicionar el scroll horizontal en la parte inferior del contenido.
      propiedades.prop_scroll_x.prop_posicion.y =
        propiedades.prop_height - propiedades.prop_config.prop_stroke_width;
      // Barra del scroll.
      propiedades.prop_scroll_x.el_barra = <any>g_scroll
        .select(".scroll-x")
        .style("opacity", propiedades.prop_aux_scroll_x ? 1 : 0)
        .attr("y", propiedades.prop_scroll_x.prop_posicion.y)
        .attr("width", propiedades.prop_scroll_x.prop_extent_value)
        .attr("height", propiedades.prop_config.prop_stroke_width)
        .attr("fill", propiedades.prop_config.prop_stroke);
    }

    // Si se cumple la condicion asigna tamaño al scroll Y
    if (propiedades.prop_config.mostrar_scroll_y) {
      // Obtener el tamaño del rect Extent
      propiedades.prop_scroll_y.prop_extent_value = propiedades.prop_scroll_y.prop_scale_linear(
        propiedades.prop_height
      );
      // Posicionar el scroll vertical en la parte derecha del contenido.
      propiedades.prop_scroll_y.prop_posicion.x =
        propiedades.prop_width - propiedades.prop_config.prop_stroke_width;
      // Barra del scroll.
      propiedades.prop_scroll_y.el_barra = <any>g_scroll
        .select(".scroll-y")
        .style("opacity", propiedades.prop_aux_scroll_y ? 1 : 0)
        .attr("x", propiedades.prop_scroll_y.prop_posicion.x)
        .attr("height", propiedades.prop_scroll_y.prop_extent_value)
        .attr("width", propiedades.prop_config.prop_stroke_width)
        .attr("fill", propiedades.prop_config.prop_stroke);
    }
  }

  function fun_agregar_contenido(propiedades: iProperties): void {
    var el_g_contenido_clip = propiedades.el_contenedor_scroll.select(
      ".g-contenido-clip"
    );
    if (el_g_contenido_clip.size() === 0) {
      // Se agrega elemento rect que será el fondo del control.
      propiedades.el_contenedor_scroll
        .append("rect")
        .classed("scroll-background", true)
        .attr(
          "fill",
          propiedades.prop_config.prop_background_color || "#262626"
        );

      // Se crea un SVGGElement que tendra el clipPath.
      el_g_contenido_clip = propiedades.el_contenedor_scroll
        .append("g")
        .attr("class", "g-contenido-clip")
        .call(propiedades.prop_drag)
        .property("element_event", tipo_scroll.contenido)
        .style(
          "clip-path",
          "url(#clip_scroll_" + propiedades.prop_index_control + ")"
        );
      // .style("touch-action", null);//new................;

      // Se agrega elemento rect que será el fondo del contenido.
      el_g_contenido_clip
        .append("rect")
        .classed("contenido-background", true)
        .attr(
          "fill",
          propiedades.prop_config.prop_background_color || "#262626"
        );

      // Se agrega el elemento SVGGElement al grupo que tiene el clipPath.
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

  /**
   *
   * @param propiedades
   * @param _tipo_scroll - Elemento que esta ejecutando el arrastre.
   * @param dx
   * @param dy
   * @param invert - Hacer que el scroll vaya al lugar contrario del arrastre.
   * @param transicion
   */
  function fun_asignar_top_scroll(
    propiedades: iProperties,
    _tipo_scroll: tipo_scroll,
    dx: number,
    dy: number,
    invert: boolean,
    transicion: boolean = false
  ): void {
    fun_translate_scroll_x(propiedades, dx, _tipo_scroll, invert, transicion);
    fun_translate_scroll_y(propiedades, dy, _tipo_scroll, invert, transicion);
    fun_translate_contenido(propiedades, dx, dy, transicion);
  }

  function fun_escalar_posicion_scroll(propiedades: iProperties): void {
    if (
      !propiedades.prop_height ||
      !propiedades.prop_width ||
      !propiedades.prop_config.prop_height ||
      !propiedades.prop_config.prop_width
    )
      return;
    // Escalar la posicion que tiene el scroll vertical con las nuevas medidas.
    if (propiedades.prop_scroll_y) {
      // Obtener la posicion original del contenido
      var posicion_contenido = propiedades.prop_scroll_y.prop_scale_linear.invert(
        propiedades.prop_scroll_y.prop_posicion.y
      );
      // Escalar la posicion del eje vertical por el nuevo alto total y el alto permitido.
      propiedades.prop_scroll_y.prop_posicion.y =
        (posicion_contenido /
          (propiedades.prop_config.prop_height_total || 1)) *
        propiedades.prop_config.prop_height;
    }
    // Escalar la posicion que tiene el scroll horizontal con las nuevas medidas.
    if (propiedades.prop_scroll_x) {
      propiedades.prop_scroll_x.prop_posicion.x =
        (propiedades.prop_scroll_x.prop_posicion.x / propiedades.prop_width) *
        propiedades.prop_config.prop_width;
    }
  }

  function fun_translate_scroll_x(
    propiedades: iProperties,
    pos_x: number,
    tipo_evento: number,
    invert: boolean,
    transition: boolean = false
  ): void {
    // Si esta activado el scroll se calcula la posicion X y traslada el contenido.
    if (
      propiedades.prop_config.mostrar_scroll_x &&
      (tipo_evento === tipo_scroll.contenido || tipo_evento === tipo_scroll.x)
    ) {
      pos_x *= !invert ? -1 : 1;
      if (!invert) pos_x = propiedades.prop_scroll_x.prop_scale_linear(pos_x);
      var min_value = Math.min(
        propiedades.prop_width - propiedades.prop_scroll_x.prop_extent_value,
        propiedades.prop_scroll_x.prop_posicion.x + pos_x
      );
      propiedades.prop_scroll_x.prop_posicion.x = Math.max(0, min_value);
      if (!transition)
        propiedades.prop_scroll_x.el_barra.attr(
          "x",
          propiedades.prop_scroll_x.prop_posicion.x
        );
      else
        propiedades.prop_scroll_x.el_barra./* transition().duration(200).ease(d3.easeLinear). */ attr(
          "x",
          propiedades.prop_scroll_x.prop_posicion.x
        );
    }
  }

  function fun_translate_scroll_y(
    propiedades: iProperties,
    pos_y: number,
    tipo_evento: number,
    invert: boolean,
    transition: boolean = false
  ): void {
    // Si esta activado el scroll se calcula la posicion Y y traslada el contenido.
    if (
      propiedades.prop_config.mostrar_scroll_y &&
      (tipo_evento === 0 || tipo_evento === tipo_scroll.y)
    ) {
      pos_y *= !invert ? -1 : 1;
      if (!invert) pos_y = propiedades.prop_scroll_y.prop_scale_linear(pos_y);
      var min_value = Math.min(
        propiedades.prop_height - propiedades.prop_scroll_y.prop_extent_value,
        propiedades.prop_scroll_y.prop_posicion.y + pos_y
      );

      propiedades.prop_scroll_y.prop_posicion.y = Math.max(0, min_value);

      if (!transition)
        propiedades.prop_scroll_y.el_barra.attr(
          "y",
          propiedades.prop_scroll_y.prop_posicion.y
        );
      else
        propiedades.prop_scroll_y.el_barra./* transition().duration(200).ease(d3.easeLinear). */ attr(
          "y",
          propiedades.prop_scroll_y.prop_posicion.y
        );
    }
  }

  function fun_translate_contenido(
    propiedades: iProperties,
    t_x: number,
    t_y: number,
    transition: boolean = false
  ): void {
    fun_mostrar_scroll(propiedades, true);
    fun_timer_ocultar_scroll(propiedades);
    var posicion_contendido: iCoordenada = {
      x: 0,
      y: 0,
      index: tipo_scroll.contenido
    };
    if (propiedades.prop_config.mostrar_scroll_x && t_x !== null) {
      t_x = propiedades.prop_scroll_x.prop_scale_linear.invert(
        propiedades.prop_scroll_x.prop_posicion.x
      );
      posicion_contendido.x = Math.max(
        propiedades.prop_width - propiedades.prop_width_total,
        Math.min(0, -t_x)
      );
    }

    if (propiedades.prop_config.mostrar_scroll_y && t_y !== null) {
      t_y = propiedades.prop_scroll_y.prop_scale_linear.invert(
        propiedades.prop_scroll_y.prop_posicion.y
      );
      posicion_contendido.y = Math.max(
        propiedades.prop_height - propiedades.prop_height_total,
        Math.min(0, -t_y)
      );
    }

    if (!transition)
      propiedades.el_contenido_.attr(
        "transform",
        "translate(" +
          posicion_contendido.x +
          ", " +
          posicion_contendido.y +
          ")"
      );
    else
      propiedades.el_contenido_./* transition().duration(200).ease(d3.easeLinear). */ attr(
        "transform",
        "translate(" +
          posicion_contendido.x +
          ", " +
          posicion_contendido.y +
          ")"
      );

    // Ejecutar callBack del evento scroll.
    if (
      propiedades.prop_config.event_scroll &&
      propiedades.prop_config.event_scroll.scroll
    )
      propiedades.prop_config.event_scroll.scroll();
  }

  function fun_timer_ocultar_scroll(propiedades: iProperties): void {
    if (!propiedades.prop_evento_mouse_enter_activo) {
      if (propiedades.prop_timer_ocultar_scroll != undefined)
        clearTimeout(propiedades.prop_timer_ocultar_scroll);
      propiedades.prop_timer_ocultar_scroll = setTimeout(() => {
        fun_mostrar_scroll(propiedades, false);
        propiedades.prop_timer_ocultar_scroll = undefined;
      }, 1500);
    }
  }

  function fun_mostrar_scroll(propiedades: iProperties, toggle: boolean): void {
    if (
      propiedades.prop_scroll_esta_visible === toggle ||
      propiedades.prop_config.prop_no_ocultar
    )
      return;

    propiedades.prop_scroll_esta_visible = toggle;
    propiedades.el_contenedor_scroll
      .select(".g-scroll-contenido")
      .attr("pointer-events", toggle ? "all" : "none")
      .interrupt()
      .transition()
      .duration(100)
      .style("opacity", toggle ? 0.6 : 0);
    /*.on("end", () => { propiedades.transicion_scroll_activo = false; })*/
  }

  // -----------------------------------------------------------------------------------
  // FUNCIONES - OBJETO CONTROL
  // -----------------------------------------------------------------------------------
  function fun_actualizar(): void {
    var obj_control = <iObjetoControl>this;
    var propiedades = <iProperties>(
      d3.select(obj_control.element).property("propiedades")
    );
    fun_escalar_posicion_scroll(propiedades);
    fun_control_scroll(propiedades);
    fun_asignar_top_scroll(propiedades, tipo_scroll.contenido, 0, 0, false);
  }

  function fun_set_scroll_top(
    propiedades: iProperties,
    posicion: number
  ): void {
    var posicion_contenido = propiedades.prop_scroll_y.prop_scale_linear.invert(
      propiedades.prop_scroll_y.prop_posicion.y
    );
    fun_asignar_top_scroll(
      propiedades,
      tipo_scroll.contenido,
      0,
      -posicion + posicion_contenido,
      false
    );
  }

  function fun_get_scroll_top(propiedades: iProperties): number {
    return propiedades.prop_scroll_y.prop_scale_linear.invert(
      propiedades.prop_scroll_y.prop_posicion.y
    );
  }

  function fun_set_scroll_left(
    propiedades: iProperties,
    posicion: number
  ): void {
    var posicion_contenido = propiedades.prop_scroll_x.prop_scale_linear.invert(
      propiedades.prop_scroll_x.prop_posicion.x
    );
    fun_asignar_top_scroll(
      propiedades,
      tipo_scroll.contenido,
      -posicion + posicion_contenido,
      0,
      false
    );
  }

  function fun_get_scroll_left(propiedades: iProperties): number {
    return propiedades.prop_scroll_x.prop_scale_linear.invert(
      propiedades.prop_scroll_x.prop_posicion.x
    );
  }

  // -----------------------------------------------------------------------------------
  // FUNCIONES - EVENTOS
  // -----------------------------------------------------------------------------------
  function fun_on_drag_start(
    propiedades: iProperties,
    elemento: Element
  ): void {
    // console.log("fun_on_drag_start..............");
    d3.select(elemento).style("touch-action", null);

    // d3.event.sourceEvent.stopPropagation();

    if (propiedades.prop_config.event_scroll.scroll_start)
      propiedades.prop_config.event_scroll.scroll_start();
  }

  function fun_on_drag(propiedades: iProperties, elemento: Element): void {
    // console.log("fun_on_drag..............");
    var pos_x = 0;
    var pos_y = 0;

    var _tipo_scroll = d3.select(elemento).property("element_event");
    var invert_scroll_contenido = false;
    if (_tipo_scroll === tipo_scroll.x) {
      invert_scroll_contenido = true;
      pos_x = d3.event.dx;
    } else if (_tipo_scroll === tipo_scroll.y) {
      pos_y = d3.event.dy;
      invert_scroll_contenido = true;
    } else if (_tipo_scroll === tipo_scroll.contenido) {
      pos_x = d3.event.dx;
      pos_y = d3.event.dy;
    }

    fun_asignar_top_scroll(
      propiedades,
      _tipo_scroll,
      pos_x,
      pos_y,
      invert_scroll_contenido
    );
    d3.event.sourceEvent.preventDefault();
  }

  function fun_on_drag_end(propiedades: iProperties, elemento: Element): void {
    // console.log("fun_on_drag_end..............");

    d3.select(elemento).style("touch-action", "none");
    if (propiedades.prop_config.event_scroll.scroll_end)
      propiedades.prop_config.event_scroll.scroll_end();
  }

  //
  function fun_on_wheel(propiedades: iProperties): void {
    var wheel_event = <any>d3.event;
    var value = wheel_event.wheelDelta | -wheel_event.deltaY;

    var pos_y =
      propiedades.prop_scroll_y.prop_scale_linear(propiedades.prop_height / 4) *
      (value > 0 ? -1 : 1);
    fun_asignar_top_scroll(propiedades, tipo_scroll.y, 0, pos_y, true, true);

    d3.event.preventDefault();
  }
}
// }
