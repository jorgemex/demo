"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var General;
(function (General) {
    function latLng2Point(map, latLng) {
        var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
        var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
        var scale = Math.pow(2, map.getZoom());
        var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
        return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    }
    General.latLng2Point = latLng2Point;
})(General = exports.General || (exports.General = {}));
