import { Tab, TextView, ScrollView, app, WebView, device, Composite } from "tabris";
import { currentStyle } from "..";
import { RollUp } from "../libs/ui";
import { FeedStory, FeedPost } from "../libs/components";

export = new Tab({ left: 0, right: 0, top: 0, bottom: 0 })
    .onAppear.once(({ target: tab }) => {
        tab.background = currentStyle.colors.main;

        new TextView({ top: 25, left: 25, text: 'Чтиво', textColor: currentStyle.colors.opposite, font: 'bold 21px' })
            .appendTo(tab);

        new ScrollView({ top: 'prev() 25', left: 25, right: 25, direction: 'horizontal', scrollbarVisible: false })
            .append(
                new FeedStory({ background: 'https://ic.pics.livejournal.com/fastcult/50338851/2240157/2240157_original.jpg', text: 'Освежим в памяти?', title: 'Писание' })
                    .onTap(() => {
                        let alarm = new FeedPost({ avatar: 'https://static.wixstatic.com/media/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.png/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.webp', title: 'Сообщение', text: 'Скоро у нас появится интерактивное Писание прямо в приложении, а пока придётся довольствоваться обычным PDF. Компьютерные обезьянки работают слишком медленно :-(' });
                        let button = new Composite({ padding: 15, highlightOnTouch: true, background: currentStyle.colors.contrast, left: 0, right: 0, top: 0 })
                            .append(
                                new TextView({ left: 0, right: 0, alignment: 'centerX', centerY: 0, text: 'Нажмите сюда, чтобы убрать уведомление и развернуть окно', textColor: currentStyle.colors.opposite, font: 'bold 16px' })
                            );
                        new RollUp({ title: 'Писание', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                            .append(
                                alarm,
                                new Composite({ cornerRadius: 18, left: 25, right: 25, top: 'prev() 25', height: device.screenHeight * 0.5 })
                                    .append(
                                        new WebView({ url: 'https://docdro.id/sbZ3LcL', left: 0, right: 0, top: 0, bottom: 0 }),
                                        button
                                            .onTap.once(({ target }) => { alarm.dispose(); target.parent().height = device.screenHeight * 0.75; target.parent().top = 0; button.dispose(); }))
                            )
                    }),
                new FeedStory({ background: 'https://i.imgur.com/UypoaXn.png', text: 'Макаронная вода', title: 'YouTube' }, { left: 'prev() 25' })
                    .onTap(() => app.launch('https://www.youtube.com/user/RPCMPdotRU')),
                new FeedStory({ background: 'https://i.imgur.com/xTpx76q.png', text: '50 оттенков пасты', title: 'ВКонтакте' }, { left: 'prev() 25' })
                    .onTap(() => app.launch('https://vk.com/rpcmp')),
                new FeedStory({ background: 'https://i.imgur.com/rR9bOt5.png', text: 'Иногда здесь бывают люди', title: 'Сайт' }, { left: 'prev() 25' })
                    .onTap(() => app.launch('https://www.rpcmp.ru'))
            )
            .appendTo(tab);

        let newsScroll = new ScrollView({ left: 0, right: 0, top: 'prev() 25', bottom: 0 })
            .appendTo(tab);

        new FeedPost({ avatar: 'https://static.wixstatic.com/media/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.png/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.webp', title: 'Сообщение', text: 'Здесь пока пустовато, но очень скоро, в этой секции появятся интересные посты. Во всём вините компуктерных троллей' })
            .appendTo(newsScroll);
    });