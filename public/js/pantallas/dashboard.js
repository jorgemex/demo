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
const d3 = require("d3");
const L = require("leaflet");
const Utils_1 = require("../general/Utils");
const MainPage_1 = require("../MainPage");
const template_1 = require("../controles/template");
const Menu_1 = require("./Menu");
const Usuario_1 = require("../data/Usuario");
const RutaPuntos_1 = require("../data/RutaPuntos");
const AsignacionRuta_1 = require("../data/AsignacionRuta");
const General_1 = require("../general/General");
const MenuOpciones_1 = require("./MenuOpciones");
const dialogs_1 = require("../general/dialogs");
var Dashboard;
(function (Dashboard) {
    var wth_screen;
    var hgt_screen_container;
    let prop_svg_app_map = null;
    let g_footer_content = null;
    let g_footer_content_buttons = null;
    let g_footer_content_info = null;
    let g_header_app = null;
    let initBtn = null;
    let becomeBtn = null;
    let assistBtn = null;
    let g_btn_current_location = null;
    let svgMain;
    let g_full_info_content;
    let g_info_window;
    var map;
    var mker_my_position;
    var mker_destination;
    var showDetailSucursal = false;
    var rutasPunto = [];
    var direccionUbicacion;
    var rutaAsignada = {};
    var nextSuc = {};
    var asignacionCumplimiento = [];
    var mkers_asignaciones = [];
    var toFinalize;
    let _hgt_image_current_location = 45;
    let _wth_content_info = 196;
    let _hgt_content_info = 102;
    var menu;
    function fn_init_dashboard() {
        toFinalize = window.localStorage.getItem("toFinalize") ? true : false;
        fn_load_interface();
        Usuario_1.Usuario.fn_obtener_unidad_usuario_movil().then(function (result) {
            if (!toFinalize) {
                fn_obtener_asignacion_ruta().then(response => {
                    if (!response) {
                        setTimeout(startWorkerAsignaciones, 60000);
                    }
                    else if (response.Regreso != null) {
                        setTimeout(fn_bounds_all_cumplimiento, 500);
                        initBtn.select(".txt-footer-button").text("Finalizar");
                        initBtn.property("action", "end");
                    }
                    else if (response.Salida != null) {
                        setTimeout(() => {
                            if (!nextSuc.FechaLlegada) {
                                startWorkerPointsLocation();
                            }
                        }, 3000);
                    }
                });
            }
            else {
                AsignacionRuta_1.AsignacionRuta.fn_get_asignacion_ruta().then(res => {
                    if (!res)
                        return;
                    rutaAsignada = res;
                    setTimeout(fn_bounds_all_cumplimiento, 500);
                    Utils_1.D3Utils.prop_height_footer = 50;
                    resize_divs_container();
                    initBtn.select(".txt-footer-button").text("Finalizar");
                    initBtn.property("action", "end");
                });
            }
            g_header_app.select(".title-text").text("Operador: " + Usuario_1.Usuario.UserLogged.NombreUnidad);
        }).catch(function (err) {
            console.log(err);
        });
    }
    Dashboard.fn_init_dashboard = fn_init_dashboard;
    function fn_obtener_asignacion_ruta() {
        return __awaiter(this, void 0, void 0, function* () {
            return AsignacionRuta_1.AsignacionRuta.fn_obtener_asignacionRuta().then(function (result) {
                if (result) {
                    rutaAsignada = result;
                    if (rutaAsignada.Salida == null) {
                        initBtn.select(".txt-footer-button").text("Iniciar");
                        initBtn.property("action", "init");
                    }
                    else {
                        initBtn.select(".txt-footer-button").text("Salida");
                        initBtn.property("action", "next");
                    }
                    RutaPuntos_1.RutaPuntos.fn_obtener_ruta_puntos(result.IdRuta).then(function (res) {
                        RutaPuntos_1.RutaPuntos.fn_get_ruta_data().then(function (response) {
                            rutasPunto = response;
                            if (rutasPunto.length > 0) {
                                nextSuc = rutasPunto[0];
                                Utils_1.D3Utils.prop_height_footer = 50;
                                resize_divs_container();
                                if (rutaAsignada.Salida && !nextSuc.FechaLlegada) {
                                    initBtn.style("display", "none");
                                    fn_show_assist_button();
                                    fn_set_destination_bounds();
                                }
                            }
                            else {
                                console.log("No hay mas puntos Ruta");
                            }
                        });
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
                return result;
            });
        });
    }
    function fn_load_interface() {
        if (MainPage_1.MainPage._template == null) {
            MainPage_1.MainPage._template = template_1.Template.fun_main({
                el_content: MainPage_1.MainPage.prop_contenedor_principal,
                prop_height_footer: 0,
                prop_height_header: Utils_1.D3Utils.prop_height_header,
                prop_orientation: "portrait"
            });
            MainPage_1.MainPage.prop_content_template = MainPage_1.MainPage._template.fun_get_g_content();
        }
        wth_screen = MainPage_1.MainPage._template.fun_get_width();
        hgt_screen_container = Math.floor(MainPage_1.MainPage._template.fun_get_height_content());
        prop_svg_app_map = MainPage_1.MainPage.prop_content_template;
        initMaps();
        fn_load_screen_app();
    }
    function fn_load_screen_app() {
        g_header_app = MainPage_1.MainPage._template.fun_get_g_header().append(() => Utils_1.D3Utils.fn_crear_encabezado().node());
        ;
        g_header_app.select(".title-text").text("Unidad: " + "Unidad movil");
        svgMain = d3.select(MainPage_1.MainPage._template.prop_element).select(".plantilla-svg-parent");
        fn_CrearMenu();
        g_header_app.select(".g_flecha_header").call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
            menu.fn_Mostrar();
        });
        g_header_app.select(".g_more_header").call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
            MenuOpciones_1.MenuOpciones.fn_mostrar_ocultar_opciones(svgMain);
        });
        fn_loadFooter();
        fn_show_button_my_location();
    }
    function fn_CrearMenu() {
        menu = Menu_1.Menu.fn_Init({
            content: svgMain,
            width: MainPage_1.MainPage._template.fun_get_width(),
            height: MainPage_1.MainPage._template.fun_get_height_content(),
            nombreUsuario: "usuario",
            email: "usuario@hotmail.com",
            fn_ClickMismoMenu: (hash) => {
                if (hash == "CSN")
                    setTimeout(() => {
                        dialogs_1.dialogs.show_confirm_dialog("Cerrar Sesión", "Se abandonará el seguimiento de rutas", dialogs_1.dialogs.fn_salir);
                    }, 400);
                else if (hash == "CHT") {
                    dialogs_1.dialogs.show_alert_dialog("Recordatorio de entrega", "Te restan" + 2 + "hrs 35 min para finalizar la entrega");
                }
            }
        });
        return menu;
    }
    Dashboard.fn_CrearMenu = fn_CrearMenu;
    var lmaps;
    function initMaps() {
        let mapcenter = [25.656738, -100.394481];
        let _container = MainPage_1.MainPage._template.prop_element.getElementsByClassName('container');
        let div_map = d3.select(_container[0]).append("div")
            .attr("id", 'map')
            .style("z-index", 50)
            .style("height", "100%");
        lmaps = L.map(div_map.node()).setView(mapcenter, 15);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
        }).addTo(lmaps);
        setTimeout(mark, 2000);
    }
    function mark() {
        let data = {
            EnUso: true,
            FechaSalida: "2018-06-07T00:26:21.022Z",
            FechaLlegada: "2018-06-07T01:26:21.022Z",
            IdPunto: 1702,
            IdSitio: 1398,
            Latitud: 25.652156,
            Longitud: -100.389240,
            Modificacion: "2018-06-07T00:26:21.022Z",
            NombreSitio: "Elevenminds",
            Orden: 2,
            Poligono: "POLYGON ((-100.243658 25.7359540283512, -100.243533127371 25.7359841687838, -100.243441714113 25.7360665140159, -100.243408254333 25.7361789997871, -100.243441713703 25.7362914856647, -100.24345090428776 25.736299764589578, -100.243451713683 25.7363024856647, -100.24354312695 25.7363848311098, -100.243668 25.7364149716488, -100.24379287305 25.7363848311098, -100.243884286317 25.7363024856647, -100.24391774569 25.7361899997871, -100.243884285907 25.7360775140159, -100.24387509529539 25.736069235104448, -100.243874285887 25.7360665140159, -100.243782872629 25.7359841687838, -100.243658 25.7359540283512))",
            Radio: 36,
            TipoArea: 2,
        };
        fn_add_marker(data);
    }
    function fn_set_current_position(callback) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.panTo(pos);
            map.setCenter(pos);
            if (!mker_my_position) {
                mker_my_position = new google.maps.Marker({
                    position: pos,
                    map: map,
                    draggable: false,
                    icon: Utils_1.D3Utils.get_icon_current_location()
                });
            }
            else
                mker_my_position.setPosition(pos);
            if (callback)
                callback(mker_my_position.getPosition());
        }, function (err) {
            console.log(err);
            MainPage_1.MainPage.fn_show_message("Error: location GPS not working!");
        });
    }
    function fn_loadFooter() {
        if (g_footer_content == null)
            g_footer_content = MainPage_1.MainPage._template.fun_get_g_footer().append(() => Utils_1.D3Utils.fn_crear_piedepagina(fn_show_info_next_sucursal).node());
        if (g_footer_content_buttons == null)
            g_footer_content_buttons = g_footer_content.select(".g_content_footer").attr("height", 50);
        initBtn = g_footer_content_buttons.append(() => Utils_1.D3Utils.fn_crear_footer_button("Iniciar").node())
            .attr("transform", "translate(" + (Utils_1.D3Utils._width_footer_container / 2 - Utils_1.D3Utils._width_footer_button / 2) + "," + 8 + ")")
            .classed("select-button", true)
            .property("setPrevent", true)
            .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
            if (initBtn.property("action") == "end") {
                fn_marcar_regreso();
            }
            else if (map && rutasPunto.length > 0) {
                g_btn_current_location.property("isBlock", true);
                initBtn.style("display", "none");
                if (initBtn.property("action") == "init") {
                    fn_marcar_inicio();
                }
                else if (initBtn.property("action") == "cedis") {
                    fn_marcar_salida();
                }
                else if (initBtn.property("action") == "next") {
                    fn_marcar_salida();
                }
            }
        });
    }
    function fn_marcar_inicio() {
        AsignacionRuta_1.AsignacionRuta.fn_marcar_salida(rutaAsignada.IdAsignacion).then((resultInit) => {
            var resInit = resultInit.MarcarSalidaRegresoResult;
            if (resInit == 1 || resInit == -2) {
                rutaAsignada.Salida = (new Date()).toISOString();
                AsignacionRuta_1.AsignacionRuta.fn_set_asignacion_ruta(rutaAsignada);
                initBtn.select(".txt-footer-button").text("Salida");
                initBtn.property("action", "next");
                AsignacionRuta_1.AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, true).then((resultBecome) => {
                    let resBecome = resultBecome.MarcarLlegadaSalidaResult;
                    if (resBecome > 0 || resBecome == -2) {
                        nextSuc.FechaLlegada = (new Date()).toISOString();
                        RutaPuntos_1.RutaPuntos.fn_set_ruta_punto(nextSuc);
                        AsignacionRuta_1.AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, false).then((resultWayout) => {
                            var resOut = resultWayout.MarcarLlegadaSalidaResult;
                            if (resOut == 1 || resOut == -3) {
                                fn_update_fecha_salida(resOut).then(function (response) {
                                    fn_show_assist_button();
                                    nextSuc = rutasPunto[0];
                                    fn_set_destination_bounds();
                                    setTimeout(startWorkerPointsLocation, 30000);
                                });
                            }
                            else {
                                initBtn.style("display", "block");
                                becomeBtn.style("display", "none");
                                assistBtn.style("display", "none");
                            }
                        });
                    }
                    else {
                        fn_show_assist_button();
                        setTimeout(startWorkerPointsLocation, 30000);
                    }
                });
            }
            else {
                MainPage_1.MainPage.fn_show_message("Ocurrió un error al iniciar intentelo mas tarde!");
                initBtn.style("display", "block");
            }
        });
    }
    function fn_marcar_regreso() {
        AsignacionRuta_1.AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, RutaPuntos_1.RutaPuntos.RutaBase.IdPunto, false).then((result) => {
            var res = result.MarcarLlegadaSalidaResult;
            if (res == 1 || res == -3) {
                RutaPuntos_1.RutaPuntos.RutaBase.FechaSalida = (new Date()).toISOString();
                RutaPuntos_1.RutaPuntos.fn_set_ruta_punto(RutaPuntos_1.RutaPuntos.RutaBase);
                AsignacionRuta_1.AsignacionRuta.fn_marcar_regreso(rutaAsignada.IdAsignacion).then((result) => {
                    let res = parseInt(result.MarcarSalidaRegresoResult);
                    if (res == 1 || res == -3) {
                        localStorage.removeItem('toFinalize');
                        RutaPuntos_1.RutaPuntos.fn_remove_data_store();
                        setTimeout(AsignacionRuta_1.AsignacionRuta.fn_remove_asignacion_ruta, 700);
                        rutasPunto = [];
                        rutaAsignada = {};
                        fn_delete_markers();
                        initBtn.select(".txt-footer-button").text("Iniciar");
                        initBtn.property("action", "init");
                        g_btn_current_location.property("isBlock", false);
                        fn_show_button_my_location();
                        Utils_1.D3Utils.prop_height_footer = 0;
                        resize_divs_container();
                        setTimeout(startWorkerAsignaciones, 30000);
                    }
                    else {
                        MainPage_1.MainPage.fn_show_message("Ocurrió un error: Regreso, intentelo mas tarde!");
                        initBtn.style("display", "block");
                    }
                });
            }
            else {
                MainPage_1.MainPage.fn_show_message("Ocurrió un error: Salida, intentelo mas tarde!");
                initBtn.style("display", "block");
            }
        });
    }
    function fn_marcar_salida() {
        AsignacionRuta_1.AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, false).then((result) => {
            var res = result.MarcarLlegadaSalidaResult;
            if (res == 1 || res == -3) {
                fn_update_fecha_salida(res).then(function (response) {
                    fn_add_marker(nextSuc);
                    fn_show_assist_button();
                    if (rutasPunto.length > 0) {
                        nextSuc = rutasPunto[0];
                    }
                    let timeWaitWorker = 0;
                    if (res == 1) {
                        fn_set_destination_bounds();
                        timeWaitWorker = 30000;
                    }
                    setTimeout(startWorkerPointsLocation, timeWaitWorker);
                });
            }
            else {
                MainPage_1.MainPage.fn_show_message("Ocurrió un error al iniciar intentelo mas tarde!");
                initBtn.style("display", "block");
            }
        });
    }
    function fn_update_fecha_salida(res) {
        return __awaiter(this, void 0, void 0, function* () {
            g_btn_current_location.style("display", "none");
            return new Promise((resolve, reject) => {
                nextSuc.FechaSalida = (new Date()).toISOString();
                RutaPuntos_1.RutaPuntos.fn_set_ruta_punto(nextSuc).then(() => {
                    return RutaPuntos_1.RutaPuntos.fn_get_ruta_data();
                }).then(result => {
                    rutasPunto = result;
                    resolve(1);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
    function fn_set_destination_bounds() {
        if (!nextSuc || !nextSuc.Latitud)
            return;
        var dest = {
            lat: nextSuc.Latitud,
            lng: nextSuc.Longitud
        };
        if (!mker_destination) {
            var icon = Utils_1.D3Utils.get_icon_marker('black');
            mker_destination = new google.maps.Marker({
                position: dest,
                map: map,
                icon: icon
            });
        }
        else {
            mker_destination.setPosition(dest);
        }
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(mker_my_position.getPosition());
        bounds.extend(dest);
        map.fitBounds(bounds);
        let info_window = new google.maps.InfoWindow({
            content: "<div><strong>" + nextSuc.NombreSitio + "</strong></div><span>No. #" + nextSuc.Orden + "</span>"
        });
        info_window.open(map, mker_destination);
        mker_destination.addListener('click', () => {
            info_window.open(map, mker_destination);
        });
    }
    function fn_add_marker(data) {
        let icon;
        if (data.FechaLlegada && data.FechaSalida) {
            let dtLlegada = new Date(data.FechaLlegada);
            let dtSalida = new Date(data.FechaSalida);
            let diff = dtSalida.getTime() - dtLlegada.getTime();
            diff = Math.trunc(diff / 60000);
            let _color = diff > Utils_1.D3Utils.visit_time ? 'orange' : 'green';
        }
        let texts = {
            text1: "12:10:06",
            text2: "15:10:06",
            text3: "10 min"
        };
        let color = 'red';
        var svgrect = "<svg transform='translate(" + (-20 / MainPage_1.MainPage._template.fun_get_scale()) + ",18)' width='190' height='20' xmlns='http://www.w3.org/2000/svg' version='1.1'><rect x='0' y='0' width='190' height='20' rx='10' fill=" + color + "></rect></svg>";
        let suc = "Elevenminds";
        let buttonn = {
            bton: 'button1',
            bton2: 'button2',
            bton3: 'button3'
        };
        var customPopup = "<center>" + suc + "<span><br>Hora llegada: " + texts.text1 + "<br>Hora salida: " + texts.text2 + "<br>Tiempo visita: " + texts.text3 + "</span></center> <button type='button' class='button " + buttonn.bton3 + "'>llegas tarde </button>";
        var customOptions = {
            'maxWidth': 150,
            'className': 'custom'
        };
        L.marker([25.652156, -100.389240]).bindPopup(customPopup, customOptions).addTo(lmaps);
    }
    function fn_delete_markers() {
        for (var i = 0; i < mkers_asignaciones.length; i++) {
            mkers_asignaciones[i].setMap(null);
        }
        mkers_asignaciones = [];
    }
    function fn_show_assist_button() {
        if (assistBtn == null) {
            assistBtn = g_footer_content_buttons.append(() => Utils_1.D3Utils.fn_crear_footer_button("Iniciar asistencia").node())
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                fn_click_btn_asistente();
            });
        }
        else {
            assistBtn.style("display", "block");
        }
        assistBtn.attr("transform", "translate(" + (Utils_1.D3Utils._width_footer_container / 2 - Utils_1.D3Utils._width_footer_button / 2) + "," + 8 + ")");
    }
    function fn_click_btn_asistente() {
        MainPage_1.MainPage.fn_open_maps_assist(nextSuc.Latitud, nextSuc.Longitud);
    }
    function fn_show_become_button() {
        if (becomeBtn == null) {
            becomeBtn = g_footer_content_buttons.append(() => Utils_1.D3Utils.fn_crear_footer_button("Llegada").node())
                .attr("transform", "translate(5," + 8 + ")")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                becomeBtn.style("display", "none");
                fn_marcar_llegada();
            });
        }
        else {
            becomeBtn.style("display", "block");
        }
        assistBtn.attr("transform", "translate(" + (5 + Utils_1.D3Utils._width_footer_button + 5) + "," + 8 + ")");
    }
    function fn_marcar_llegada() {
        fn_delete_markers();
        AsignacionRuta_1.AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, true).then((result) => {
            let res = result.MarcarLlegadaSalidaResult;
            if (res > 0 || res == -2) {
                initBtn.style("display", "block");
                becomeBtn.style("display", "none");
                assistBtn.style("display", "none");
                nextSuc.FechaLlegada = (new Date()).toISOString();
                RutaPuntos_1.RutaPuntos.fn_set_ruta_punto(nextSuc);
                if (rutasPunto.length > 1 && rutasPunto[1].IdPunto == RutaPuntos_1.RutaPuntos.RutaBase.IdPunto) {
                    initBtn.select(".txt-footer-button").text("Ruta Cedis");
                    initBtn.property("action", "cedis");
                }
                if (nextSuc.IdPunto == RutaPuntos_1.RutaPuntos.RutaBase.IdPunto) {
                    fn_bounds_all_cumplimiento();
                    initBtn.select(".txt-footer-button").text("Finalizar");
                    initBtn.property("action", "end");
                    localStorage.setItem('toFinalize', 'true');
                }
                else {
                    fn_add_marker(nextSuc);
                }
            }
            else {
                MainPage_1.MainPage.fn_show_message("Ocurrió un error en la llegada, intentelo mas tarde!");
                becomeBtn.style("display", "block");
            }
        });
    }
    function fn_bounds_all_cumplimiento() {
        AsignacionRuta_1.AsignacionRuta.fn_obtener_asignacion_cumplimiento(rutaAsignada.IdAsignacion).then((resCumplimiento) => {
            var cumplimiento = resCumplimiento.ObtenerAsignacionCumplimientoResult || [];
            if (cumplimiento.length > 0) {
                RutaPuntos_1.RutaPuntos.fn_get_all_rutas().then((result) => {
                    fn_delete_markers();
                    if (result && result.length > 0) {
                        result.forEach((item) => {
                            item.FechaLlegada = null;
                            item.FechaSalida = null;
                            let objCump = cumplimiento.find(o => o.IdPuntoRuta == item.IdPunto);
                            if (objCump) {
                                item.FechaLlegada = objCump.Llegada;
                                item.FechaSalida = objCump.Salida;
                            }
                            fn_add_marker(item);
                        });
                        if (mkers_asignaciones.length > 0) {
                            var bounds = new google.maps.LatLngBounds();
                            bounds.extend(mker_my_position.getPosition());
                            mkers_asignaciones.forEach(mkr => {
                                bounds.extend(mkr.getPosition());
                            });
                            map.fitBounds(bounds);
                        }
                    }
                });
            }
        });
    }
    function fn_show_button_my_location() {
        if (g_btn_current_location == null) {
            g_btn_current_location = prop_svg_app_map.append("g")
                .attr("transform", "translate(" + (wth_screen - _hgt_image_current_location - 8) + ", " + (hgt_screen_container - _hgt_image_current_location - 8) + ")");
            if (toFinalize)
                g_btn_current_location.style("display", "none");
            g_btn_current_location.append("rect")
                .classed("shadowed-card", true)
                .property("setPrevent", true)
                .classed("select-sadowed", true)
                .attr("width", "45")
                .attr("height", "45")
                .attr("rx", "50%")
                .attr("ry", "50%")
                .call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                fn_set_current_position();
            });
            g_btn_current_location.append("path").attr("fill", Utils_1.D3Utils.prop_color_acent)
                .attr("transform", "translate(7, 7) scale(0.65)")
                .style("pointer-events", "none")
                .attr("d", "M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm17.88 6c-.92-8.34-7.54-14.96-15.88-15.88v-4.12h-4v4.12c-8.34.92-14.96 7.54-15.88 15.88h-4.12v4h4.12c.92 8.34 7.54 14.96 15.88 15.88v4.12h4v-4.12c8.34-.92 14.96-7.54 15.88-15.88h4.12v-4h-4.12zm-17.88 16c-7.73 0-14-6.27-14-14s6.27-14 14-14 14 6.27 14 14-6.27 14-14 14z");
        }
        else {
            g_btn_current_location.style("display", "block");
        }
    }
    function fn_hide_dashboard() {
        d3.select(MainPage_1.MainPage._template.prop_element).style("display", "none");
    }
    Dashboard.fn_hide_dashboard = fn_hide_dashboard;
    function fn_show_info_next_sucursal() {
        if (d3.event.defaultPrevented)
            return;
        if (showDetailSucursal)
            Utils_1.D3Utils.prop_height_footer = 50;
        else
            Utils_1.D3Utils.prop_height_footer = 150;
        resize_divs_container();
        Utils_1.D3Utils.fn_actualizar_pie_pagina(g_footer_content, !showDetailSucursal);
        showDetailSucursal = !showDetailSucursal;
        if (showDetailSucursal) {
            fn_show_info();
        }
        else {
            g_footer_content_info.style("display", "none");
        }
    }
    function resize_divs_container() {
        MainPage_1.MainPage._template.prop_config.prop_height_footer = Utils_1.D3Utils.prop_height_footer;
        template_1.Template.fun_on_change_container_size(MainPage_1.MainPage._template);
        hgt_screen_container = Math.floor(MainPage_1.MainPage._template.fun_get_height_content() - Utils_1.D3Utils.prop_height_footer);
        g_btn_current_location.attr("transform", "translate(" + (wth_screen - _hgt_image_current_location - 8) + ", " + (hgt_screen_container - _hgt_image_current_location - 8) + ")");
    }
    function fn_show_info() {
        if (!g_footer_content_info) {
            let _hg_content = wth_screen - 50;
            g_footer_content_info = g_footer_content.append("g")
                .attr("transform", "translate(0,0)")
                .classed("g_content_footer_info", true)
                .attr("fill", "#FFFFFF");
            g_footer_content_info.append("rect")
                .attr("width", _hg_content)
                .attr("height", "100%")
                .attr("fill", "#FFFFFF");
            g_footer_content_info.append("text")
                .text("Información de Farmacias")
                .attr("x", _hg_content / 2)
                .attr("y", "20")
                .style("fill", Utils_1.D3Utils.prop_color_primary)
                .style("font-size", "16")
                .attr("text-anchor", "middle")
                .style("font-weight", "bold");
            g_footer_content_info.append("text")
                .text("Nº de sitios:")
                .attr("x", _hg_content / 2 - 5)
                .attr("y", "45")
                .style("fill", Utils_1.D3Utils.prop_color_primary)
                .attr("text-anchor", "end")
                .style("font-size", "15");
            g_footer_content_info.append("text")
                .text("Proxima sucursal:")
                .attr("x", _hg_content / 2 - 5)
                .attr("y", "65")
                .style("fill", Utils_1.D3Utils.prop_color_primary)
                .attr("text-anchor", "end")
                .style("font-size", "15");
            g_footer_content_info.append("text")
                .text("Dirección:")
                .attr("x", _hg_content / 2 - 5)
                .attr("y", "86")
                .style("fill", Utils_1.D3Utils.prop_color_primary)
                .attr("text-anchor", "end")
                .style("font-size", "15");
            g_footer_content_info.append("text")
                .classed("footer-num-info", true)
                .attr("x", _hg_content / 2 + 5)
                .attr("y", "45")
                .style("fill", Utils_1.D3Utils.prop_color_primary)
                .attr("text-anchor", "start")
                .style("font-size", "15");
            g_footer_content_info.append("text")
                .classed("footer-next-info", true)
                .attr("x", _hg_content / 2 + 5)
                .attr("y", "65")
                .style("fill", Utils_1.D3Utils.prop_color_primary)
                .attr("text-anchor", "start")
                .style("font-size", "15");
            g_footer_content_info.append("text")
                .classed("footer-address-info", true)
                .attr("x", _hg_content / 2 + 5)
                .attr("y", "82")
                .style("fill", Utils_1.D3Utils.prop_color_primary)
                .attr("text-anchor", "start")
                .style("font-size", "15");
        }
        else {
            g_footer_content_info.style("display", "block");
        }
        fn_fill_info_suc();
    }
    function fn_fill_info_suc() {
        RutaPuntos_1.RutaPuntos.fn_count_clv('IdPunto').then((res) => {
            let _total = res;
            if (!Utils_1.D3Utils.consider_base_route)
                _total = res - 1;
            g_footer_content_info.select(".footer-num-info")
                .text(_total);
        });
        g_footer_content_info.select(".footer-next-info")
            .text(nextSuc.NombreSitio);
        if (!nextSuc.Latitud || !nextSuc.Longitud)
            return;
        let lat = nextSuc.Latitud;
        let lng = nextSuc.Longitud;
        if (direccionUbicacion && direccionUbicacion.lat == lat && direccionUbicacion.lng == lng) {
            fn_fill_address();
        }
        else {
            fn_address_from_latlng(lat, lng);
        }
    }
    function fn_address_from_latlng(lat, lng) {
        RutaPuntos_1.RutaPuntos.fn_get_address(lat, lng).then(function (result) {
            if (result.ObtenerDireccionListaResult && result.ObtenerDireccionListaResult.length > 0) {
                var address = result.ObtenerDireccionListaResult[0].Ubicacion;
                direccionUbicacion = {
                    lat: lat,
                    lng: lng,
                    direccion: address,
                };
                fn_fill_address();
            }
        });
    }
    function fn_fill_address() {
        g_footer_content_info.select(".footer-address-info")
            .text(direccionUbicacion.direccion);
        Utils_1.D3Utils.fun_limitar_texto(g_footer_content_info.select(".footer-next-info"), (wth_screen - 50) / 2, 0, "...");
        Utils_1.D3Utils.wrap(g_footer_content_info.select(".footer-address-info"), (wth_screen - 45) / 2, 15, "...", 3);
    }
    function fn_draw_info_window(marker) {
        if (g_full_info_content == null) {
            g_full_info_content = svgMain.append("g")
                .style("pointer-events", "all");
            g_full_info_content.append("rect")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", MainPage_1.MainPage._template.fun_get_width())
                .attr("height", MainPage_1.MainPage._template.fun_get_height_content() + MainPage_1.MainPage._template.fun_get_height_header() + MainPage_1.MainPage._template.fun_get_height_footer())
                .style("fill", "#000000")
                .style("opacity", "0");
            g_full_info_content.call(Utils_1.D3Utils.eventos.fun_agregar_click, () => {
                fn_remove_window_info_content();
            });
        }
        else {
            g_full_info_content.style("display", "block");
        }
        let obj = marker.get('data');
        if (!obj)
            return;
        let dtLlegada, dtSalida;
        let _tiempoVisita = " - ", _hrLlegada = " - ", _hrSalida = " - ", _status = "No visitado", _color = "red", diff = 0;
        if (obj.FechaLlegada) {
            dtLlegada = new Date(obj.FechaLlegada);
            _hrLlegada = dtLlegada.toLocaleTimeString();
            _status = "En visita";
            _color = "orange";
        }
        if (obj.FechaSalida) {
            dtSalida = new Date(obj.FechaSalida);
            _hrSalida = dtSalida.toLocaleTimeString();
            _status = "En visita";
            _color = "orange";
        }
        if (obj.FechaLlegada && obj.FechaSalida) {
            diff = dtSalida.getTime() - dtLlegada.getTime();
            diff = Math.round(diff / 60000);
            _tiempoVisita = diff > 60 ? Math.trunc(diff / 60) + "hrs" + (diff % 60) + "min" : diff.toString() + "min";
            _status = diff > Utils_1.D3Utils.visit_time ? "Tarde" : "A tiempo";
            _color = diff > Utils_1.D3Utils.visit_time ? 'orange' : 'green';
        }
        let texts = [
            "N. Sucursal:", obj.Orden,
            "Hora llegada:", _hrLlegada,
            "Hora salida:", _hrSalida,
            "Tiempo visita:", _tiempoVisita,
            _status
        ];
        let posXY = getPosXYfromLatLng(marker.getPosition());
        g_info_window = g_full_info_content.append("g")
            .classed('g-info-map-content', true)
            .classed("select-button", true)
            .property("setPrevent", true)
            .attr("transform", "translate(" + posXY.x + ", " + posXY.y + ")")
            .attr('width', _wth_content_info)
            .attr('height', _hgt_content_info);
        g_info_window.append('rect')
            .attr('width', _wth_content_info)
            .attr('height', _hgt_content_info)
            .attr('fill', Utils_1.D3Utils.prop_color_primary)
            .attr("rx", 6)
            .attr("opacity", 0.75);
        g_info_window.append('rect')
            .attr('width', _wth_content_info)
            .attr('height', 24)
            .attr("ry", 6)
            .attr('fill', _color)
            .attr("opacity", 0.6)
            .attr("transform", "translate(0," + (_hgt_content_info - 24) + ")");
        g_info_window.selectAll('.g-text-info-map-content')
            .data(texts)
            .enter().append('text')
            .attr("class", "g-text-info-map-content")
            .attr("font-size", "14")
            .style("fill", "white")
            .attr("text-anchor", function (d, i) {
            if (i == texts.length - 1)
                return "middle";
            return "start";
        })
            .attr("x", function (d, i) {
            if (i == texts.length - 1)
                return _wth_content_info / 2;
            if (i % 2 == 0)
                return 10;
            else
                return 105;
        })
            .attr("y", function (d, i) {
            if (i == texts.length - 1)
                return 94.5;
            let mod2 = Math.trunc((i + 1) / 2);
            if (i % 2 == 0)
                return (mod2 + 1) * 18;
            else
                return mod2 * 18;
        })
            .text(function (d, i) {
            return d;
        });
    }
    function getPosXYfromLatLng(pos) {
        let cc = General_1.General.latLng2Point(map, pos);
        let _x = cc.x * MainPage_1.MainPage._template.fun_get_scale(), _y = cc.y * MainPage_1.MainPage._template.fun_get_scale();
        _y += Utils_1.D3Utils.prop_height_header;
        _x = _x - (_wth_content_info / 2);
        _y = _y - _hgt_content_info - 30;
        return { x: _x, y: _y };
    }
    function fn_remove_window_info_content() {
        if (g_info_window != null) {
            g_info_window.remove();
            g_full_info_content.style("display", "none");
        }
    }
    function fn_find_nearby_routes(latLng) {
        rutasPunto.forEach(punto => {
            fn_valid_distance_point_location(latLng, punto);
        });
    }
    function fn_valid_distance_point_location(latLng, punto) {
        let latlngPunto = new google.maps.LatLng(punto.Latitud, punto.Longitud);
        var distance = Math.trunc(google.maps.geometry.spherical.computeDistanceBetween(latLng, latlngPunto));
        if (distance <= Utils_1.D3Utils.max_distance_beetween_points) {
            nextSuc = punto;
            map.setCenter(latlngPunto);
            map.setZoom(20);
            mker_my_position.setPosition(latlngPunto);
            if (mker_destination) {
                mker_destination.setMap(null);
                mker_destination = null;
            }
            fn_show_become_button();
            stopWorkerPointsLocation();
        }
    }
    var wkerPointsLocation;
    function startWorkerPointsLocation() {
        if (typeof (Worker) !== "undefined") {
            if (typeof (wkerPointsLocation) == "undefined") {
                wkerPointsLocation = new Worker("js/data/WorkerPuntosRuta.js");
            }
            wkerPointsLocation.onmessage = function (event) {
                fn_set_current_position(fn_find_nearby_routes);
            };
        }
        else {
            alert("Sorry, your browser does not support Web Workers...");
        }
    }
    function stopWorkerPointsLocation() {
        if (wkerPointsLocation) {
            wkerPointsLocation.terminate();
            wkerPointsLocation = undefined;
        }
    }
    var wkerAsignaciones;
    function startWorkerAsignaciones() {
        if (typeof (Worker) !== "undefined") {
            if (typeof (wkerAsignaciones) == "undefined") {
                wkerAsignaciones = new Worker("js/data/WorkerAsignaciones.js");
            }
            wkerAsignaciones.onmessage = function (event) {
                fn_obtener_asignacion_ruta().then(result => {
                    if (result) {
                        stopWorkerAsignaciones();
                    }
                });
            };
        }
        else {
            alert("Sorry! your browser does not support Web Workers");
        }
    }
    function stopWorkerAsignaciones() {
        if (wkerAsignaciones) {
            wkerAsignaciones.terminate();
            wkerAsignaciones = undefined;
        }
    }
    function fn_destroy() {
        MainPage_1.MainPage._template.prop_element.remove();
        MainPage_1.MainPage._template = null;
        g_footer_content = null;
        g_footer_content_buttons = null;
        g_btn_current_location = null;
        g_footer_content_info = null;
        Utils_1.D3Utils.prop_height_footer = 50;
        showDetailSucursal = false;
        assistBtn = null;
        becomeBtn = null;
        stopWorkerAsignaciones();
        stopWorkerPointsLocation();
    }
    Dashboard.fn_destroy = fn_destroy;
    function fn_show_dashboard() {
        if (MainPage_1.MainPage._template) {
            d3.select(MainPage_1.MainPage._template.prop_element).style("display", "block");
        }
    }
    Dashboard.fn_show_dashboard = fn_show_dashboard;
})(Dashboard = exports.Dashboard || (exports.Dashboard = {}));
