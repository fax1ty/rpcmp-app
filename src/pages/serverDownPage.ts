import { Page, Composite, ImageView, TextView, statusBar, app } from 'tabris';
import { currentStyle } from '..';
import moment = require('moment');
import rpcmp_api = require('../libs/rpcmp_api');

export class ServerDownPage extends Page {
    constructor() {
        super({ left: 0, right: 0, top: 0, bottom: 0, background: currentStyle.colors.main });

        this
            .onAppear.once(({ target: page }) => {
                statusBar.displayMode = 'default';
                statusBar.background = currentStyle.colors.main;
                if (currentStyle.isLightStatusBar) statusBar.theme = 'light';
                else statusBar.theme = 'dark';

                let updateIcon = new ImageView({ image: currentStyle.icons.update, height: 16, tintColor: currentStyle.colors.opposite });
                let timeStatus = new TextView({ left: 'prev() 10', font: 'bold 12px', text: `Обновлено в ${moment().format('HH:mm:ss')}`, textColor: currentStyle.colors.opposite });

                setInterval(() => {
                    rpcmp_api.checkConnection()
                        .then(() => {
                            app.reload();
                        })
                        .catch(() => {
                            updateIcon.animate({ transform: { rotation: Math.PI * 2 } }, { duration: 1000, reverse: true, repeat: 1 });
                            timeStatus.text = `Обновлено в ${moment().format('HH:mm:ss')}`;
                        })
                }, 1000 * 15);

                updateIcon.animate({ transform: { rotation: Math.PI * 2 } }, { delay: 1000, duration: 1000, reverse: true, repeat: 1 });
                page.append(
                    new Composite({ left: 25, right: 25, centerY: 0 })
                        .append(
                            new ImageView({ width: 150, centerX: 0, image: 'https://s.tcdn.co/f09/2a3/f092a3e0-90a1-3be7-9cb3-b5779873b282/192/15.png' }),
                            new TextView({ textColor: currentStyle.colors.opposite, font: 'bold 16px', alignment: 'centerX', text: 'Аррргх!', left: 0, right: 0, top: 'prev() 15' }),
                            new TextView({ textColor: currentStyle.colors.opposite, font: '12px', text: 'Что-то пошло не так и мы не смогли достучаться до наших серверов.\nМыши грызут Ваш интернет-кабель или мы правда офлайн?', left: 0, right: 0, alignment: 'centerX', top: 'prev() 2' }),
                            new Composite({ centerX: 0, top: 'prev() 15', opacity: 0.75 })
                                .append(
                                    updateIcon,
                                    timeStatus
                                )
                        )
                )
            });
    }
}