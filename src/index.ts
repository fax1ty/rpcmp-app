import { contentView, NavigationView, ActivityIndicator } from 'tabris';
import rpcmp_api = require('./libs/rpcmp_api');
import { StyleManager } from './libs/components';
import { AppPage } from './pages/appPage';
import { LoginPage } from './pages/loginPage';

let currentTheme = localStorage.getItem('theme') as 'dark' | 'light';
if (!currentTheme) localStorage.setItem('theme', 'dark');

export let styleManager = new StyleManager(currentTheme);
export let currentStyle = styleManager.style;
export let navigationView = new NavigationView({ toolbarVisible: false, left: 0, right: 0, top: 0, bottom: 0 })
    .appendTo(contentView);

contentView.background = currentStyle.colors.main;
let loader = new ActivityIndicator({ centerX: 0, centerY: 0, width: 80, height: 80, padding: 20, tintColor: '#fff', background: currentStyle.colors.moreContrast, cornerRadius: 18 })
    .appendTo(contentView);

if (localStorage.getItem('token') && localStorage.getItem('email')) {
    rpcmp_api.users.auth({ token: localStorage.getItem('token') })
        .then(data => {
            if (data.type == 'login') {
                localStorage.setItem('email', data.user.email);
                localStorage.setItem('token', data.user.token);
                localStorage.setItem('name', data.user.name);
                localStorage.setItem('certificates', data.user.certificates.join(','));
                navigationView.append(new AppPage());
                loader.dispose();
            }
        })
        .catch(() => navigationView.append(new LoginPage()));
}
else navigationView.append(new LoginPage());