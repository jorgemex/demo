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
const Usuario_1 = require("./Usuario");
const Request_1 = require("./Request");
const MainPage_1 = require("../MainPage");
var AsignacionRuta;
(function (AsignacionRuta) {
    AsignacionRuta.StoreName = "AsignacionRuta";
    AsignacionRuta.Key = "IdAsignacion";
    AsignacionRuta.ColumnName = [
        "IdAsignacion",
        "IdEmpresa",
        "IdUnidad",
        "IdRuta",
        "HoraInicio",
        "HoraFinal",
        "Estado",
        "FechaAsignacion",
        "NumeroOrden",
        "Salida",
        "Regreso",
        "Modificacion",
        "EnUso"
    ];
    function fn_obtener_asignacionRuta() {
        return __awaiter(this, void 0, void 0, function* () {
            return fn_get_asignacion_ruta().then(res => {
                if (res) {
                    AsignacionRuta.RutaAsignada = res;
                    return res;
                }
                else {
                    let params = {
                        IdUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                        Token: Usuario_1.Usuario.UserLogged.Token,
                        IdEmpresa: Usuario_1.Usuario.UserLogged.IdEmpresa,
                        IdUnidad: Usuario_1.Usuario.UserLogged.IdUnidad
                    };
                    return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCAsignaciones + "ObtenerAsignacionRuta", 'POST', params).then((result) => {
                        if (result.ObtenerAsignacionRutaResult && result.ObtenerAsignacionRutaResult.IdAsignacion > 0 && result.ObtenerAsignacionRutaResult.Regreso == null) {
                            let _rutaAsignada = result.ObtenerAsignacionRutaResult;
                            DB_1.DB.setRows(AsignacionRuta.StoreName, [_rutaAsignada]);
                            AsignacionRuta.RutaAsignada = _rutaAsignada;
                        }
                        return AsignacionRuta.RutaAsignada;
                    });
                }
            });
        });
    }
    AsignacionRuta.fn_obtener_asignacionRuta = fn_obtener_asignacionRuta;
    function fn_marcar_salida(idAsignacion) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                Token: Usuario_1.Usuario.UserLogged.Token,
                IdEmpresa: Usuario_1.Usuario.UserLogged.IdEmpresa,
                IdAsignacion: idAsignacion,
                Proceso: true,
                Modificacion: null
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCAsignaciones + "MarcarSalidaRegreso", 'POST', params);
        });
    }
    AsignacionRuta.fn_marcar_salida = fn_marcar_salida;
    function fn_marcar_regreso(idAsignacion) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                Token: Usuario_1.Usuario.UserLogged.Token,
                IdEmpresa: Usuario_1.Usuario.UserLogged.IdEmpresa,
                IdAsignacion: idAsignacion,
                Proceso: false,
                Modificacion: null
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCAsignaciones + "MarcarSalidaRegreso", 'POST', params);
        });
    }
    AsignacionRuta.fn_marcar_regreso = fn_marcar_regreso;
    function fn_marcar_llegada_salida(idAsignacion, idPuntoRuta, isLlegada) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                Token: Usuario_1.Usuario.UserLogged.Token,
                IdAsignacion: idAsignacion,
                Proceso: isLlegada,
                IdPuntoRuta: idPuntoRuta
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCAsignaciones + "MarcarLlegadaSalida", 'POST', params);
        });
    }
    AsignacionRuta.fn_marcar_llegada_salida = fn_marcar_llegada_salida;
    function fn_obtener_asignacion_cumplimiento(idAsignacion) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                Token: Usuario_1.Usuario.UserLogged.Token,
                IdAsignacion: idAsignacion,
                Modificacion: null
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCAsignaciones + "ObtenerAsignacionCumplimiento", 'POST', params);
        });
    }
    AsignacionRuta.fn_obtener_asignacion_cumplimiento = fn_obtener_asignacion_cumplimiento;
    function fn_count_clv(clv) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.countRows(AsignacionRuta.StoreName, clv);
        });
    }
    AsignacionRuta.fn_count_clv = fn_count_clv;
    function fn_get_asignacion_ruta() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.getRows(AsignacionRuta.StoreName).then((res) => {
                let _rutaAsignada;
                if (res && res.length > 0)
                    _rutaAsignada = res[0];
                return _rutaAsignada;
            });
        });
    }
    AsignacionRuta.fn_get_asignacion_ruta = fn_get_asignacion_ruta;
    function fn_remove_asignacion_ruta() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.clearObjectStore(AsignacionRuta.StoreName).then(res => {
                AsignacionRuta.RutaAsignada = null;
            });
        });
    }
    AsignacionRuta.fn_remove_asignacion_ruta = fn_remove_asignacion_ruta;
    function fn_set_asignacion_ruta(asignacion) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.setRows(AsignacionRuta.StoreName, [asignacion]);
        });
    }
    AsignacionRuta.fn_set_asignacion_ruta = fn_set_asignacion_ruta;
})(AsignacionRuta = exports.AsignacionRuta || (exports.AsignacionRuta = {}));
