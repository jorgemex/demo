import * as d3 from 'd3';
import * as L from 'leaflet'
import { D3Utils } from '../general/Utils';
import { MainPage } from '../MainPage';
import { Template } from '../controles/template';
import { Menu } from './Menu';
import { Entidades } from '../general/Entidades';
import { Usuario } from '../data/Usuario';
import { RutaPuntos } from '../data/RutaPuntos';
import { AsignacionRuta } from '../data/AsignacionRuta';
import { General } from '../general/General';
import { MenuOpciones } from './MenuOpciones';
import { dialogs } from '../general/dialogs';

export namespace Dashboard {
    var wth_screen: number;
    var hgt_screen_container: number;

    let prop_svg_app_map: d3.Selection<any, any, any, any> = null;
    let g_footer_content: d3.Selection<any, any, any, any> = null;
    let g_footer_content_buttons: d3.Selection<any, any, any, any> = null;
    let g_footer_content_info: d3.Selection<any, any, any, any> = null;
    let g_header_app: d3.Selection<any, any, any, any> = null;

    let initBtn: d3.Selection<any, any, any, any> = null;
    let becomeBtn: d3.Selection<any, any, any, any> = null;
    let assistBtn: d3.Selection<any, any, any, any> = null;
    let g_btn_current_location: d3.Selection<any, any, any, any> = null;
    let svgMain: d3.Selection<any, any, any, any>;
    let g_full_info_content: d3.Selection<any, any, any, any>;
    let g_info_window: d3.Selection<any, any, any, any>;

    var map: google.maps.Map;
    var mker_my_position: google.maps.Marker;
    var mker_destination: google.maps.Marker;
    var showDetailSucursal: boolean = false;

    var rutasPunto: Array<Entidades.IRutaPunto> = [];
    var direccionUbicacion: any;
    var rutaAsignada = {} as Entidades.IAsignacionRuta;
    var nextSuc = {} as Entidades.IRutaPunto;
    var asignacionCumplimiento: Array<Entidades.IAsignacionCumplimiento> = [];
    var mkers_asignaciones: Array<google.maps.Marker> = [];

    var toFinalize: boolean;
    let _hgt_image_current_location = 45;
    let _wth_content_info = 196;
    let _hgt_content_info = 102;//,

    var menu: Menu.iControlObject;

    export function fn_init_dashboard() {
        toFinalize = window.localStorage.getItem("toFinalize") ? true : false;
        //#######  Load Interface  #######
        fn_load_interface();
        //################################

        //Get Unit
        Usuario.fn_obtener_unidad_usuario_movil().then(function (result) {
            if (!toFinalize) {
                fn_obtener_asignacion_ruta().then(response => {
                    if (!response) {
                        setTimeout(startWorkerAsignaciones, 60000);//Start Worker...
                    } else if (response.Regreso != null) {
                        //SIN Finalizar. . .
                        setTimeout(fn_bounds_all_cumplimiento, 500);
                        initBtn.select(".txt-footer-button").text("Finalizar");
                        initBtn.property("action", "end");
                    } else if (response.Salida != null) {
                        setTimeout(() => {
                            if (!nextSuc.FechaLlegada) {
                                // initBtn.style("display", "none");
                                startWorkerPointsLocation();
                                // fn_show_assist_button();
                            }
                        }, 3000);
                    }
                });
            } else {
                AsignacionRuta.fn_get_asignacion_ruta().then(res => {
                    if (!res)
                        return;

                    rutaAsignada = res;
                    setTimeout(fn_bounds_all_cumplimiento, 500);

                    //SHOW Footer.
                    D3Utils.prop_height_footer = 50;
                    resize_divs_container();

                    initBtn.select(".txt-footer-button").text("Finalizar");
                    initBtn.property("action", "end");
                });
            }

            g_header_app.select(".title-text").text("Operador: " + Usuario.UserLogged.NombreUnidad);
        }).catch(function (err) {
            console.log(err)
        });
    }
    //comentario


    async function fn_obtener_asignacion_ruta() {
        return AsignacionRuta.fn_obtener_asignacionRuta().then(function (result: any) {
            if (result) {
                rutaAsignada = result;

                if (rutaAsignada.Salida == null) {
                    initBtn.select(".txt-footer-button").text("Iniciar");
                    initBtn.property("action", "init");
                } else {
                    initBtn.select(".txt-footer-button").text("Salida");
                    initBtn.property("action", "next");
                }

                RutaPuntos.fn_obtener_ruta_puntos(result.IdRuta).then(function (res) {
                    RutaPuntos.fn_get_ruta_data().then(function (response: any) {
                        rutasPunto = response;

                        if (rutasPunto.length > 0) {
                            nextSuc = rutasPunto[0];

                            //SHOW Footer.
                            D3Utils.prop_height_footer = 50;
                            resize_divs_container();

                            //SHOW btn Llegada
                            if (rutaAsignada.Salida && !nextSuc.FechaLlegada) {
                                initBtn.style("display", "none");
                                fn_show_assist_button();

                                fn_set_destination_bounds();
                            }
                        } else {//Validar si esto es necesario
                            // nextSuc = RutaPuntos.RutaBase;
                            // fn_show_assist_button();
                            // startWorkerPointsLocation();

                            console.log("No hay mas puntos Ruta");
                        }
                    });
                }).catch(function (err) {
                    console.log(err)
                });
            }

            return result;
        });
    }

    function fn_load_interface() {
        // Iniciar con prop_height_footer en tamaño: 0;
        if (MainPage._template == null) {
            MainPage._template = Template.fun_main({
                el_content: MainPage.prop_contenedor_principal
                , prop_height_footer: 0 //D3Utils.prop_height_footer
                , prop_height_header: D3Utils.prop_height_header
                , prop_orientation: "portrait"
            });

            MainPage.prop_content_template = MainPage._template.fun_get_g_content();
        }

        //set Sizes
        wth_screen = MainPage._template.fun_get_width();
        hgt_screen_container = Math.floor(MainPage._template.fun_get_height_content());//fun_get_height_content()-> No considera el pie de pagina :(

        prop_svg_app_map = MainPage.prop_content_template;

        //Init Maps
        initMaps();

        //Init Screen
        fn_load_screen_app();
    }


    function fn_load_screen_app() {
        //Header
        g_header_app = MainPage._template.fun_get_g_header().append(() => D3Utils.fn_crear_encabezado().node());;
        g_header_app.select(".title-text").text("Unidad: " + "Unidad movil");

        //Menú
        svgMain = d3.select(MainPage._template.prop_element).select(".plantilla-svg-parent");
        fn_CrearMenu();
        g_header_app.select(".g_flecha_header").call(D3Utils.eventos.fun_agregar_click, () => {
            menu.fn_Mostrar();
        });

        g_header_app.select(".g_more_header").call(D3Utils.eventos.fun_agregar_click, () => {
            MenuOpciones.fn_mostrar_ocultar_opciones(svgMain);
        });

        fn_loadFooter();

        fn_show_button_my_location();
    }
    export function fn_CrearMenu(): Menu.iControlObject {
        menu = Menu.fn_Init({
            content: svgMain,
            width: MainPage._template.fun_get_width(),
            height: MainPage._template.fun_get_height_content(),
            nombreUsuario: "usuario",
            email: "usuario@hotmail.com",
            fn_ClickMismoMenu: (hash: string) => {
                if (hash == "CSN")
                    setTimeout(() => {
                        dialogs.show_confirm_dialog("Cerrar Sesión", "Se abandonará el seguimiento de rutas", dialogs.fn_salir);
                    }, 400);
                else if (hash == "CHT") {
                    dialogs.show_alert_dialog("Recordatorio de entrega", "Te restan" + 2 + "hrs 35 min para finalizar la entrega");
                }
            }
        });

        return menu;
    }
    var lmaps: L.Map;
    function initMaps(){
        let mapcenter: L.LatLngExpression = [25.656738, -100.394481];
        let _container = MainPage._template.prop_element.getElementsByClassName('container');
        let div_map = d3.select(_container[0]).append("div")
        .attr("id",'map')
        .style("z-index",50)
        .style("height","100%");

        lmaps = L.map(div_map.node()).setView(mapcenter,15);

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

        maxZoom: 18,
        }).addTo(lmaps);
        setTimeout(mark,2000);
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
        }; fn_add_marker(data);
    }

    // function fn_init_map() {
    //     let center_pos = new google.maps.LatLng(22.915835, -101.394571);
    //     var mapOptions: google.maps.MapOptions = {
    //         zoom: 5,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP,
    //         center: center_pos,
    //         disableDefaultUI: true
    //     };

    //     let _container = MainPage._template.prop_element.getElementsByClassName('container');
    //     let div_map = d3.select(_container[0]).append("div")
    //         .style("height", "100%")

    //     map = new google.maps.Map(div_map.node(), mapOptions);

    //     mker_my_position = new google.maps.Marker({
    //         position: center_pos,
    //         map: map,
    //         draggable: false,
    //         icon: D3Utils.get_icon_current_location()
    //     });

    //     fn_set_current_position((res: any) => {
    //         map.setZoom(15);
    //     });
    // }

    function fn_set_current_position(callback?: Function) {
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
                    icon: D3Utils.get_icon_current_location()
                });
            } else
                mker_my_position.setPosition(pos);

            if (callback)
                callback(mker_my_position.getPosition())
        }, function (err) {
            console.log(err)
            MainPage.fn_show_message("Error: location GPS not working!");
        });
    }

    function fn_loadFooter() {
        if (g_footer_content == null)
            g_footer_content = MainPage._template.fun_get_g_footer().append(() => D3Utils.fn_crear_piedepagina(fn_show_info_next_sucursal).node());
        if (g_footer_content_buttons == null)
            g_footer_content_buttons = g_footer_content.select(".g_content_footer").attr("height", 50);

        //for Init Button
        initBtn = g_footer_content_buttons.append(() => D3Utils.fn_crear_footer_button("Iniciar").node())
            .attr("transform", "translate(" + (D3Utils._width_footer_container / 2 - D3Utils._width_footer_button / 2) + "," + 8 + ")")
            .classed("select-button", true)
            .property("setPrevent", true)
            .call(D3Utils.eventos.fun_agregar_click, () => {
                if (initBtn.property("action") == "end") {
                    fn_marcar_regreso();
                } else if (map && rutasPunto.length > 0) {
                    g_btn_current_location.property("isBlock", true)
                    initBtn.style("display", "none");

                    if (initBtn.property("action") == "init") {
                        fn_marcar_inicio();
                    } else if (initBtn.property("action") == "cedis") {
                        fn_marcar_salida();
                    } else if (initBtn.property("action") == "next") {
                        fn_marcar_salida();
                    }
                }
            });
    }

    function fn_marcar_inicio() {
        AsignacionRuta.fn_marcar_salida(rutaAsignada.IdAsignacion).then((resultInit: any) => {

            var resInit = resultInit.MarcarSalidaRegresoResult;
            if (resInit == 1 || resInit == -2) {//-2 : Ya se marco salida
                rutaAsignada.Salida = (new Date()).toISOString();
                AsignacionRuta.fn_set_asignacion_ruta(rutaAsignada);
                initBtn.select(".txt-footer-button").text("Salida");
                initBtn.property("action", "next");


                //CASO FARMACIAS . . . (MARCAR Llegada y salida del primer punto).
                //MARCAR LLEGADA.
                AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, true).then((resultBecome: any) => {
                    let resBecome = resultBecome.MarcarLlegadaSalidaResult;
                    if (resBecome > 0 || resBecome == -2) {
                        nextSuc.FechaLlegada = (new Date()).toISOString();
                        RutaPuntos.fn_set_ruta_punto(nextSuc);

                        /// MARCAR SALIDA
                        AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, false).then((resultWayout: any) => {//Marcar Salida.
                            var resOut = resultWayout.MarcarLlegadaSalidaResult;
                            if (resOut == 1 || resOut == -3) {
                                fn_update_fecha_salida(resOut).then(function (response) {
                                    fn_show_assist_button();

                                    nextSuc = rutasPunto[0];
                                    fn_set_destination_bounds();

                                    setTimeout(startWorkerPointsLocation, 30000);
                                });
                            } else {
                                initBtn.style("display", "block");
                                becomeBtn.style("display", "none");
                                assistBtn.style("display", "none");
                            }
                        });
                    } else {
                        fn_show_assist_button();
                        setTimeout(startWorkerPointsLocation, 30000);
                    }
                });
            } else {
                MainPage.fn_show_message("Ocurrió un error al iniciar intentelo mas tarde!");
                initBtn.style("display", "block");
            }
        });
    }

    function fn_marcar_regreso() {
        //Marcar Salida del punto final y enseguida marcar el regreso de la asignacion.
        AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, RutaPuntos.RutaBase.IdPunto, false).then((result: any) => {
            var res = result.MarcarLlegadaSalidaResult;
            if (res == 1 || res == -3) {
                RutaPuntos.RutaBase.FechaSalida = (new Date()).toISOString();
                RutaPuntos.fn_set_ruta_punto(RutaPuntos.RutaBase);

                AsignacionRuta.fn_marcar_regreso(rutaAsignada.IdAsignacion).then((result: any) => {
                    let res = parseInt(result.MarcarSalidaRegresoResult);
                    if (res == 1 || res == -3) {
                        localStorage.removeItem('toFinalize');

                        RutaPuntos.fn_remove_data_store();
                        setTimeout(AsignacionRuta.fn_remove_asignacion_ruta, 700);//Esperar antes de eliminar Asignacion.
                        rutasPunto = [];
                        rutaAsignada = {} as Entidades.IAsignacionRuta;
                        fn_delete_markers();

                        initBtn.select(".txt-footer-button").text("Iniciar");
                        initBtn.property("action", "init");

                        g_btn_current_location.property("isBlock", false)
                        fn_show_button_my_location();

                        //HIDE
                        D3Utils.prop_height_footer = 0;
                        resize_divs_container();

                        setTimeout(startWorkerAsignaciones, 30000);//Start Worker..
                    } else {
                        MainPage.fn_show_message("Ocurrió un error: Regreso, intentelo mas tarde!")
                        initBtn.style("display", "block");
                    }
                });
            } else {
                MainPage.fn_show_message("Ocurrió un error: Salida, intentelo mas tarde!")
                initBtn.style("display", "block");
            }
        });
    }

    function fn_marcar_salida() {
        AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, false).then((result: any) => {
            var res = result.MarcarLlegadaSalidaResult;
            if (res == 1 || res == -3) {// -3(MarcarLlegadaSalida) : Ya se marco salida
                fn_update_fecha_salida(res).then(function (response) {
                    fn_add_marker(nextSuc);//UPDATE MARKER 

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
            } else {
                MainPage.fn_show_message("Ocurrió un error al iniciar intentelo mas tarde!");
                initBtn.style("display", "block");
            }
        });
    }

    async function fn_update_fecha_salida(res: number) {
        g_btn_current_location.style("display", "none");

        return new Promise((resolve, reject) => {
            // if (res == 1) {
            nextSuc.FechaSalida = (new Date()).toISOString();
            RutaPuntos.fn_set_ruta_punto(nextSuc).then(() => {
                return RutaPuntos.fn_get_ruta_data();
            }).then(result => { //After update list Routes
                rutasPunto = result;//Update rutasPunto

                resolve(1);
            }).catch(err => {
                reject(err);
            });
            // } else {
            //     resolve(1);
            // }
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
            var icon = D3Utils.get_icon_marker('black');

            mker_destination = new google.maps.Marker({
                position: dest,
                map: map,
                icon: icon
            });
        } else {
            mker_destination.setPosition(dest);
        }

        var bounds = new google.maps.LatLngBounds();
        bounds.extend(mker_my_position.getPosition());
        bounds.extend(dest);

        map.fitBounds(bounds);

        //Show Info Destination.
        let info_window = new google.maps.InfoWindow({
            content: "<div><strong>" + nextSuc.NombreSitio + "</strong></div><span>No. #" + nextSuc.Orden + "</span>"
        });
        info_window.open(map, mker_destination);
        mker_destination.addListener('click', () => {
            info_window.open(map, mker_destination);
        });
    }

    function fn_add_marker(data: any) {
        //let location = new google.maps.LatLng(data.Latitud, data.Longitud);
        let icon;

        if (data.FechaLlegada && data.FechaSalida) {
            let dtLlegada = new Date(data.FechaLlegada);
            let dtSalida = new Date(data.FechaSalida);
            let diff = dtSalida.getTime() - dtLlegada.getTime();
            diff = Math.trunc(diff / 60000);
            let _color = diff > D3Utils.visit_time ? 'orange' : 'green';

            //icon = D3Utils.get_icon_marker(_color);
         } //else if (!data.FechaLlegada && !data.FechaSalida)
        //     icon = D3Utils.get_icon_marker('red');
        // else
        //     icon = D3Utils.get_icon_marker('orange');
        let texts = {
            text1: "12:10:06",
            text2: "15:10:06",
            text3: "10 min"
        };
        //"<svg transform='translate(18,18)' width='190' height='20' xmlns='http://www.w3.org/2000/svg' version='1.1'><rect x='0' y='0' width='190' height='20' rx='10' fill='blue'></rect></svg>";
        let color = 'red';
        var svgrect = "<svg transform='translate(" + (-20 / MainPage._template.fun_get_scale()) + ",18)' width='190' height='20' xmlns='http://www.w3.org/2000/svg' version='1.1'><rect x='0' y='0' width='190' height='20' rx='10' fill=" + color + "></rect></svg>";
        let suc = "Elevenminds";
        let buttonn = {
            bton: 'button1',
            bton2: 'button2',
            bton3: 'button3'
        }

        var customPopup = "<center>" + suc + "<span><br>Hora llegada: " + texts.text1 + "<br>Hora salida: " + texts.text2 + "<br>Tiempo visita: " + texts.text3 + "</span></center> <button type='button' class='button " + buttonn.bton3 + "'>llegas tarde </button>";

        var customOptions =
        {
            'maxWidth': 150,
            'className': 'custom'


        }
        L.marker([25.652156, -100.389240]).bindPopup(customPopup, customOptions).addTo(lmaps);

        // var marker = new google.maps.Marker({
        //     position: location,
        //     map: map,
        //     icon: icon
        // });

        // marker.set('data', data);
        // marker.addListener('click', function () {
        //     map.panTo(marker.getPosition());
        //     map.setCenter(marker.getPosition());

        //     fn_draw_info_window(marker);
        //     setTimeout(() => {
        //         let posXY = getPosXYfromLatLng(marker.getPosition());
        //         g_info_window.transition()
        //             .attr("transform", "translate(" + posXY.x + ", " + posXY.y + ")");
        //     }, 1000);
        // });

        // mkers_asignaciones.push(marker);
    }

    function fn_delete_markers() {
        for (var i = 0; i < mkers_asignaciones.length; i++) {
            mkers_asignaciones[i].setMap(null);
        }
        mkers_asignaciones = [];
    }

    function fn_show_assist_button() {
        if (assistBtn == null) {
            assistBtn = g_footer_content_buttons.append(() => D3Utils.fn_crear_footer_button("Iniciar asistencia").node())
                .call(D3Utils.eventos.fun_agregar_click, () => {
                    fn_click_btn_asistente();
                });
        } else {
            assistBtn.style("display", "block");
        }

        assistBtn.attr("transform", "translate(" + (D3Utils._width_footer_container / 2 - D3Utils._width_footer_button / 2) + "," + 8 + ")")
    }

    function fn_click_btn_asistente() {
        MainPage.fn_open_maps_assist(nextSuc.Latitud, nextSuc.Longitud);
    }

    function fn_show_become_button() {
        if (becomeBtn == null) {
            becomeBtn = g_footer_content_buttons.append(() => D3Utils.fn_crear_footer_button("Llegada").node())
                .attr("transform", "translate(5," + 8 + ")")
                .call(D3Utils.eventos.fun_agregar_click, () => {
                    becomeBtn.style("display", "none");

                    // if (nextSuc.IdPunto == rutasPunto[rutasPunto.length - 1].IdPunto)//RutaPuntos.RutaBase.IdPunto)//(rutasPunto.length > 0)//(nextSuc.Orden < rutasPunto.length)
                    //     fn_marcar_regreso();
                    // else
                    fn_marcar_llegada();
                });
        } else {
            becomeBtn.style("display", "block");
        }

        assistBtn.attr("transform", "translate(" + (5 + D3Utils._width_footer_button + 5) + "," + 8 + ")")
    }

    function fn_marcar_llegada() {
        fn_delete_markers();

        AsignacionRuta.fn_marcar_llegada_salida(rutaAsignada.IdAsignacion, nextSuc.IdPunto, true).then((result: any) => {
            let res = result.MarcarLlegadaSalidaResult;

            if (res > 0 || res == -2) {
                initBtn.style("display", "block");
                becomeBtn.style("display", "none");
                assistBtn.style("display", "none");

                nextSuc.FechaLlegada = (new Date()).toISOString();
                RutaPuntos.fn_set_ruta_punto(nextSuc);

                if (rutasPunto.length > 1 && rutasPunto[1].IdPunto == RutaPuntos.RutaBase.IdPunto) {//if it is the last visit
                    initBtn.select(".txt-footer-button").text("Ruta Cedis");
                    initBtn.property("action", "cedis");
                }

                if (nextSuc.IdPunto == RutaPuntos.RutaBase.IdPunto) {//-Ultimo punto => Ruta Base.
                    fn_bounds_all_cumplimiento();

                    initBtn.select(".txt-footer-button").text("Finalizar");
                    initBtn.property("action", "end");
                    localStorage.setItem('toFinalize', 'true');
                } else {//Cuando es el ultimo punto, de regreso a la base!
                    fn_add_marker(nextSuc);
                }
            } else {
                MainPage.fn_show_message("Ocurrió un error en la llegada, intentelo mas tarde!")
                becomeBtn.style("display", "block");
            }
        });
    }

    function fn_bounds_all_cumplimiento() {
        AsignacionRuta.fn_obtener_asignacion_cumplimiento(rutaAsignada.IdAsignacion).then((resCumplimiento: any) => {
            var cumplimiento: Array<Entidades.IAsignacionCumplimiento> = resCumplimiento.ObtenerAsignacionCumplimientoResult || [];
            if (cumplimiento.length > 0) {
                RutaPuntos.fn_get_all_rutas().then((result: any) => {
                    fn_delete_markers();

                    if (result && result.length > 0) {
                        result.forEach((item: any) => {
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
                .call(D3Utils.eventos.fun_agregar_click, () => {
                    fn_set_current_position();
                });

            g_btn_current_location.append("path").attr("fill", D3Utils.prop_color_acent)
                .attr("transform", "translate(7, 7) scale(0.65)")
                .style("pointer-events", "none")
                .attr("d", "M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm17.88 6c-.92-8.34-7.54-14.96-15.88-15.88v-4.12h-4v4.12c-8.34.92-14.96 7.54-15.88 15.88h-4.12v4h4.12c.92 8.34 7.54 14.96 15.88 15.88v4.12h4v-4.12c8.34-.92 14.96-7.54 15.88-15.88h4.12v-4h-4.12zm-17.88 16c-7.73 0-14-6.27-14-14s6.27-14 14-14 14 6.27 14 14-6.27 14-14 14z");
        } else {
            g_btn_current_location.style("display", "block");
        }
    }

    export function fn_hide_dashboard() {
        d3.select(MainPage._template.prop_element).style("display", "none");
    }

    function fn_show_info_next_sucursal() {
        if (d3.event.defaultPrevented) return;

        if (showDetailSucursal)
            D3Utils.prop_height_footer = 50;
        else
            D3Utils.prop_height_footer = 150;

        resize_divs_container();
        D3Utils.fn_actualizar_pie_pagina(g_footer_content, !showDetailSucursal);

        showDetailSucursal = !showDetailSucursal;

        if (showDetailSucursal) {
            // g_footer_content_buttons.style("display", "none");
            fn_show_info();
        } else {
            // g_footer_content_buttons.style("display", "block");
            g_footer_content_info.style("display", "none");
        }
    }

    function resize_divs_container() {
        MainPage._template.prop_config.prop_height_footer = D3Utils.prop_height_footer;
        Template.fun_on_change_container_size(MainPage._template);

        hgt_screen_container = Math.floor(MainPage._template.fun_get_height_content() - D3Utils.prop_height_footer);//fun_get_height_content()-> No considera el pie de pagina :(
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

            //Insertar Textos
            g_footer_content_info.append("text")
                .text("Información de Farmacias")
                .attr("x", _hg_content / 2)
                .attr("y", "20")
                .style("fill", D3Utils.prop_color_primary)
                .style("font-size", "16")
                .attr("text-anchor", "middle")
                .style("font-weight", "bold");

            g_footer_content_info.append("text")
                .text("Nº de sitios:")
                .attr("x", _hg_content / 2 - 5)
                .attr("y", "45")
                .style("fill", D3Utils.prop_color_primary)
                .attr("text-anchor", "end")
                .style("font-size", "15");

            g_footer_content_info.append("text")
                .text("Proxima sucursal:")
                .attr("x", _hg_content / 2 - 5)
                .attr("y", "65")
                .style("fill", D3Utils.prop_color_primary)
                .attr("text-anchor", "end")
                .style("font-size", "15");

            g_footer_content_info.append("text")
                .text("Dirección:")
                .attr("x", _hg_content / 2 - 5)
                .attr("y", "86")
                .style("fill", D3Utils.prop_color_primary)
                .attr("text-anchor", "end")
                .style("font-size", "15");

            //Dinamyc text
            g_footer_content_info.append("text")
                .classed("footer-num-info", true)
                .attr("x", _hg_content / 2 + 5)
                .attr("y", "45")
                .style("fill", D3Utils.prop_color_primary)
                .attr("text-anchor", "start")
                .style("font-size", "15");

            g_footer_content_info.append("text")
                .classed("footer-next-info", true)
                .attr("x", _hg_content / 2 + 5)
                .attr("y", "65")
                .style("fill", D3Utils.prop_color_primary)
                .attr("text-anchor", "start")
                .style("font-size", "15");

            g_footer_content_info.append("text")
                .classed("footer-address-info", true)
                .attr("x", _hg_content / 2 + 5)
                .attr("y", "82")
                .style("fill", D3Utils.prop_color_primary)
                .attr("text-anchor", "start")
                .style("font-size", "15");

        } else {
            g_footer_content_info.style("display", "block");
        }

        fn_fill_info_suc();
    }

    function fn_fill_info_suc() {
        RutaPuntos.fn_count_clv('IdPunto').then((res: number) => {
            let _total = res;
            if (!D3Utils.consider_base_route)
                _total = res - 1;

            g_footer_content_info.select(".footer-num-info")
                .text(_total);
        });
        g_footer_content_info.select(".footer-next-info")
            .text(nextSuc.NombreSitio);

        //Fill Address
        if (!nextSuc.Latitud || !nextSuc.Longitud)
            return;

        let lat = nextSuc.Latitud;
        let lng = nextSuc.Longitud;
        if (direccionUbicacion && direccionUbicacion.lat == lat && direccionUbicacion.lng == lng) {
            fn_fill_address();
        } else {
            fn_address_from_latlng(lat, lng);
        }
    }

    function fn_address_from_latlng(lat: number, lng: number) {
        RutaPuntos.fn_get_address(lat, lng).then(function (result: any) {
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

        D3Utils.fun_limitar_texto(g_footer_content_info.select(".footer-next-info"), (wth_screen - 50) / 2, 0, "...");
        D3Utils.wrap(g_footer_content_info.select(".footer-address-info"), (wth_screen - 45) / 2, 15, "...", 3);
    }

    function fn_draw_info_window(marker: google.maps.Marker) {
        // let cc = General.latLng2Point(map, marker.getPosition());

        //Container full screen
        if (g_full_info_content == null) {
            g_full_info_content = svgMain.append("g")
                .style("pointer-events", "all");

            g_full_info_content.append("rect")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", MainPage._template.fun_get_width())
                .attr("height", MainPage._template.fun_get_height_content() + MainPage._template.fun_get_height_header() + MainPage._template.fun_get_height_footer())
                .style("fill", "#000000")
                .style("opacity", "0");

            g_full_info_content.call(D3Utils.eventos.fun_agregar_click, () => {
                fn_remove_window_info_content();
            });
        } else {
            g_full_info_content.style("display", "block")
        }

        let obj = marker.get('data');
        if (!obj)
            return;

        let dtLlegada,
            dtSalida;
        let _tiempoVisita = " - ",
            _hrLlegada = " - ",
            _hrSalida = " - ",
            _status = "No visitado",
            _color = "red",
            diff: number = 0;

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
            _status = diff > D3Utils.visit_time ? "Tarde" : "A tiempo"
            _color = diff > D3Utils.visit_time ? 'orange' : 'green';
        }

        let texts = [
            "N. Sucursal:", obj.Orden,
            "Hora llegada:", _hrLlegada,
            "Hora salida:", _hrSalida,
            "Tiempo visita:", _tiempoVisita,
            _status
        ];

        // _x = cc.x * MainPage._template.fun_get_scale(),
        // _y = cc.y * MainPage._template.fun_get_scale();

        // _y += D3Utils.prop_height_header;

        // _x = _x - (_wth_content_info / 2);
        // _y = _y - _hgt_content_info - 30;//- hgt marker;
        let posXY: any = getPosXYfromLatLng(marker.getPosition());

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
            .attr('fill', D3Utils.prop_color_primary)
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
                if (i == texts.length - 1) return _wth_content_info / 2;

                if (i % 2 == 0) return 10;
                else return 105;
            })
            .attr("y", function (d, i) {
                if (i == texts.length - 1)
                    return 94.5;

                let mod2 = Math.trunc((i + 1) / 2)
                if (i % 2 == 0)
                    return (mod2 + 1) * 18;
                else
                    return mod2 * 18;
            })
            .text(function (d, i) {
                return d;
            });
    }

    function getPosXYfromLatLng(pos: google.maps.LatLng): any {
        let cc = General.latLng2Point(map, pos);
        let _x = cc.x * MainPage._template.fun_get_scale(),
            _y = cc.y * MainPage._template.fun_get_scale();

        _y += D3Utils.prop_height_header;

        _x = _x - (_wth_content_info / 2);
        _y = _y - _hgt_content_info - 30;//- hgt marker;

        return { x: _x, y: _y };
    }

    function fn_remove_window_info_content() {
        if (g_info_window != null) {
            g_info_window.remove();
            g_full_info_content.style("display", "none");
        }
    }

    function fn_find_nearby_routes(latLng: google.maps.LatLng) {
        rutasPunto.forEach(punto => {//rutasPunto -> contiene los pendientes por visitar.
            fn_valid_distance_point_location(latLng, punto);
        });
    }

    function fn_valid_distance_point_location(latLng: google.maps.LatLng, punto: any) {
        let latlngPunto = new google.maps.LatLng(punto.Latitud, punto.Longitud);
        var distance = Math.trunc(google.maps.geometry.spherical.computeDistanceBetween(latLng, latlngPunto));

        if (distance <= D3Utils.max_distance_beetween_points) {
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


    //######################################################    
    //Custom Worker Service
    //######################################################

    var wkerPointsLocation: Worker;
    function startWorkerPointsLocation() {
        if (typeof (Worker) !== "undefined") {
            if (typeof (wkerPointsLocation) == "undefined") {
                wkerPointsLocation = new Worker("js/data/WorkerPuntosRuta.js");
            }

            wkerPointsLocation.onmessage = function (event) {
                fn_set_current_position(fn_find_nearby_routes);
                // locationFake(Test.simulate_positions[Test.last_position]);
            };
        } else {
            alert("Sorry, your browser does not support Web Workers...");
        }
    }

    function stopWorkerPointsLocation() {
        if (wkerPointsLocation) {
            wkerPointsLocation.terminate();
            wkerPointsLocation = undefined;
        }
    }


    var wkerAsignaciones: Worker;
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
            }
        } else {
            alert("Sorry! your browser does not support Web Workers");
        }
    }

    function stopWorkerAsignaciones() {
        if (wkerAsignaciones) {
            wkerAsignaciones.terminate();
            wkerAsignaciones = undefined;
        }
    }

    //######################################################    
    //Remove all Elements
    //######################################################
    export function fn_destroy() {
        MainPage._template.prop_element.remove();
        MainPage._template = null;
        g_footer_content = null;
        g_footer_content_buttons = null;
        g_btn_current_location = null;
        g_footer_content_info = null;
        D3Utils.prop_height_footer = 50;
        showDetailSucursal = false;
        assistBtn = null;
        becomeBtn = null;

        stopWorkerAsignaciones();
        stopWorkerPointsLocation();
    }

    export function fn_show_dashboard() {
        if (MainPage._template) {
            d3.select(MainPage._template.prop_element).style("display", "block");//Show Dashboard
        }
    }

}