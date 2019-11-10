import { Page, ImageView, statusBar, Composite, TextInput, TextView, ScrollView, device, WebView, ActivityIndicator, contentView } from 'tabris';
import { RollUp } from '../libs/ui';
import rpcmp_api = require('../libs/rpcmp_api');
import { currentStyle, navigationView } from '..';
import { AppPage } from './appPage';

export class LoginPage extends Page {
    constructor() {
        super({ left: 0, right: 0, top: 0, bottom: 0 });

        this
            .onAppear(({ target: page }) => {
                statusBar.displayMode = 'float';
                statusBar.background = 'transparent';
                if (currentStyle.isLightStatusBar) statusBar.theme = 'light';
                else statusBar.theme = 'dark';

                new ImageView({ left: 0, top: 0, image: 'https://i.imgur.com/Wi836cG.png', background: currentStyle.colors.main })
                    .appendTo(page);
                new ImageView({ left: 0, top: 'prev() 0', image: 'https://i.imgur.com/Wi836cG.png', background: currentStyle.colors.main })
                    .appendTo(page);
                new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: '#000', opacity: 0.5 })
                    .appendTo(page);

                new Composite({ left: 25, right: 25, centerY: 0, padding: 25, background: currentStyle.colors.main, cornerRadius: 18 })
                    .append(
                        new TextView({ left: 0, right: 0, text: 'Вход', textColor: currentStyle.colors.opposite, font: 'bold 21px' }),

                        new Composite({ padding: 5, top: 'prev() 25', left: 0, right: 0, background: currentStyle.colors.contrast, cornerRadius: 18 })
                            .append(
                                new TextInput({ id: 'email-input', textColor: currentStyle.colors.opposite, message: 'E-Mail', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 0, style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' })
                            ),
                        new Composite({ padding: 5, top: 'prev() 15', left: 0, right: 0, background: currentStyle.colors.contrast, cornerRadius: 18 })
                            .append(
                                new TextInput({ id: 'password-input', type: 'password', textColor: currentStyle.colors.opposite, message: 'Пароль', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 0, style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' })
                            ),

                        new ScrollView({ top: 'prev() 25', left: 0, right: 0, direction: 'horizontal', scrollbarVisible: false })
                            .append(
                                // E-Mail
                                new Composite({ width: 50, height: 50, cornerRadius: 18, background: currentStyle.colors.moreContrast, highlightOnTouch: true })
                                    .append(
                                        new ImageView({ centerX: 0, centerY: 0, width: 15, image: currentStyle.icons.loginScreen.auth, tintColor: '#fff' })
                                    )
                                    .onTap(() => {
                                        let emailInput = $('#email-input').first(TextInput);
                                        let passwordInput = $('#password-input').first(TextInput);
                                        if (!emailInput.text || !passwordInput.text) {
                                            navigator.vibrate([100, 100, 100]);
                                            if (!emailInput.text) emailInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                            if (!passwordInput.text) passwordInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                        }
                                        else handleAuth({ email: emailInput.text, password: passwordInput.text }, passwordInput.text)
                                            .catch(err => console.error(err));
                                    }),
                                // Google
                                new Composite({ left: 'prev() 25', width: 50, height: 50, cornerRadius: 18, background: currentStyle.colors.moreContrast, highlightOnTouch: true })
                                    .append(
                                        new ImageView({ centerX: 0, centerY: 0, width: 15, image: currentStyle.icons.loginScreen.google, tintColor: '#fff' })
                                    )
                                    .onTap(() => {
                                        window.plugins.googleplus.login({}, cb => {
                                            if (cb) if (cb.accessToken) {
                                                handleAuth({ social: { google: { token: cb.accessToken } } })
                                                    .then(() => window.plugins.googleplus.disconnect())
                                                    .catch(err => console.error(err));
                                            }
                                        }, err => console.error(err));
                                    }),
                                // VK
                                new Composite({ left: 'prev() 25', width: 50, height: 50, cornerRadius: 18, background: currentStyle.colors.moreContrast, highlightOnTouch: true })
                                    .append(
                                        new ImageView({ centerX: 0, centerY: 0, width: 15, image: currentStyle.icons.loginScreen.vk, tintColor: '#fff' })
                                    )
                                    .onTap(() => {
                                        SocialVk.login(['offline'], cb => {
                                            if (cb) {
                                                let data = JSON.parse(cb);
                                                if (data.token) {
                                                    handleAuth({ social: { vk: { token: data.token } } })
                                                        .catch(err => console.error(err));
                                                }
                                                else console.error(data);
                                            }
                                        });
                                    }),
                                // GitHub
                                new Composite({ left: 'prev() 25', width: 50, height: 50, cornerRadius: 18, background: currentStyle.colors.moreContrast, highlightOnTouch: true })
                                    .append(
                                        new ImageView({ centerX: 0, centerY: 0, width: 15, image: currentStyle.icons.loginScreen.github, tintColor: '#fff' })
                                    )
                                    .onTap(() => {
                                        let loader = new ActivityIndicator({ centerX: 0, centerY: 0, width: 80, height: 80, padding: 20, tintColor: currentStyle.colors.moreContrast, background: currentStyle.colors.main, cornerRadius: 18 });
                                        let code = '';

                                        let rollUp = new RollUp({ title: 'Вход через GitHub', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                                            .append(
                                                new WebView({ background: currentStyle.colors.main, left: 25, right: 25, bottom: 25, cornerRadius: 18, height: device.screenHeight * 0.75, url: 'https://github.com/login/oauth/authorize?client_id=71588aeb42511e6d2fca&scope=user' })
                                                    .onLoad.once(() => loader.dispose())
                                                    .on('navigate', (data: any) => {
                                                        let x = (data.url as string).split('/?code=');
                                                        if (x.length > 1) {
                                                            data.preventDefault();
                                                            code = x[1];
                                                            rollUp.close();
                                                            handleAuth({ social: { github: { code: code } } })
                                                                .catch(err => console.error(err));
                                                        }
                                                    }),
                                                loader
                                            )
                                            .onDispose(() => navigator.vibrate([100, 100, 100]));
                                    })
                            ),
                        new TextView({ top: 'prev() 25', alignment: 'centerX', left: 0, right: 0, text: 'Если что, мы создадим новый аккаунт', textColor: currentStyle.colors.opposite, opacity: 0.75 })
                    )
                    .appendTo(page);
            });
    }
}

function handleAuth(values: { email?: string; token?: string; password?: string; social?: { github?: { code: string; }; vk?: { token: string; }, google?: { token: string; } } }, possiblePassword?: string) {
    return new Promise((resolve, reject) => {
        rpcmp_api.users.auth(values)
            .then(data => {
                if (data.type == 'login') {
                    localStorage.setItem('token', data.user.token);
                    localStorage.setItem('name', data.user.name);
                    localStorage.setItem('email', data.user.email);
                    localStorage.setItem('certificates', data.user.certificates.join(','));
                    navigationView.append(new AppPage());
                    resolve();
                }
                else {
                    let regNameInput = new TextInput({ id: 'reg-name-input', textColor: currentStyle.colors.opposite, message: 'Отображаемое имя', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 0, style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' });
                    let regEmailInput = new TextInput({ id: 'reg-email-input', textColor: currentStyle.colors.opposite, message: 'E-Mail', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 0, style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' });
                    let regPasswordInput = new TextInput({ id: 'reg-password-input', type: 'password', textColor: currentStyle.colors.opposite, message: 'Пароль', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 0, style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' });

                    if (data.user.name) regNameInput.text = data.user.name;
                    if (data.user.email) regEmailInput.text = data.user.email;
                    if (possiblePassword) regPasswordInput.text = possiblePassword;

                    let rollUp = new RollUp({ title: 'Регистрация', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite }, isClosable: false })
                        .append(
                            new TextView({ left: 25, right: 25, text: 'Увы, не всё так просто, как хотелось бы. Нам не хваатет некоторых данных. Пожалуйста, заполните поля ниже и нажмите "Завершить"', textColor: currentStyle.colors.opposite }),
                            new Composite({ padding: 5, top: 'prev() 25', left: 25, right: 25, background: currentStyle.colors.contrast, cornerRadius: 18 })
                                .append(regNameInput),
                            new Composite({ padding: 5, top: 'prev() 15', left: 25, right: 25, background: currentStyle.colors.contrast, cornerRadius: 18 })
                                .append(regEmailInput),
                            new Composite({ padding: 5, top: 'prev() 15', left: 25, right: 25, background: currentStyle.colors.contrast, cornerRadius: 18 })
                                .append(regPasswordInput),
                            new Composite({ padding: 20, top: 'prev() 25', left: 25, right: 25, background: currentStyle.colors.moreContrast, cornerRadius: 18, highlightOnTouch: true })
                                .append(
                                    new TextView({ text: 'Завершить', textColor: currentStyle.colors.opposite, left: 0, right: 0, alignment: 'centerX' })
                                )
                                .onTap(() => {
                                    if (!regNameInput.text || !regEmailInput.text || !regPasswordInput.text) {
                                        navigator.vibrate([100, 100, 100]);
                                        if (!regNameInput.text) regNameInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                        if (!regEmailInput.text) regEmailInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                        if (!regPasswordInput.text) regPasswordInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                    }
                                    else {
                                        let loader = new Composite({ left: 0, right: 0, top: 0, bottom: 0 })
                                            .append(
                                                new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: '#000', opacity: 0.5 }),
                                                new ActivityIndicator({ centerX: 0, centerY: 0, width: 80, height: 80, padding: 20, tintColor: currentStyle.colors.moreContrast, background: currentStyle.colors.main, cornerRadius: 18 })
                                            )
                                            .onTap(() => { })
                                            .appendTo(contentView);

                                        rpcmp_api.users.setProfileData({ name: regNameInput.text, email: regEmailInput.text, password: regPasswordInput.text, token: data.user.token })
                                            .then(() => {
                                                localStorage.setItem('token', data.user.token);
                                                localStorage.setItem('name', regNameInput.text);
                                                localStorage.setItem('email', regEmailInput.text);
                                                localStorage.setItem('certificates', '');
                                                rollUp.close(); navigationView.append(new AppPage()); loader.dispose();
                                                resolve()
                                            })
                                            .catch(err => reject(err));
                                    }
                                }),
                            new TextView({ alignment: 'centerX', top: 'prev() 15', left: 25, right: 25, text: 'Нажимая "Завершить", Вы соглашаетесь с <a href="">политикой конфиденциальности<a/>', textColor: currentStyle.colors.opposite, opacity: 0.75, markupEnabled: true })
                        );
                }
            })
            .catch(err => reject(err));
    });
}