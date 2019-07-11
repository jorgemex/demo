"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./DB");
const Utils_1 = require("../general/Utils");
const MainPage_1 = require("../MainPage");
const Usuario_1 = require("./Usuario");
const Request_1 = require("./Request");
const AsignacionRuta_1 = require("./AsignacionRuta");
var RutaPuntos;
(function (RutaPuntos) {
    RutaPuntos.StoreName = "RutaPuntos";
    RutaPuntos.Key = "IdPunto";
    RutaPuntos.ColumnName = [
        "IdPunto",
        "Orden",
        "IdSitio",
        "NombreSitio",
        "Latitud",
        "Longitud",
        "Radio",
        "TipoArea",
        "Poligono",
        "Modificacion",
        "EnUso",
        "FechaSalida",
        "FechaLlegada"
    ];
    function fn_obtener_ruta_puntos(idRuta) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.getMaxValue(RutaPuntos.StoreName, "Modificacion", 'prev', null).then(function (result) {
                let maxDate = null;
                if (result.Modificacion)
                    maxDate = Utils_1.D3Utils.met_toMSJSON(new Date(result.Modificacion));
                let params = {
                    IdUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                    Token: Usuario_1.Usuario.UserLogged.Token,
                    IdRuta: idRuta,
                    IdEmpresa: Usuario_1.Usuario.UserLogged.IdEmpresa,
                    Modificacion: maxDate
                };
                return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCAsignaciones + "ObtenerRutaPuntos", 'POST', params);
            }).then(function (result) {
                if (result.ObtenerRutaPuntosResult && result.ObtenerRutaPuntosResult.length > 0) {
                    return AsignacionRuta_1.AsignacionRuta.fn_obtener_asignacion_cumplimiento(AsignacionRuta_1.AsignacionRuta.RutaAsignada.IdAsignacion).then((resCumplimiento) => {
                        var cumplimiento = resCumplimiento.ObtenerAsignacionCumplimientoResult || [];
                        result.ObtenerRutaPuntosResult.forEach((item) => {
                            item.FechaLlegada = null;
                            item.FechaSalida = null;
                            let objCump = cumplimiento.find(o => o.IdPuntoRuta == item.IdPunto);
                            if (objCump) {
                                item.FechaLlegada = objCump.Llegada;
                                item.FechaSalida = objCump.Salida;
                            }
                        });
                        DB_1.DB.setRows(RutaPuntos.StoreName, result.ObtenerRutaPuntosResult);
                        return result;
                    });
                }
                else
                    return result;
            });
        });
    }
    RutaPuntos.fn_obtener_ruta_puntos = fn_obtener_ruta_puntos;
    function fn_get_ruta_data() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.getRows(RutaPuntos.StoreName).then(function (result) {
                let _puntos = [];
                RutaPuntos.RutaBase = {};
                if (result.length > 0)
                    RutaPuntos.RutaBase = result[result.length - 1];
                let _orden = 0, _nSuccessBecome = 0;
                result.forEach((item, i) => {
                    if (item.FechaSalida == null)
                        _puntos.push(item);
                    else
                        _orden = item.Orden;
                    if (item.FechaLlegada != null)
                        _nSuccessBecome++;
                });
                if (_nSuccessBecome < 2)
                    _puntos.splice(-1, 1);
                if (_orden > 1 && _puntos.length > 0)
                    _puntos = _puntos.filter(elm => elm.Orden > _orden);
                return _puntos;
            });
        });
    }
    RutaPuntos.fn_get_ruta_data = fn_get_ruta_data;
    function fn_get_address(lat, lng) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = MainPage_1.MainPage.URLPrincipal + "ServicioGoogle/Servicio.svc/ObtenerDireccionLista";
            let params = {
                idUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                Token: Usuario_1.Usuario.UserLogged.Token,
                ListaDePuntos: [{
                        Id: "1",
                        Latitud: lat,
                        Longitud: lng
                    }]
            };
            return Request_1.Request.JSONRequest(url, 'POST', params);
        });
    }
    RutaPuntos.fn_get_address = fn_get_address;
    function fn_set_ruta_punto(rutapunto) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.setRows(RutaPuntos.StoreName, [rutapunto]);
        });
    }
    RutaPuntos.fn_set_ruta_punto = fn_set_ruta_punto;
    function fn_remove_data_store() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.clearObjectStore(RutaPuntos.StoreName);
        });
    }
    RutaPuntos.fn_remove_data_store = fn_remove_data_store;
    function fn_get_punto(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.getRowById(RutaPuntos.StoreName, id);
        });
    }
    RutaPuntos.fn_get_punto = fn_get_punto;
    function fn_get_max_clv(clv) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.getMaxValue(RutaPuntos.StoreName, clv, 'prev', null);
        });
    }
    RutaPuntos.fn_get_max_clv = fn_get_max_clv;
    function fn_get_all_rutas() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.getRows(RutaPuntos.StoreName).then((res) => {
                if (res && res.length > 0)
                    RutaPuntos.RutaBase = res[res.length - 1];
                return res;
            });
        });
    }
    RutaPuntos.fn_get_all_rutas = fn_get_all_rutas;
    function fn_count_clv(clv) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.countRows(RutaPuntos.StoreName, clv);
        });
    }
    RutaPuntos.fn_count_clv = fn_count_clv;
})(RutaPuntos = exports.RutaPuntos || (exports.RutaPuntos = {}));
