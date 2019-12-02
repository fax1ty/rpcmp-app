import { contentView, NavigationView, statusBar, ActivityIndicator, Composite } from 'tabris';
import rpcmp_api = require('./libs/rpcmp_api');
import { StyleManager } from './libs/components';
import { AppPage } from './pages/appPage';
import { LoginPage } from './pages/loginPage';
import config = require('./config');
import { ServerDownPage } from './pages/serverDownPage';

let currentTheme = localStorage.getItem('theme') as 'dark' | 'light';
if (!currentTheme) localStorage.setItem('theme', 'dark');

export let styleManager = new StyleManager(currentTheme);
export let currentStyle = styleManager.style;
export let navigationView = new NavigationView({ toolbarVisible: false, left: 0, right: 0, top: 0, bottom: 0 })
    .appendTo(contentView);

SocialVk.init(config.VK_ID);

statusBar.displayMode = 'float';
statusBar.background = 'transparent';
contentView.background = currentStyle.colors.main;

let loader = new Composite({ left: 0, right: 0, top: 0, bottom: 0 })
    .append(
        new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: '#000', opacity: 0.5 }),
        new ActivityIndicator({ centerX: 0, centerY: 0, width: 80, height: 80, padding: 20, tintColor: currentStyle.colors.moreContrast, background: currentStyle.colors.main, cornerRadius: 18 })
    )
    .onTap(() => { })
    .appendTo(contentView);

rpcmp_api.checkConnection()
    .then(() => {
        loader.dispose();
        if (localStorage.getItem('token') && localStorage.getItem('email')) {
            rpcmp_api.users.auth({ token: localStorage.getItem('token') })
                .then(data => {
                    if (data.type == 'login') {
                        localStorage.setItem('id', data.user.id.toString());
                        localStorage.setItem('email', data.user.email);
                        localStorage.setItem('token', data.user.token);
                        localStorage.setItem('name', data.user.name);
                        localStorage.setItem('certificates', data.user.certificates.join(','));
                        navigationView.append(new AppPage());
                    }
                })
                .catch(() => {
                    navigationView.append(new LoginPage());
                });
        }
        else navigationView.append(new LoginPage());
    })
    .catch(() => {
        navigationView.append(new ServerDownPage());
        loader.dispose();
    });