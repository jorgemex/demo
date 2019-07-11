import * as d3 from 'd3';
import { Input } from '../controles/control_svg_input';
import { D3Utils } from '../general/Utils';
import { MainPage } from '../MainPage';
import { Dashboard } from './dashboard';
import { Usuario } from '../data/Usuario';
import { Main } from '../Main';

export namespace Login {
    export let prop_inputUsuario: Input.iObjetoControl = null;
    export let prop_inputPassword: Input.iObjetoControl = null;
    let prop_ejecutandoLogin: boolean = false;
    let g_content_check_showpass: d3.Selection<any, any, any, any> = null;
    let g_content_check_savepass: d3.Selection<any, any, any, any> = null;

    let check_fill_showpass: d3.Selection<any, any, any, any>;
    let check_fill_savepass: d3.Selection<any, any, any, any>;
    let txt_input_pass_value: d3.Selection<any, any, any, any>;
    let text_error_login: d3.Selection<any, any, any, any>;

    var pos_y_select_input: number = 0;

    export function fn_crearLogin(): d3.Selection<any, any, any, any> {
        let margin_default: number = 25,
            wth_screen_with_margin: number = MainPage.prop_template_login.fun_get_width() - (2 * margin_default),
            hgt_1_quarter = MainPage.prop_template_login.fun_get_height_content() / 4,
            hgt_parent = MainPage.prop_template_login.fun_get_height_content();

        let g_main_container = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        g_main_container.classed("svg_frmLogin", true)
            .attr("transform", "translate(" + margin_default + ", 0)");

        //Header Image
        let g_header_login = g_main_container.append("g")
            .attr("transform", "translate(0, 0)");

        g_header_login.append("image")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", wth_screen_with_margin)
            .attr("height", hgt_1_quarter)
            .attr("xlink:href", "images/logo-innovalinks.png");

        //Container DATA
        let hgt_input = 35;
        let sum_sizes = hgt_1_quarter + 50;

        let g_general = g_main_container.append("g")
            .attr("transform", "translate(0, " + sum_sizes + ")");

        //Group User
        let g_container_user = g_general.append("g");

        g_container_user.append("rect")
            .attr("height", hgt_input)
            .attr("width", hgt_input)
            .style("fill", "#EDEDED");
        g_container_user.append("image")
            .attr("width", hgt_input)
            .attr("height", hgt_input)
            .attr("xlink:href", "images/ic_user.png");

        prop_inputUsuario = Input.fun_main({
            prop_height: hgt_input,
            prop_width: (MainPage.prop_template_login.fun_get_width() - 50 - hgt_input),
            prop_stroke: "#CACACA",
            prop_stroke_width: 0.5,
            prop_placeholder: "Usuario",
            prop_padding: { prop_left: 15, prop_right: 15 },
            prop_configText: { prop_size_text: 20, prop_font_family: D3Utils.D3Font.prop_font, prop_weight: "normal", prop_color: "black" },
            prop_events: {
                focus: () => {
                    let rect_input_user: any = prop_inputUsuario.prop_element.getBoundingClientRect();
                    pos_y_select_input = rect_input_user.y;
                },
                keyDown: (e) => {
                    if (e.keyCode == 13) {
                        prop_inputPassword.fun_focus();
                    }
                },
                input: (puntero_posicion) => { }
            }
        });

        g_container_user.append(() => prop_inputUsuario.prop_element).attr("transform", "translate(" + hgt_input + ",0)");

        //Group password
        let g_container_pass = g_general.append("g")
            .attr("transform", "translate(0, " + (hgt_input + 10) + ")");

        g_container_pass.append("rect")
            .attr("height", hgt_input)
            .attr("width", hgt_input)
            .style("fill", "#EDEDED");
        g_container_pass.append("image")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", hgt_input)
            .attr("height", hgt_input)
            .attr("xlink:href", "images/ic_pass.png");


        prop_inputPassword = Input.fun_main({
            prop_height: hgt_input,
            prop_width: (MainPage.prop_template_login.fun_get_width() - 50 - hgt_input),
            prop_stroke: "#CACACA",
            prop_stroke_width: 0.5,
            prop_placeholder: "Contraseña",
            prop_tipo: "password",
            prop_padding: { prop_left: 15, prop_right: 15 },
            prop_configText: { prop_size_text: 20, prop_font_family: D3Utils.D3Font.prop_font, prop_weight: "normal", prop_color: "black" },
            prop_events: {
                focus: () => {
                    let rect_input_pass: any = prop_inputPassword.prop_element.getBoundingClientRect();
                    let isRezized = pos_y_select_input > 0;
                    pos_y_select_input = rect_input_pass.y;
                },
                keyDown: (e) => {
                    if (e.keyCode == 13) {
                        prop_inputPassword.fun_focus_out();
                    }
                }
            }
        });

        g_container_pass.append(() => prop_inputPassword.prop_element).attr("transform", "translate(" + hgt_input + ",0)");
        //END group Pass


        //CheckBox
        let pos_g_check1 = 2 * (hgt_input + 15);
        g_content_check_showpass = g_general.append(() => createRadioButton("Mostrar caracteres de la contraseña").node())
            .attr("transform", "translate(0, " + pos_g_check1 + ")")
            .call(D3Utils.eventos.fun_agregar_click, () => {

                if (d3.event.defaultPrevented) return;

                Input.fun_input_out();
                if (!check_fill_showpass)
                    check_fill_showpass = g_content_check_showpass.select(".check-rect-fill");

                let _showPass = check_fill_showpass.style("display") == "none" ? "block" : "none";
                check_fill_showpass.style("display", _showPass);

                //Show Hide Pass
                if (!txt_input_pass_value)
                    txt_input_pass_value = d3.select(prop_inputPassword.prop_element).select(".txt-input-value");

                txt_input_pass_value.style("-webkit-text-security", _showPass == "block" ? "none" : "disc");
            });

        pos_g_check1 += 35;
        g_content_check_savepass = g_general.append(() => createRadioButton("Recordar contraseña").node())
            .attr("transform", "translate(0, " + pos_g_check1 + ")")
            .call(D3Utils.eventos.fun_agregar_click, () => {
                if (d3.event.defaultPrevented) return;

                Input.fun_input_out();

                if (!check_fill_savepass)
                    check_fill_savepass = g_content_check_savepass.select(".check-rect-fill");

                let active = check_fill_savepass.style("display") == "none" ? "block" : "none";
                check_fill_savepass.style("display", active);
            });
        //END CheckBox

        sum_sizes += pos_g_check1 + 75;

        // sum_sizes = 3 * hgt_1_quarter;
        //text error
        text_error_login = g_main_container.append("text")
            .classed("text_login_error", true)
            .attr("y", sum_sizes - 15)
            .attr("x", "45%")
            .style("display", "none")
            .style("fill", "#e60000")
            .style("font-size", "18")
            .text("Datos incorrectos")
            .classed("centerText", true);

        //·················
        //CONTAINER Buttons
        let g_container_button = g_main_container.append("g")
            .attr("transform", "translate(0, " + sum_sizes + ")");

        let wth_button_login = wth_screen_with_margin;
        let hgt_button_login = 40;

        let ggg = g_container_button.append("g")
            .attr("transform", "translate(0, 0)")
            .classed("centerText", true);;

        let button2 = ggg.append("g")
            .style("fill", D3Utils.prop_color_primary)
            .attr("width", wth_button_login)
            .attr("height", hgt_button_login);

        button2.append('rect')
            .classed("select-button", true)
            .property("setPrevent", true)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", wth_button_login)
            .attr("height", hgt_button_login)
            .attr('rx', 5)
            .attr('ry', 5)
            .call(D3Utils.eventos.fun_agregar_click, () => {
                if (d3.event.defaultPrevented) return;

                if (!prop_ejecutandoLogin) {
                    if (fn_validarCampos(prop_inputUsuario.fun_value(), prop_inputPassword.fun_value())) {
                        Input.fun_input_out();
                        text_error_login.style("display", "none");
                        prop_ejecutandoLogin = true;

                        fn_consultarLogin(prop_inputUsuario.fun_value(), prop_inputPassword.fun_value());
                    } else {
                        text_error_login.style("display", "block")
                            .text("Campos vacios");
                    }
                }
            });

        button2.append("text")
            .attr("y", hgt_button_login / 2)
            .attr("x", wth_button_login / 2)
            .style("fill", "#FFFFFF")
            .style("font-size", "18")
            .text("Iniciar Sesión")
            .style("pointer-events", "none")
            .classed("centerText", true);
        //END Buttons

        sum_sizes += hgt_button_login;
        if (sum_sizes > hgt_parent) {
            g_main_container.attr("transform", "translate(" + margin_default + ", 0)");
            // MainPage.prop_template_login.prop_element.scroll();//Set SCROLL
        } else {
            g_main_container.attr("transform", "translate(" + margin_default + ", " + (hgt_parent - sum_sizes) / 2 + ")");
        }

        return g_main_container;
    }

    // Set Pos Y When keyboard is shown
    d3.select(window).on("resize.AppTemplate", () => {
        var size_result = window.innerHeight;

        let move_to_pos = 0;
        if (pos_y_select_input > size_result - 120) {
            move_to_pos = (pos_y_select_input - (size_result - 120));
        }

        MainPage.prop_template_login.fun_get_g_content().attr("transform", "translate(0, " + (-move_to_pos) + ")");
        pos_y_select_input = move_to_pos;
    });

    function createRadioButton(title_check: string): d3.Selection<any, any, any, any> {
        let g_container_check = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        g_container_check.append("rect")
            .classed("check-rect-stroke", true)
            .attr("width", "24")
            .attr("height", "24")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("fill", "gray")
            .attr("opacity", 0.15);

        g_container_check.append("rect")
            .classed("check-rect-fill", true)
            .style("display", "none")
            .attr("x", "2")
            .attr("y", "2")
            .attr("width", "20")
            .attr("height", "20")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("fill", D3Utils.prop_color_acent);

        g_container_check.append("path")
            .attr("d", "M4 4 L2 6 L8 12 L18 2 L16 0 L8 8")
            .attr("fill", "white")
            .attr("transform", "translate(2,6)");

        g_container_check.append("text")
            .classed("check-text", true)
            .attr("x", "30")
            .attr("y", "18")
            .style("fill", "gray")
            .style("font-size", "16")
            .text(title_check);

        return g_container_check;
    }

    export function fn_asignarDatosLogin(usuario: string, password: string) {
        prop_inputUsuario.fun_value(usuario);
        prop_inputPassword.fun_value(password);
    }

    function fn_validarCampos(user: string, password: string): boolean {
        let valido = false;
        if (user.trim() != "" && password.trim() != "")
            valido = true;
        return valido;
    }

    function fn_recordar(): boolean {
        let recordar: boolean = false;
        recordar = g_content_check_savepass.select(".check-rect-fill").style("display") != "none";
        return recordar;
    }


    function fn_logearse(result: number, data: any) {
        if (result > 0) {
            Main.InitDB().then(function (result) {//Init DB
                if (fn_recordar()) {
                    MainPage.fn_save_user_data(data);//Save Local or Mbile data

                    Usuario.fn_save_user_data(data).then(function (result) {
                        return Usuario.fn_get_user_data(); //For SaveData in Memory
                    }).then(function(res){
                        Dashboard.fn_init_dashboard();
                    });
                }

                prop_inputUsuario.fun_value("");
                prop_inputPassword.fun_value("");

                window.location.assign("#DsH");//asignar location                        
                MainPage.prop_template_login.prop_element.setAttribute("style", "display: none;");

                //Guardar en la memoria y Mostrar Dashboard
                if (!fn_recordar()) {
                    Usuario.UserLogged = data;
                    Dashboard.fn_init_dashboard();
                }
            });
        } else {
            let error: string = "";
            switch (result) {
                case -1:
                    error = "Error !!!";
                    break;
                case -2:
                    error = "Datos incorrectos";
                    break;
                case -3:
                    error = "Error al procesar inicio de sesión";
                    break;
                default:
                    error = "Error al procesar la conexión";
                    break;

            }

            text_error_login.style("display", "block")
                .text(error);
        }
        prop_ejecutandoLogin = false;
    }

    export function fn_consultarLogin(user: string, password: string) {
        MainPage.prop_cargaLogin.met_mostrar();

        Usuario.fn_login(user.trim(), password).then(function (data: any) {
            let idUsuario = data.IniciarSesionResult.IdUsuario;
            let userData = data.IniciarSesionResult;

            userData.Usuario = user;
            userData.Contrasena = password;

            fn_logearse(idUsuario, userData);

            MainPage.prop_cargaLogin.met_ocultar();
        }).catch(function(err){
            fn_logearse(-100, null);
            MainPage.prop_cargaLogin.met_ocultar();
        });
    }
}