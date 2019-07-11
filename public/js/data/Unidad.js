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
const MainPage_1 = require("../MainPage");
const DB_1 = require("./DB");
const Usuario_1 = require("./Usuario");
const Request_1 = require("./Request");
var Unidad;
(function (Unidad) {
    Unidad.StoreName = "Unidad";
    Unidad.ColumnName = [
        "IdRegistro",
        "IdUsuarioMovil",
        "IdUnidad",
        "FechaInicio",
        "FechaFin",
        "Modificacion"
    ];
    Unidad.Key = "IdRegistro";
    function fn_obtener_unidad_usuario_movil_nana() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario_1.Usuario.UserLogged.IdUsuario,
                Token: Usuario_1.Usuario.UserLogged.Token,
                Modificacion: null
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCUsuariosMovil + "ObtenerUnidadUsuarioMovil", 'POST', params).then(function (result) {
                if (result.ObtenerUnidadUsuarioMovilResult && result.ObtenerUnidadUsuarioMovilResult.length > 0) {
                    DB_1.DB.addRows(Unidad.StoreName, result.ObtenerUnidadUsuarioMovilResult);
                }
                return result;
            });
        });
    }
    Unidad.fn_obtener_unidad_usuario_movil_nana = fn_obtener_unidad_usuario_movil_nana;
    function fn_get_unit() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                if (Unidad.UnitUser != null) {
                    resolve(Unidad.UnitUser);
                    return;
                }
                return DB_1.DB.getRows(Unidad.StoreName);
            });
        });
    }
    Unidad.fn_get_unit = fn_get_unit;
})(Unidad = exports.Unidad || (exports.Unidad = {}));
