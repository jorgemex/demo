import * as d3 from 'd3';
import { MainPage } from '../MainPage';
import { DB } from './DB';
import { Usuario } from './Usuario';
import { D3Utils } from '../general/Utils';
import { Request } from './Request';

export namespace Unidad {
    export var StoreName: string = "Unidad";
    export var ColumnName: string[] = [
        "IdRegistro",
        "IdUsuarioMovil",
        "IdUnidad",
        "FechaInicio",
        "FechaFin",
        "Modificacion"
    ];
    export var Key: string = "IdRegistro";
    export var UnitUser: any;

    export async function fn_obtener_unidad_usuario_movil_nana() {
        /*return DB.getMaxValue(StoreName, "Modificacion", 'prev', null).then(function (result: any) {
            let maxDate = null;
            if (result.Modificacion)
                maxDate = D3Utils.met_toMSJSON(new Date(result.Modificacion));



            return d3.json(MainPage.SVCUsuariosMovil + "ObtenerUnidadUsuarioMovil", {
                method: "POST",
                body: JSON.stringify({
                    IdUsuario: Usuario.UserLogged.IdUsuario,
                    Token: Usuario.UserLogged.Token,
                    Modificacion: maxDate
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
        }).then(function (result: any) {
            if (result.ObtenerUnidadUsuarioMovilResult && result.ObtenerUnidadUsuarioMovilResult.length > 0) {
                DB.addRows(StoreName, result.ObtenerUnidadUsuarioMovilResult);
            }

            return result;
        });*/

        let params = {
            IdUsuario: Usuario.UserLogged.IdUsuario,
            Token: Usuario.UserLogged.Token,
            Modificacion: null as string
        };

        return Request.JSONRequest(MainPage.SVCUsuariosMovil + "ObtenerUnidadUsuarioMovil", 'POST', params).then(function (result: any) {
            if (result.ObtenerUnidadUsuarioMovilResult && result.ObtenerUnidadUsuarioMovilResult.length > 0) {
                DB.addRows(StoreName, result.ObtenerUnidadUsuarioMovilResult);
            }

            return result;
        });
    }

    export async function fn_get_unit() {
        return new Promise(function (resolve, reject) {
            if (UnitUser != null) {
                resolve(UnitUser);
                return;
            }

            return DB.getRows(StoreName);
        });
    }
}