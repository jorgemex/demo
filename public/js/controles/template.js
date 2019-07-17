"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
var Template;
(function (Template) {
    function fun_main(config) {
        let properties = {};
        properties.prop_config = config;
        fun_init_properties(properties);
        if (config.prop_height_header > 0 || config.prop_height_footer > 0)
            fun_init_contents_header_footer(properties);
        else
            fun_init_contents(properties);
        if (!properties.prop_config.prop_orientation)
            fun_on_resize(properties, true);
        else
            fun_size_orientation_static(properties);
        let obj_control = {
            prop_element: properties.el_div_content.node(),
            fun_get_orientation: () => properties.prop_orientation,
            fun_get_scale: () => properties.prop_scale_aux,
            fun_get_width: () => properties.prop_width_aux,
            fun_get_height_header: () => properties.prop_config.prop_height_header,
            fun_get_height_content: () => properties.prop_height_content,
            fun_get_height_footer: () => properties.prop_config.prop_height_footer,
            fun_get_g_header: () => properties.el_svg_header.select(".header-g-aux"),
            fun_get_g_content: () => properties.el_svg_content.select(".content-g-aux"),
            fun_get_g_footer: () => properties.el_svg_footer.select(".footer-g-aux"),
            prop_config: properties.prop_config
        };
        properties.el_div_content.property("control", obj_control);
        return obj_control;
    }
    Template.fun_main = fun_main;
    function fun_on_change_container_size(containerControl) {
        let properties = {};
        properties.prop_config = containerControl.prop_config;
        fun_init_properties(properties);
        properties.el_div_content = d3.select(containerControl.prop_element);
        properties.el_svg_content = d3.select(containerControl.fun_get_g_content().node().ownerSVGElement);
        properties.el_svg_header = d3.select(containerControl.fun_get_g_header().node().ownerSVGElement);
        properties.el_svg_footer = d3.select(containerControl.fun_get_g_footer().node().ownerSVGElement);
        properties.prop_scale_aux = containerControl.fun_get_scale();
        if (!properties.prop_config.prop_orientation)
            fun_on_resize(properties, true);
        else
            fun_size_orientation_static(properties);
    }
    Template.fun_on_change_container_size = fun_on_change_container_size;
    function fun_init_properties(properties) {
        if (properties.prop_aux_viewport_max === undefined)
            properties.prop_aux_viewport_max = 400;
        if (!d3.select(window).on("resize.AppTemplate") &&
            !properties.prop_config.prop_orientation)
            d3.select(window).on("resize.AppTemplate", () => fun_on_resize(properties));
        if (properties.prop_config.prop_events === undefined)
            properties.prop_config.prop_events = {};
    }
    function fn_create_svg_parent_top(element) {
        let svg_top_parent = element
            .append("svg")
            .classed("svg-top-parent", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("z-index", 999)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#fff")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 400 100");
        let filter = svg_top_parent.append("defs").append("filter");
        filter
            .attr("id", "shadowed")
            .attr("width", 1.5)
            .attr("height", 1.5)
            .attr("x", -0.25)
            .attr("y", -0.25);
        filter
            .append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 2.5)
            .attr("result", "blur");
        filter
            .append("feColorMatrix")
            .attr("result", "bluralpha")
            .attr("type", "matrix")
            .attr("values", "1 0 0 0   0 0 1 0 0   0 0 0 1 0   0 0 0 0 0.4 0 ");
        filter
            .append("feOffset")
            .attr("in", "bluralpha")
            .attr("dx", 3)
            .attr("dy", 3)
            .attr("result", "offsetBlur");
        let merge = filter.append("feMerge");
        merge.append("feMergeNode").attr("in", "offsetBlur");
        merge.append("feMergeNode").attr("in", "SourceGraphic");
        return svg_top_parent;
    }
    Template.fn_create_svg_parent_top = fn_create_svg_parent_top;
    function fun_init_contents(properties) {
        properties.el_div_content = properties.prop_config.el_content
            .append("div")
            .classed("app-plantilla", true)
            .style("width", "100%")
            .style("height", "100%")
            .style("overflow", "hidden");
        properties.el_svg_content = properties.el_div_content
            .append("svg")
            .classed("plantilla-svg-content", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#fff")
            .attr("preserveAspectRatio", "xMinYMin meet");
        properties.el_svg_header = properties.el_div_content
            .append("svg")
            .classed("plantilla-svg-header", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("preserveAspectRatio", "xMinYMin meet");
        properties.el_svg_footer = properties.el_div_content
            .append("svg")
            .classed("plantilla-svg-footer", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("preserveAspectRatio", "xMinYMax meet");
        let header_g_aux = properties.el_svg_header
            .append("g")
            .classed("header-g-aux", true)
            .style("pointer-events", "all");
        header_g_aux
            .append("rect")
            .classed("header-rect-background", true)
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_header)
            .attr("fill", "transparent");
        let footer_g_aux = properties.el_svg_footer
            .append("g")
            .classed("footer-g-aux", true)
            .style("pointer-events", "all");
        footer_g_aux
            .append("rect")
            .classed("footer-rect-background", true)
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_footer)
            .attr("fill", "transparent");
        let content_g_aux = properties.el_svg_content
            .append("g")
            .classed("content-g-aux", true)
            .style("pointer-events", "all")
            .attr("transform", "translate(0, " + properties.prop_config.prop_height_header + ")");
        content_g_aux
            .append("rect")
            .classed("content-rect-background", true)
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_footer)
            .attr("fill", "transparent");
    }
    function fun_init_contents_header_footer(properties) {
        properties.el_div_content = properties.prop_config.el_content
            .append("div")
            .classed("app-plantilla", true)
            .style("width", "100%")
            .style("height", "100%")
            .style("overflow", "hidden");
        properties.el_div_content
            .append("svg")
            .classed("plantilla-svg-parent", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("z-index", "999")
            .attr("preserveAspectRatio", "xMinYMin meet");
        var header = properties.el_div_content
            .append("div")
            .classed("header", true)
            .style("position", "relative")
            .attr("id", "app-header");
        var container = properties.el_div_content
            .append("div")
            .style("position", "relative")
            .classed("container", true);
        var footer = properties.el_div_content
            .append("div")
            .classed("footer", true)
            .style("position", "relative")
            .attr("id", "app-footer");
        properties.el_svg_header = header
            .append("svg")
            .classed("plantilla-svg-header", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("preserveAspectRatio", "xMinYMin meet");
        properties.el_svg_content = container
            .append("svg")
            .classed("plantilla-svg-content", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#fff")
            .style("z-index", "99")
            .attr("preserveAspectRatio", "xMinYMin meet");
        properties.el_svg_footer = footer
            .append("svg")
            .classed("plantilla-svg-footer", true)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("preserveAspectRatio", "xMinYMax meet");
        let header_g_aux = properties.el_svg_header
            .append("g")
            .classed("header-g-aux", true)
            .style("pointer-events", "all");
        header_g_aux
            .append("rect")
            .classed("header-rect-background", true)
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_header)
            .attr("fill", "transparent");
        let footer_g_aux = properties.el_svg_footer
            .append("g")
            .classed("footer-g-aux", true)
            .style("pointer-events", "all");
        footer_g_aux
            .append("rect")
            .classed("footer-rect-background", true)
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_footer)
            .attr("fill", "transparent");
        let content_g_aux = properties.el_svg_content
            .append("g")
            .classed("content-g-aux", true)
            .style("pointer-events", "all")
            .attr("transform", "translate(0, 0)");
        content_g_aux
            .append("rect")
            .classed("content-rect-background", true)
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_footer)
            .attr("fill", "transparent");
    }
    function fun_size_orientation_static(properties) {
        let client_rect = properties.prop_config.el_content
            .node()
            .getBoundingClientRect();
        properties.prop_orientation = properties.prop_config.prop_orientation;
        properties.prop_width_aux = properties.prop_aux_viewport_max;
        properties.prop_scale_aux = properties.prop_width_aux / client_rect.width;
        properties.prop_height_aux = client_rect.height * properties.prop_scale_aux;
        properties.prop_height_content =
            properties.prop_height_aux -
                properties.prop_config.prop_height_header -
                properties.prop_config.prop_height_footer;
        properties.el_svg_content.attr("viewBox", "0 0 400 100");
        properties.el_svg_header.attr("viewBox", "0 0 400 " + properties.prop_config.prop_height_header);
        properties.el_svg_footer.attr("viewBox", "0 0 400 " + properties.prop_config.prop_height_footer);
        properties.el_div_content
            .select(".plantilla-svg-parent")
            .attr("viewBox", "0 0 400 100");
        properties.el_div_content
            .select(".header")
            .style("height", properties.prop_config.prop_height_header / properties.prop_scale_aux +
            "px");
        properties.el_div_content
            .select(".container")
            .style("height", properties.prop_height_content / properties.prop_scale_aux + "px");
        properties.el_div_content
            .select(".footer")
            .style("height", properties.prop_config.prop_height_footer / properties.prop_scale_aux +
            "px");
    }
    function fun_on_resize(properties, no_callback = false) {
        if (properties.el_div_content.node().offsetParent === null)
            return;
        let client_rect = properties.prop_config.el_content
            .node()
            .getBoundingClientRect();
        let orientation_aux = properties.prop_orientation;
        if (client_rect.height > client_rect.width) {
            properties.prop_orientation = "portrait";
            properties.prop_height_aux = properties.prop_aux_viewport_max;
            properties.prop_scale_aux =
                properties.prop_height_aux / client_rect.height;
            properties.prop_width_aux = client_rect.width * properties.prop_scale_aux;
            properties.el_svg_content.attr("viewBox", "0 0 100 400");
            properties.el_svg_header.attr("viewBox", "0 0 100 " + properties.prop_config.prop_height_header);
            properties.el_svg_footer.attr("viewBox", "0 0 100 " + properties.prop_config.prop_height_footer);
        }
        else {
            properties.prop_orientation = "landscape";
            properties.prop_width_aux = properties.prop_aux_viewport_max;
            properties.prop_scale_aux = properties.prop_width_aux / client_rect.width;
            properties.prop_height_aux =
                client_rect.height * properties.prop_scale_aux;
            properties.el_svg_content.attr("viewBox", "0 0 400 100");
            properties.el_svg_header.attr("viewBox", "0 0 400 " + properties.prop_config.prop_height_header);
            properties.el_svg_footer.attr("viewBox", "0 0 400 " + properties.prop_config.prop_height_footer);
        }
        properties.prop_height_content =
            properties.prop_height_aux -
                properties.prop_config.prop_height_header -
                properties.prop_config.prop_height_footer;
        properties.el_svg_header
            .select(".header-rect-background")
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_header);
        properties.el_svg_footer
            .select(".footer-rect-background")
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_config.prop_height_footer);
        properties.el_svg_content
            .select(".content-rect-background")
            .attr("width", properties.prop_width_aux)
            .attr("height", properties.prop_height_content);
        properties.el_div_content
            .select(".header")
            .style("height", properties.prop_config.prop_height_header / properties.prop_scale_aux +
            "px");
        properties.el_div_content
            .select(".container")
            .style("height", properties.prop_height_content / properties.prop_scale_aux + "px");
        properties.el_div_content
            .select(".footer")
            .style("height", properties.prop_config.prop_height_footer / properties.prop_scale_aux +
            "px");
        if (!no_callback && properties.prop_config.prop_events.fun_on_resize)
            properties.prop_config.prop_events.fun_on_resize();
        if (!no_callback && properties.prop_config.prop_events.fun_on_resize_end) {
            clearTimeout(properties.prop_time_out_resize);
            properties.prop_time_out_resize = setTimeout(() => {
                properties.prop_config.prop_events.fun_on_resize_end();
                properties.prop_time_out_resize = null;
            }, 500);
        }
        if (!no_callback &&
            orientation_aux !== properties.prop_orientation &&
            properties.prop_config.prop_events.fun_on_orientation_change)
            properties.prop_config.prop_events.fun_on_orientation_change();
    }
})(Template = exports.Template || (exports.Template = {}));
