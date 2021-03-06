import { contentView, NavigationView, statusBar, ActivityIndicator, Composite } from 'tabris';
import rpcmp_api = require('./libs/rpcmp_api');
import { StyleManager } from './libs/components';
import { AppPage } from './pages/appPage';
import { LoginPage } from './pages/loginPage';
import config = require('./config');
import { ServerDownPage } from './pages/serverDownPage';

let currentTheme = localStorage.getItem('theme') as 'dark' | 'light';
if (!currentTheme) {
    localStorage.setItem('theme', 'dark');
    currentTheme = 'dark';
}

export let styleManager = new StyleManager(currentTheme);
export let currentStyle = styleManager.style;
export let navigationView = new NavigationView({ toolbarVisible: false, left: 0, right: 0, top: 0, bottom: 0 })
    .appendTo(contentView);

SocialVk.init(config.VK_ID);
firebase.Analytics.analyticsCollectionEnabled = localStorage.getItem('isAnalyticsOn') === 'true' ? true : false;

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

firebase.Messaging.on('message',
    ({ data }: { data: Object }) => {
        console.log('Получили сообщение от Firebase: ' + JSON.stringify(data));
    });

firebase.Messaging.on('tokenChanged',
    ({ token: newFirebaseToken }: { token: string }) => {
        console.log(`Новый Firebase токен: ${newFirebaseToken}`);
        let oldFirebaseToken = localStorage.getItem('firebaseToken');
        if (oldFirebaseToken) localStorage.setItem('oldFirebaseToken', oldFirebaseToken);
        localStorage.setItem('firebaseToken', newFirebaseToken);
        localStorage.setItem('isNeedToUpdateFirebase', 'true');
    });

// import { GroupVolcanoRollUp, StyleManager } from "./libs/components";

// let currentTheme = localStorage.getItem('theme') as 'dark' | 'light';
// if (!currentTheme) {
//     localStorage.setItem('theme', 'dark');
//     currentTheme = 'dark';
// }

// export let styleManager = new StyleManager(currentTheme);
// export let currentStyle = styleManager.style;

// new GroupVolcanoRollUp({
//     verified: true,
//     parent: '1',
//     children: [],
//     id: 'x',
//     followers: [2, 3, 4],
//     owner: 1,
//     place: {
//         text: 'Тут есть комиксы и котики. Что вам ещё нужно? Бегите со всех ног, быстрее, быстрее, быстрее...',
//         title: 'Мега-крутое место',
//         photos: ['https://i.imgur.com/I923Dng.jpg'],
//         address: 'Улица Котовского 34'
//     },
//     date: new Date(),
//     position: [50, 50]
// });