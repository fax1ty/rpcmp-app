import { Tab, Composite, TextView, Switch, app, ImageView, ScrollView, device } from 'tabris';
import { currentStyle, navigationView } from '..';
import { LoginPage } from '../pages/loginPage';
import { RollUp, PopUp } from '../libs/ui';

export = new Tab({ left: 0, right: 0, top: 0, bottom: 0 })
    .onAppear.once(({ target: tab }) => {
        tab.background = currentStyle.colors.main;

        tab
            .append(
                new TextView({ top: 25, left: 25, text: 'Настройки', textColor: currentStyle.colors.opposite, font: 'bold 21px' }),
                new Composite({ top: 'prev() 25', padding: 25, left: 25, right: 25, cornerRadius: 18, background: currentStyle.colors.contrast })
                    .append(
                        new Composite()
                            .append(
                                new ImageView({ height: 18, image: 'https://static.wixstatic.com/media/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.png/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.webp', cornerRadius: 18 / 2 }),
                                new Composite({ left: 'prev() 10', centerY: 0 })
                                    .append(
                                        new TextView({ text: localStorage.getItem('name'), textColor: currentStyle.colors.opposite, font: 'bold 14px' }),
                                        new TextView({ left: 'prev() 15', text: `(${localStorage.getItem('email')})`, textColor: currentStyle.colors.opposite, font: '12px', centerY: 0, opacity: 0.75 })
                                    )
                            ),
                        new ScrollView({ left: 0, right: 0, direction: 'horizontal', scrollbarVisible: false, top: 'prev() 25' })
                            .append(
                                new Composite()
                                    .append(
                                        new ImageView({ image: { src: currentStyle.icons.key }, height: 15, tintColor: currentStyle.colors.opposite, centerY: 0 }),
                                        new TextView({ text: 'Изменить данные', textColor: currentStyle.colors.opposite, left: 'prev() 10', font: 'bold 14px' })
                                    )
                                    .onTap(() => {
                                        new RollUp({ title: 'Изменить данные', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                                    }),
                                new Composite({ left: 'prev() 25' })
                                    .append(
                                        new ImageView({ image: { src: currentStyle.icons.exit }, height: 15, tintColor: currentStyle.colors.opposite, centerY: 0 }),
                                        new TextView({ text: 'Выйти из аккаунта', textColor: currentStyle.colors.opposite, left: 'prev() 10', font: 'bold 14px' })
                                    )
                                    .onTap(() => {
                                        new PopUp({
                                            textColor: currentStyle.colors.opposite, title: 'Вы в этом уверены?', text: 'Вам придётся тратить драгоценное время на вход. Мы Вас предупредили...', buttons: {
                                                no: {
                                                    color: currentStyle.colors.opposite,
                                                    text: 'Это просто шутка',
                                                    action: () => { }
                                                },
                                                ok: {
                                                    color: 'red',
                                                    text: 'Пока-пока!', action: () => {
                                                        localStorage.removeItem('name');
                                                        localStorage.removeItem('token');
                                                        localStorage.removeItem('certificates');
                                                        localStorage.removeItem('email');
                                                        navigationView.append(new LoginPage());
                                                    }
                                                }
                                            }
                                        }, { background: currentStyle.colors.main })
                                    }),
                                new Composite({ left: 'prev() 25' })
                                    .append(
                                        new ImageView({ image: { src: currentStyle.icons.plus }, height: 15, tintColor: currentStyle.colors.opposite, centerY: 0 }),
                                        new TextView({ text: 'Связать соц.сети', textColor: currentStyle.colors.opposite, left: 'prev() 10', font: 'bold 14px' })
                                    )
                                    .onTap(() => {
                                        new RollUp({ title: 'Связать соц.сети', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } });
                                    })
                            )
                    ),
                new Composite({ left: 25, right: 25, top: 'prev() 25' })
                    .append(
                        new TextView({ text: 'Тёмная тема', centerY: 0, textColor: currentStyle.colors.opposite }),
                        new Switch({ left: 'prev() 25', checked: localStorage.getItem('theme') == 'dark' ? true : false, thumbOnColor: currentStyle.colors.moreContrast, thumbOffColor: currentStyle.colors.contrast, trackOnColor: currentStyle.colors.contrast })
                            .onCheckedChanged(({ value: checked }) => {
                                if (!checked) {
                                    localStorage.setItem('theme', 'light');
                                    app.reload();
                                }
                                else {
                                    localStorage.setItem('theme', 'dark');
                                    app.reload();
                                }
                            })
                    ),
                new Composite({ padding: 20, top: 'prev() 25', left: 25, right: 25, background: currentStyle.colors.moreContrast, cornerRadius: 18, highlightOnTouch: true })
                    .append(
                        new TextView({ text: 'Лицензии FOSS', textColor: '#fff', left: 0, right: 0, alignment: 'centerX' })
                    )
                    .onTap(() => new RollUp({ title: 'Юридеческая ересь', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                        .append(
                            new ScrollView({ left: 0, right: 0, top: 0, bottom: 0, scrollbarVisible: false, height: device.screenHeight * 0.75 })
                                .append(
                                    new TextView({ text: 'FlatIcon', textColor: currentStyle.colors.opposite, font: 'bold 18px', left: 25, right: 25 }),
                                    new TextView({ markupEnabled: true, top: 'prev() 5', text: generateFlatIcon(['Smashicons', 'Freepik', 'srip', 'photo3idea_studio', 'Dave Gandy', 'Pixel perfect', 'Gregor Cresnar', 'Chanut']), textColor: currentStyle.colors.opposite, left: 25, right: 25 })
                                        .onTapLink(({ url }) => app.launch(url)),
                                )
                        )),
                new Composite({ padding: 20, top: 'prev() 25', left: 25, right: 25, background: currentStyle.colors.moreContrast, cornerRadius: 18, highlightOnTouch: true })
                    .append(
                        new TextView({ text: 'Связаться с разработчиком', textColor: '#fff', left: 0, right: 0, alignment: 'centerX' })
                    )
                    .onTap(() => app.launch('https://vk.com/fax1ty'))
            );
    });

function generateFlatIcon(authors: Array<string>) {
    return authors.map(a => `Icon made by <a href="https://www.flaticon.com/authors/${a.toLowerCase().replace(/_/g, '-').replace(/ /g, '-')}">${a}</a> from <a href="https://www.flaticon.com/">www.flaticon.com</a>`).join('<br/>')
}