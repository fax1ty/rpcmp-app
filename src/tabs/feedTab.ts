import { Tab, ScrollView, app, WebView, device } from 'tabris';
import { currentStyle } from '..';
import { RollUp } from '../libs/ui';
import { FeedStory, FeedPost, StaticVolcanoRollUp } from '../libs/components';
import rpcmp_api = require('../libs/rpcmp_api');
import config = require('../config');

let storyScroll = new ScrollView({ left: 25, right: 25, top: 25, scrollbarVisible: false, direction: 'horizontal' });
let newsScroll = new ScrollView({ left: 0, right: 0, top: 'prev() 25', bottom: 0, scrollbarVisible: false });

export = new Tab({ left: 0, right: 0, top: 0, bottom: 0 })
    .onAppear.once(({ target: tab }) => {
        tab.append(
            storyScroll,
            newsScroll
        );

        // Стандартные истории
        storyScroll
            .append(
                new FeedStory({ background: 'https://ic.pics.livejournal.com/fastcult/50338851/2240157/2240157_original.jpg', text: 'Освежим в памяти?', title: 'Писание' }, { left: 'prev() 0' })
                    .onTap(() => {
                        new RollUp({ title: 'Писание', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                            .append(
                                new WebView({ url: config.links.GOSPEL, left: 0, right: 0, height: device.screenHeight * 0.75 })
                            )
                    }),
                new FeedStory({ background: 'https://i.imgur.com/UypoaXn.png', text: 'Макаронная вода', title: 'YouTube' }, { left: 'prev() 25' })
                    .onTap(() => app.launch(config.links.YOUTUBE)),
                new FeedStory({ background: 'https://i.imgur.com/xTpx76q.png', text: '50 оттенков пасты', title: 'ВКонтакте' }, { left: 'prev() 25' })
                    .onTap(() => app.launch(config.links.VK)),
                new FeedStory({ background: 'https://i.imgur.com/rR9bOt5.png', text: 'Иногда здесь бывают люди', title: 'Сайт' }, { left: 'prev() 25' })
                    .onTap(() => app.launch(config.links.SITE))
            );

        // Заглушка
        newsScroll
            .append(
                new FeedPost({ avatar: 'https://static.wixstatic.com/media/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.png/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.webp', title: 'Сообщение', text: 'Здесь пока пустовато, но очень скоро, в этой секции появятся интересные посты. Во всём вините компуктерных троллей' })
            );

        // Пользовательские истории
        rpcmp_api.feed.getStoryLine()
            .then(stories => {
                stories.items.forEach(story => {
                    let feedStory = new FeedStory(story.content, { right: 'next() 25' })
                        .insertBefore(storyScroll.children().first())
                        .onTap(() => {
                            let rollUp = new StaticVolcanoRollUp(story.point);
                            if (story.type == 'place') feedStory.onTap(() =>
                                rollUp
                                    .onVolcanoRemove(() => {
                                        rollUp.close();
                                        rollUp.dispose();
                                    })
                            );
                        });
                });
            })
            .catch(err => console.error(err));
    });