import * as d3 from 'd3';
import { D3Utils } from '../general/Utils';

export namespace Button {

    export function button() {
        var dispatch = d3.dispatch('press', 'release');

        var padding = 3,
            radius = 4,
            stdDeviation = 2,
            offsetX = 1,
            offsetY = 2,
            width = 25,
            height = 10;

        let my: any = function (selection: any) {
            selection.each(function (d: any, i: any) {
                var g = d3.select(this)
                    .attr('id', 'd3-button' + i)
                    .attr('transform', 'translate(' + d.x + ',' + d.y + ')');

                var text: any = g.append('text').text(d.label);
                var defs = g.append('defs');
                var bbox = text.node().getBBox();
                var rect = g.insert('rect', 'text')
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", width)
                    .attr("height", height)
                    .attr('rx', radius)
                    .attr('ry', radius)
                    .on('mouseover', activate)
                    .on('mouseout', deactivate)
                    .on('click', toggle)
                    .attr("stroke", "#999faa")
                    .attr("stroke-width", "1")
                    .style("fill", "#eee");

                addShadow.call(g.node(), d, i);
                addGradient.call(g.node(), d, i);
            });
        }

        function addGradient(d: any, i: any) {
            var defs = d3.select(this).select('defs');
            var gradient = defs.append('linearGradient')
                .attr('id', 'gradient' + i)
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');

            gradient.append('stop')
                .attr('id', 'gradient-start')
                .attr('offset', '0%')

            gradient.append('stop')
                .attr('id', 'gradient-stop')
                .attr('offset', '100%')

            d3.select(this).select('rect').attr('fill', 'url(#gradient' + i + ")");
        }

        function addShadow(d: any, i: any) {
            var defs = d3.select(this).select('defs');
            var rect = d3.select(this).select('rect').attr('filter', 'url(#dropShadow' + i + ")");
            var shadow = defs.append('filter')
                .attr('id', 'dropShadow' + i)
                .attr('x', rect.attr('x'))
                .attr('y', rect.attr('y'))
                .attr('width', rect.attr('width') + offsetX)
                .attr('height', rect.attr('height') + offsetY)

            shadow.append('feGaussianBlur')
                .attr('in', 'SourceAlpha')
                .attr('stdDeviation', 2)

            shadow.append('feOffset')
                .attr('dx', offsetX)
                .attr('dy', offsetY);

            var merge = shadow.append('feMerge');

            merge.append('feMergeNode');
            merge.append('feMergeNode').attr('in', 'SourceGraphic');
        }

        function activate() {
            var gradient = d3.select(this.parentNode).select('linearGradient')
            d3.select(this.parentNode).select("rect").classed('active', true)
            if (!gradient.node()) return;
            gradient.select('#gradient-start').classed('active', true)
            gradient.select('#gradient-stop').classed('active', true)
        }

        function deactivate() {
            var gradient = d3.select(this.parentNode).select('linearGradient')
            d3.select(this.parentNode).select("rect").classed('active', false)
            if (!gradient.node()) return;
            gradient.select('#gradient-start').classed('active', false);
            gradient.select('#gradient-stop').classed('active', false);
        }

        function toggle(d: any, i: any) {
            if (d3.select(this).classed('pressed')) {
                release.call(this, d, i);
                deactivate.call(this, d, i);
            } else {
                press.call(this, d, i);
                activate.call(this, d, i);
            }
        }

        function press(d: any, i: any) {
            dispatch.call('press', this, d, i)
            d3.select(this).classed('pressed', true);
            var shadow = d3.select(this.parentNode).select('filter')
            if (!shadow.node()) return;
            shadow.select('feOffset').attr('dx', 0).attr('dy', 0);
            shadow.select('feGaussianBlur').attr('stdDeviation', 0);
        }

        function release(d: any, i: any) {
            dispatch.call('release', this, d, i)
            my.clear.call(this, d, i);
        }

        my.clear = function (d: any, i: any) {
            d3.select(this).classed('pressed', false);
            var shadow = d3.select(this.parentNode).select('filter')
            if (!shadow.node()) return;
            shadow.select('feOffset').attr('dx', offsetX).attr('dy', offsetY);
            shadow.select('feGaussianBlur').attr('stdDeviation', stdDeviation);
        }

        my.on = function () {
            var value = dispatch.on.apply(dispatch, arguments);
            return value === dispatch ? my : value;
        };

        return my;
    }
}