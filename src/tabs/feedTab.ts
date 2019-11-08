import { Tab, TextView, Composite, ScrollView, ImageView, WebView, device, app } from "tabris";
import { currentStyle } from "..";
import { RollUp } from "../libs/ui";

export = new Tab({ left: 0, right: 0, top: 0, bottom: 0 })
    .onAppear.once(({ target: tab }) => {
        tab.background = currentStyle.colors.main;

        new TextView({ top: 25, left: 25, text: 'Чтиво', textColor: currentStyle.colors.opposite, font: 'bold 21px' })
            .appendTo(tab);

        new ScrollView({ top: 'prev() 25', left: 25, right: 25, direction: 'horizontal', scrollbarVisible: false })
            .append(
                new Composite({ highlightOnTouch: true, cornerRadius: 18, height: 150, width: 100, background: currentStyle.colors.contrast })
                    .append(
                        new ImageView({ left: 0, right: 0, top: 0, bottom: 0, image: 'https://cdni.rbth.com/rbthmedia/images/all/2016/03/29/flying_spaghetti_monster_mevymosey_b.jpg', scaleMode: 'fill' }),
                        new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: currentStyle.gradients.blackToTransparent }),
                        new Composite({ left: 0, right: 0, bottom: 15 })
                            .append(
                                new TextView({ left: 15, right: 15, text: 'С Пастхой!', textColor: '#fff', font: 'bold 14px' }),
                                new TextView({ left: 15, right: 15, top: 'prev() 0', text: '10 рецептов идеальной пасты', textColor: '#fff', opacity: 0.75 })
                            )
                    ),
                new Composite({ left: 'prev() 25', highlightOnTouch: true, cornerRadius: 18, height: 150, width: 100, background: currentStyle.colors.contrast })
                    .append(
                        new ImageView({ left: 0, right: 0, top: 0, bottom: 0, image: 'https://ic.pics.livejournal.com/fastcult/50338851/2240157/2240157_original.jpg', scaleMode: 'fill' }),
                        new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: currentStyle.gradients.blackToTransparent }),
                        new Composite({ left: 0, right: 0, bottom: 15 })
                            .append(
                                new TextView({ left: 15, right: 15, text: 'Писание', textColor: '#fff', font: 'bold 14px' }),
                                new TextView({ left: 15, right: 15, top: 'prev() 0', text: 'Освежим в памяти?', textColor: '#fff', opacity: 0.75 })
                            )
                    )
                    .onTap(() => {
                        new RollUp({ title: 'Писание', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                            .append(
                                new WebView({ left: 0, right: 0, height: device.screenHeight * 0.75, url: 'http://apokrif93.com/apokrif/pril45.pdf' })
                            )
                    }),
                new Composite({ left: 'prev() 25', highlightOnTouch: true, cornerRadius: 18, height: 150, width: 100, background: currentStyle.colors.contrast })
                    .append(
                        new ImageView({ left: 0, right: 0, top: 0, bottom: 0, image: 'https://i.imgur.com/UypoaXn.png', scaleMode: 'fill' }),
                        new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: currentStyle.gradients.blackToTransparent }),
                        new Composite({ left: 0, right: 0, bottom: 15 })
                            .append(
                                new TextView({ left: 15, right: 15, text: 'YouTube', textColor: '#fff', font: 'bold 14px' }),
                                new TextView({ left: 15, right: 15, top: 'prev() 0', text: 'Макаронная вода', textColor: '#fff', opacity: 0.75 })
                            )
                    )
                    .onTap(() => app.launch('https://www.youtube.com/user/RPCMPdotRU'))
            )
            .appendTo(tab);

        let newsScroll = new ScrollView({ left: 0, right: 0, top: 'prev() 25', bottom: 0 })
            .appendTo(tab);
        for (let i = 0; i < 10; i++) {
            new Composite({ top: i == 0 ? 0 : 'prev() 25', highlightOnTouch: true, padding: 25, left: 25, right: 25, cornerRadius: 18, background: currentStyle.colors.contrast })
                .append(
                    new Composite()
                        .append(
                            new ImageView({ height: 18, image: 'https://static.wixstatic.com/media/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.png/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01/95fb38_7137cf9e2d824efa9d851d2be1430eaa~mv2_d_4000_4000_s_4_2.webp', cornerRadius: 18 / 2 }),
                            new Composite({ left: 'prev() 10', centerY: 0 })
                                .append(
                                    new TextView({ text: 'Автор', textColor: currentStyle.colors.opposite, font: 'bold 14px' }),
                                    new TextView({ left: 'prev() 15', text: '7 окт  •  1 мин чтения', textColor: currentStyle.colors.opposite, font: '12px', centerY: 0, opacity: 0.75 }),
                                )
                        ),
                    new TextView({ textColor: currentStyle.colors.opposite, top: 'prev() 5', text: 'Равным образом постоянный количественный рост и сфера...', left: 0, right: 0 })
                )
                .onTap(() => {
                    let rollUp = new RollUp({ title: 'Новость', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                    let imageScroll = new ScrollView({ left: 25, right: 25, top: 'prev() 25', height: 150, scrollbarVisible: false, direction: 'horizontal' });
                    new ScrollView({ left: 0, right: 0, height: device.screenHeight * 0.75 })
                        .append(
                            new TextView({ text: 'В школе будут изучать пастафарианство?', textColor: currentStyle.colors.opposite, left: 25, right: 25, font: 'bold 18px' }),
                            new TextView({ top: 'prev() 25', textColor: currentStyle.colors.opposite, left: 25, right: 25, markupEnabled: true, text: 'РПЦ направила письмо Министру просвещения РФ с предложением включить пастафарианство в школьную программу<br/><br/>3 сентября 2019 года Минпросвещения РФ опубликовало новые проекты образовательных стандартов. Вместо нескольких предметов, связанных с конкретными религиями, предлагается единый предмет "Основы религиозных культур и светской этики". Совет муфтиев России одобрил идею рассказывать школьникам об основах ВСЕХ основных религиозных культур, не выделяя ни одну из них. Ведь только познакомившись со всем ассортиментом, можно сделать разумный выбор!<br/><br/>Пастриарх Шима Паста V и Священный Дуршлаг Русской Пастафарианской Церкви Макаронного Пастриархата поддерживают это предложение и готовы всячески поспособствовать включению Пастафарианства в состав предмета "Основы религиозных культур и светской этики".<br/><br/>Сегодня было направлено официальное письмо от Пастриарха РПЦ Министру просвещения РФ Ольге Васильевой с предложением включить Пастафарианство, как, пожалуй, наиболее древнюю традиционную религию, в состав унифицированного предмета Федерального государственного образовательного стандарта. К письму было приложено Евангелие Летающего Макаронного Монстра, священная книга Пастафарианства.<br/><br/>Русская Пастафарианская Церковь надеется, что Министр Ольга Васильева рассмотрит обращение и вынесет положительное решение. Оно подтвердит, что в России чувства верующих надежно защищены, а религиозным организациям обеспечены равные возможности.<br/><br/>РАминь<br/><br/>Контакты для СМИ:<br/><br/><a href="mailto:press@rpcmp.ru">press@rpcmp.ru</a>' }),
                            imageScroll
                        )
                        .appendTo(rollUp);

                    for (let i = 0; i < 2; i++) {
                        new ImageView({ top: 0, bottom: 0, left: i == 0 ? 0 : 'prev() 25', image: 'https://static.wixstatic.com/media/a8a4e7_a92aa49c776c4753b59f91ceefa01489~mv2.jpg/v1/fill/w_740,h_555,al_c,q_90,usm_0.66_1.00_0.01/a8a4e7_a92aa49c776c4753b59f91ceefa01489~mv2.jpg' })
                            .appendTo(imageScroll);
                    }
                })
                .appendTo(newsScroll);
        }

        new Composite({ left: 0, right: 0, top: 'prev() 0', bottom: 0, background: currentStyle.colors.main })
            .appendTo(tab);
    });