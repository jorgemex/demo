import * as d3 from 'd3';
import { DB } from "./DB";
import { D3Utils } from "../general/Utils";
import { MainPage } from '../MainPage';
import { Usuario } from './Usuario';
import { Request } from './Request';
import { Entidades } from '../general/Entidades';
import { AsignacionRuta } from './AsignacionRuta';

export namespace RutaPuntos {
    export var RutaBase: Entidades.IRutaPunto;
    export var StoreName: string = "RutaPuntos";
    export var Key: string = "IdPunto";
    export var ColumnName: string[] = [
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

    export async function fn_obtener_ruta_puntos(idRuta: number) {
        return DB.getMaxValue(StoreName, "Modificacion", 'prev', null).then(function (result: any) {
            let maxDate = null;
            if (result.Modificacion)
                maxDate = D3Utils.met_toMSJSON(new Date(result.Modificacion));

            let params = {
                IdUsuario: Usuario.UserLogged.IdUsuario,
                Token: Usuario.UserLogged.Token,
                IdRuta: idRuta,
                IdEmpresa: Usuario.UserLogged.IdEmpresa,
                Modificacion: maxDate
            }

            return Request.JSONRequest(MainPage.SVCAsignaciones + "ObtenerRutaPuntos", 'POST', params);
        }).then(function (result: any) {
            if (result.ObtenerRutaPuntosResult && result.ObtenerRutaPuntosResult.length > 0) {

                return AsignacionRuta.fn_obtener_asignacion_cumplimiento(AsignacionRuta.RutaAsignada.IdAsignacion).then((resCumplimiento: any) => {
                    var cumplimiento: Array<Entidades.IAsignacionCumplimiento> = resCumplimiento.ObtenerAsignacionCumplimientoResult || [];

                    result.ObtenerRutaPuntosResult.forEach((item: any) => {
                        item.FechaLlegada = null;
                        item.FechaSalida = null;

                        let objCump = cumplimiento.find(o => o.IdPuntoRuta == item.IdPunto);
                        if (objCump) {
                            item.FechaLlegada = objCump.Llegada;
                            item.FechaSalida = objCump.Salida;
                        }
                    });
                    
                    DB.setRows(StoreName, result.ObtenerRutaPuntosResult);

                    return result;
                });

                // result.ObtenerRutaPuntosResult.forEach((element: any) => {
                //     element.FechaSalida = null;
                //     element.FechaLlegada = null;
                // });

                // DB.setRows(StoreName, result.ObtenerRutaPuntosResult);
            } else
                return result;


        });
    }

    export async function fn_get_ruta_data() {
        return DB.getRows(StoreName).then(function (result: any) {
            let _puntos: Array<Entidades.IRutaPunto> = [];

            //La base siempre esta en la primera y en la ultima
            RutaBase = {} as Entidades.IRutaPunto;
            if (result.length > 0)
                RutaBase = result[result.length - 1];

            let _orden = 0,
                _nSuccessBecome = 0;
            result.forEach((item: any, i: number) => {
                if (item.FechaSalida == null)
                    _puntos.push(item)
                else
                    _orden = item.Orden;

                if (item.FechaLlegada != null)
                    _nSuccessBecome++;
            });

            if (_nSuccessBecome < 2)//Para regresar a la base, como minimo se debe recorrer 2 puntos(Base y alguno mas)
                _puntos.splice(-1, 1);

            if (_orden > 1 && _puntos.length > 0)
                _puntos = _puntos.filter(elm => elm.Orden > _orden);

            return _puntos;
        });
    }

    export async function fn_get_address(lat: number, lng: number) {
        let url = MainPage.URLPrincipal + "ServicioGoogle/Servicio.svc/ObtenerDireccionLista";
        let params = {
            idUsuario: Usuario.UserLogged.IdUsuario,
            Token: Usuario.UserLogged.Token,
            ListaDePuntos: [{
                Id: "1",
                Latitud: lat,
                Longitud: lng
            }]
        };

        return Request.JSONRequest(url, 'POST', params);
    }

    export async function fn_set_ruta_punto(rutapunto: Entidades.IRutaPunto) {
        return DB.setRows(StoreName, [rutapunto]);
    }

    export async function fn_remove_data_store() {
        return DB.clearObjectStore(StoreName);
    }

    export async function fn_get_punto(id: any) {
        return DB.getRowById(StoreName, id);
    }

    export async function fn_get_max_clv(clv: any) {
        return DB.getMaxValue(StoreName, clv, 'prev', null);
    }

    export async function fn_get_all_rutas() {
        return DB.getRows(StoreName).then((res: any) => {
            if (res && res.length > 0)
                RutaBase = res[res.length - 1];

            return res;
        });
    }

    export async function fn_count_clv(clv: any) {
        return DB.countRows(StoreName, clv);
    }
}