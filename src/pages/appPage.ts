import { Page, TabFolder, statusBar } from 'tabris';
import { BottomMenu } from '../libs/components';
import mapTab = require('../tabs/mapTab');
import feedTab = require('../tabs/feedTab');
import settingsTab = require('../tabs/settingsTab');
import { currentStyle } from '..';
import rpcmp_api = require('../libs/rpcmp_api');

export class AppPage extends Page {
    constructor() {
        super({ left: 0, right: 0, top: 0, bottom: 0, background: currentStyle.colors.main });

        if (localStorage.getItem('isNeedToUpdateFirebase') === 'true') {
            let oldFirebaseToken = localStorage.getItem('oldFirebaseToken');
            rpcmp_api.users.addFirebaseToken({ newToken: localStorage.getItem('firebaseToken'), oldToken: oldFirebaseToken ? oldFirebaseToken : '' })
                .then(() => localStorage.setItem('isNeedToUpdateFirebase', 'false'))
                .catch(err => console.log(err));
        }

        this
            .onAppear.once(({ target: page }) => {
                statusBar.displayMode = 'default';
                statusBar.background = currentStyle.colors.main;
                if (currentStyle.isLightStatusBar) statusBar.theme = 'light';
                else statusBar.theme = 'dark';

                let tabFolder = new TabFolder({ left: 0, right: 0, top: 0, bottom: 'next() 0', tabBarLocation: 'hidden' })
                    .appendTo(page);

                tabFolder.append(feedTab);
                tabFolder.append(mapTab);
                tabFolder.append(settingsTab);

                new BottomMenu(tabFolder)
                    .appendTo(page);
            });
    }
}
