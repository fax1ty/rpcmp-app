import { Composite, TabFolder, ImageView, ScrollView, TextView, ImageValue, Properties, device, CollectionView } from 'tabris';
import { currentStyle } from '..';
import { RollUp, PopUp } from './ui';
import { MapPoint } from './interfaces';
import moment = require('moment');
import rpcmp_api = require('./rpcmp_api');

export class BottomMenu extends Composite {
    constructor(tabFolder: TabFolder) {
        super({ id: 'menu', left: 0, right: 0, bottom: 0, height: 50, background: currentStyle.colors.main });

        this
            .append(
                new Composite({ left: 50, centerY: 0 })
                    .append(
                        new ImageView({ image: currentStyle.icons.menu.feed, height: 20, tintColor: currentStyle.colors.contrast })
                    ),
                new Composite({ centerY: 0, centerX: 0 })
                    .append(
                        new ImageView({ image: currentStyle.icons.menu.map, height: 20, tintColor: currentStyle.colors.contrast })
                    ),
                new Composite({ right: 50, centerY: 0 })
                    .append(
                        new ImageView({ image: currentStyle.icons.menu.settings, height: 20, tintColor: currentStyle.colors.contrast })
                    )
            );

        let lastID = tabFolder.children().indexOf(tabFolder.selection);

        this.children(Composite)[lastID].children(ImageView).first().tintColor = currentStyle.colors.moreContrast;

        this.children().forEach((c: Composite) => c.onTap(() => {
            let newID = this.children().indexOf(c);
            tabFolder.selection = tabFolder.children()[newID];
            this.children(Composite)[lastID].children(ImageView).first().tintColor = currentStyle.colors.contrast;
            c.children(ImageView).first().tintColor = currentStyle.colors.moreContrast;
            lastID = newID;
        }));
    }
}

export class StaticVolcanoRollUp extends RollUp {
    onVolcanoRemove = (cb: any) => this.on('volcanoRemove', cb);

    constructor(point: MapPoint, marker?: TabrisMarker) {
        super({ title: point.place.title, colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } });

        let imageScroll = new ScrollView({ left: 25, right: 25, height: 150, direction: 'horizontal', scrollbarVisible: false });
        point.place.photos.forEach((url, i) => {
            new ImageView({ top: 0, bottom: 0, left: i == 0 ? 0 : 'prev() 25', image: url })
                .appendTo(imageScroll)
        });
        let notOwnerButton = new Composite({ padding: 15, highlightOnTouch: true, top: 'prev() 25', left: 25, right: 25, cornerRadius: 18, elevation: 3, background: currentStyle.colors.contrast })
            .append(
                new TextView({ alignment: 'centerX', textColor: currentStyle.colors.opposite, left: 0, right: 0, text: 'Святые приправы, я в деле!' }),
            );
        let ownerButton = new Composite({ padding: 15, highlightOnTouch: true, top: 'prev() 25', left: 25, right: 25, cornerRadius: 18, elevation: 3, background: currentStyle.colors.contrast })
            .append(
                new TextView({ alignment: 'centerX', textColor: currentStyle.colors.opposite, left: 0, right: 0, text: 'Сетерь с лица земли' }),
            )
            .onTap(() => {
                new PopUp({
                    textColor: currentStyle.colors.opposite, title: 'Вы в этом уверены?', text: 'Вы удалите данное мероприятие целиком и полностью. Оно больше не будет отображаться в списке, все подписавшиеся будут удалены и уведомлены об этом действии', buttons: {
                        no: {
                            color: currentStyle.colors.opposite,
                            text: 'О, боги, нет',
                            action: () => { }
                        },
                        ok: {
                            color: 'red',
                            text: 'Гори синим пламенем!', action: () => {
                                rpcmp_api.map.removePoint({ id: point.id })
                                    .then(() => {
                                        this.trigger('volcanoRemove');
                                        if (marker) marker.dispose();
                                        this.close();
                                    })
                                    .catch(err => console.error(err))
                            }
                        }
                    }
                }, { background: currentStyle.colors.main })
            });
        this
            .append(
                imageScroll,
                new Composite({ left: 25, right: 25, top: 'prev() 25', opacity: 0.75 })
                    .append(
                        new ImageView({ image: currentStyle.icons.volcano, tintColor: currentStyle.colors.opposite, height: 15 }),
                        new TextView({ left: 'prev() 15', text: 'Вулкан', textColor: currentStyle.colors.opposite, centerY: 0 })
                    ),
                new TextView({ textColor: currentStyle.colors.opposite, top: 'prev() 25', left: 25, right: 25, text: point.place.text }),
                new Composite({ top: 'prev() 25', left: 25, right: 25 })
                    .append(
                        new ImageView({ image: currentStyle.icons.compass, tintColor: currentStyle.colors.opposite, height: 15 }),
                        new TextView({ centerY: 0, textColor: currentStyle.colors.opposite, left: 'prev() 15', right: 0, text: point.place.address }),
                    ),
                new Composite({ top: 'prev() 15', left: 25, right: 25 })
                    .append(
                        new ImageView({ image: currentStyle.icons.time, tintColor: currentStyle.colors.opposite, height: 15 }),
                        new TextView({ centerY: 0, textColor: currentStyle.colors.opposite, left: 'prev() 15', right: 0, text: `${moment(point.date).format('DD.MM.YYYY - HH:MM (UTC ZZ)')}` }),
                    ),
                // Я в деле!
                point.owner == parseInt(localStorage.getItem('id')) ? ownerButton : notOwnerButton,
                new TextView({ top: 'prev() 25', opacity: 0.75, alignment: 'centerX', textColor: currentStyle.colors.opposite, left: 25, right: 25, text: `О мои фрикадели, с нами уже ${point.followers.length} человек(а)` }),
            )
    }
}

interface Style {
    colors: {
        main: string;
        contrast: string;
        moreContrast: string;
        opposite: string;
    }
    gradients: {
        whiteToTransparent: string;
        blackToTransparent: string;
    }
    icons: {
        update: string;
        block: string;
        close: string;
        lightBulb: string;
        compass: string;
        time: string;
        volcano: string;
        menu: {
            feed: string;
            map: string;
            settings: string;
        }
        plus: string;
        check: string;
        loginScreen: {
            auth: string;
            google: string;
            vk: string;
            github: string;
        },
        beerVolcano: string;
        key: string;
        exit: string;
    }
    isLightStatusBar: boolean;
    googleMap: Array<any>
}

export class StyleManager {
    private _dark: Style = {
        colors: {
            main: '#303030',
            contrast: '#2a2a2a',
            moreContrast: '#1f1f1f',
            opposite: '#fff'
        },
        gradients: {
            whiteToTransparent: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            blackToTransparent: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)'
        },
        icons: {
            update: 'https://i.imgur.com/v4VRXNS.png', // https://www.flaticon.com/free-icon/reload_159657'
            block: 'https://i.imgur.com/i1qQL0e.png',
            close: 'https://i.imgur.com/Wj00f51.png',
            lightBulb: 'https://github.com/greaterweb/emoji-highres/blob/master/160x160/1f4a1.png?raw=true',
            compass: 'https://i.imgur.com/zVtc0rS.png',
            time: 'https://i.imgur.com/gvBy1u1.png',
            volcano: 'https://i.imgur.com/dh9BimY.png',
            menu: {
                feed: 'https://i.imgur.com/BXrRwj6.png', // моя иконка
                map: 'https://i.imgur.com/F1Ejxxh.png',// https://www.flaticon.com/free-icon/star_149763
                settings: 'https://i.imgur.com/6PdEbYX.png' // https://www.flaticon.com/free-icon/gear_64577#term=settings&page=5&position=65
            },
            plus: 'https://i.imgur.com/EoKSZmu.png',
            check: 'https://i.imgur.com/15j7lXi.png',
            loginScreen: {
                auth: 'https://i.imgur.com/AoAuj59.png',
                google: 'https://i.imgur.com/2VP00hg.png',
                vk: 'https://i.imgur.com/DAFHFgs.png',
                github: 'https://i.imgur.com/IEPf26E.png'
            },
            beerVolcano: 'https://i.imgur.com/hTfbBkS.png',
            key: 'https://i.imgur.com/LWHMpUd.png',
            exit: 'https://i.imgur.com/EwUekku.png'
        },
        isLightStatusBar: false,
        googleMap: [{ "featureType": "all", "elementType": "all", "stylers": [{ "lightness": "29" }, { "invert_lightness": true }, { "hue": "#008fff" }, { "saturation": "-73" }] }, { "featureType": "all", "elementType": "labels", "stylers": [{ "saturation": "-72" }] }, { "featureType": "administrative", "elementType": "all", "stylers": [{ "lightness": "32" }, { "weight": "0.42" }] }, { "featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": "-53" }, { "saturation": "-66" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "lightness": "-86" }, { "gamma": "1.13" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "hue": "#006dff" }, { "lightness": "4" }, { "gamma": "1.44" }, { "saturation": "-67" }] }, { "featureType": "landscape", "elementType": "geometry.stroke", "stylers": [{ "lightness": "5" }] }, { "featureType": "landscape", "elementType": "labels.text.fill", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "weight": "0.84" }, { "gamma": "0.5" }] }, { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }, { "weight": "0.79" }, { "gamma": "0.5" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "visibility": "simplified" }, { "lightness": "-78" }, { "saturation": "-91" }] }, { "featureType": "road", "elementType": "labels.text", "stylers": [{ "color": "#ffffff" }, { "lightness": "-69" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "lightness": "5" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "lightness": "10" }, { "gamma": "1" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "lightness": "10" }, { "saturation": "-100" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "lightness": "-35" }] }, { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "saturation": "-97" }, { "lightness": "-14" }] }]
    }
    private _light: Style = {
        colors: {
            main: '#f5f5f5',
            contrast: '#e5e5e5',
            moreContrast: '#facb41',
            opposite: '#000'
        },
        gradients: {
            whiteToTransparent: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            blackToTransparent: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)'
        },
        icons: {
            update: 'https://i.imgur.com/v4VRXNS.png', // https://www.flaticon.com/free-icon/reload_159657'
            block: 'https://i.imgur.com/i1qQL0e.png',
            close: 'https://i.imgur.com/Wj00f51.png',
            lightBulb: 'https://github.com/greaterweb/emoji-highres/blob/master/160x160/1f4a1.png?raw=true',
            compass: 'https://i.imgur.com/zVtc0rS.png',
            time: 'https://i.imgur.com/gvBy1u1.png',
            volcano: 'https://i.imgur.com/dh9BimY.png',
            menu: {
                feed: 'https://i.imgur.com/BXrRwj6.png', // моя иконка
                map: 'https://i.imgur.com/F1Ejxxh.png', // https://www.flaticon.com/free-icon/star_149763
                settings: 'https://i.imgur.com/6PdEbYX.png' // https://www.flaticon.com/free-icon/gear_64577#term=settings&page=5&position=65
            },
            plus: 'https://i.imgur.com/EoKSZmu.png',
            check: 'https://i.imgur.com/15j7lXi.png',
            loginScreen: {
                auth: 'https://i.imgur.com/AoAuj59.png',
                google: 'https://i.imgur.com/2VP00hg.png',
                vk: 'https://i.imgur.com/DAFHFgs.png',
                github: 'https://i.imgur.com/IEPf26E.png'
            },
            beerVolcano: 'https://i.imgur.com/hTfbBkS.png',
            key: 'https://i.imgur.com/LWHMpUd.png',
            exit: 'https://i.imgur.com/EwUekku.png'
        },
        isLightStatusBar: true,
        googleMap: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }]
    }

    private _theme: 'light' | 'dark';
    style: Style;

    public get theme(): 'light' | 'dark' {
        return this._theme;
    }
    public set theme(value: 'light' | 'dark') {
        if (value == 'dark') this.style = this._dark;
        else this.style = this._light;
        this._theme = value;
    }

    constructor(theme: 'light' | 'dark') {
        this.theme = theme;
    }
}

export class FeedStory extends Composite {
    constructor(values: { background: ImageValue; title: string; text: string; }, properties?: Properties<Composite>) {
        super(Object.assign({ highlightOnTouch: true, cornerRadius: 18, height: 150, width: 100, background: currentStyle.colors.contrast }, properties));

        this
            .append(
                new ImageView({ left: 0, right: 0, top: 0, bottom: 0, image: values.background, scaleMode: 'fill' }),
                new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: currentStyle.gradients.blackToTransparent }),
                new Composite({ left: 0, right: 0, bottom: 15 })
                    .append(
                        new TextView({ left: 15, right: 15, text: values.title, textColor: '#fff', font: 'bold 14px' }),
                        new TextView({ left: 15, right: 15, top: 'prev() 0', text: values.text, textColor: '#fff', opacity: 0.75 })
                    )
            );
    }
}

export class FeedPost extends Composite {
    constructor(values: { avatar: ImageValue, title: string; text: string; time?: number; readTime?: number; content?: any }, properties?: Properties<Composite>) {
        super(Object.assign({ padding: 25, left: 25, right: 25, cornerRadius: 18, background: currentStyle.colors.contrast }, properties));

        this
            .append(
                new Composite()
                    .append(
                        new ImageView({ height: 18, image: values.avatar, background: currentStyle.colors.moreContrast, cornerRadius: 18 / 2 }),
                        new Composite({ left: 'prev() 10', centerY: 0 })
                            .append(
                                new TextView({ text: values.title, textColor: currentStyle.colors.opposite, font: 'bold 14px' }),
                                new TextView({ left: 'prev() 15', text: values.time || values.readTime ? `${values.time ? values.time : ''}${values.readTime ? `  •  ${values.readTime} мин чтения` : ''}` : '', textColor: currentStyle.colors.opposite, font: '12px', centerY: 0, opacity: 0.75 }),
                            )
                    ),
                new TextView({ textColor: currentStyle.colors.opposite, top: 'prev() 5', text: values.text, left: 0, right: 0 })
            );

        if (values.content) {
            this.highlightOnTouch = true;
            this
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
                });
        }
    }
}

export class GalleryPicker extends Composite {
    pickedPhoto = '';
    thumbnail = '';
    private preview = new ImageView({ left: 0, right: 0, top: 0, bottom: 0, scaleMode: 'fill' });
    private actionIcon = new ImageView({ centerX: 0, centerY: 0, width: 15, image: currentStyle.icons.plus, tintColor: currentStyle.colors.opposite });
    private actionForeground =
        new Composite({ background: currentStyle.gradients.blackToTransparent, left: 0, right: 0, top: 0, bottom: 0 })
            .append(this.actionIcon);

    private _isActive: boolean;
    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
        if (value) { this.onTap.once(this.tapListener); this.actionIcon.image = currentStyle.icons.plus; }
        else { this.onTap.removeListener(this.tapListener); this.actionIcon.image = currentStyle.icons.block; }
    }

    onPick = (cb: (data: { photo: string; thumbnail: string; }) => void) => this.on('pick', cb as any);
    onDepick = (cb: () => void) => this.on('depick', cb as any);

    private tapListener = () => {
        let photoAlbums = new Array<Array<GalleryItem>>();

        // window.FirebasePerformance.startTrace('gallery_open');
        FirebasePlugin.startTrace('gallery_open', () => { }, err => console.error(err));

        galleryAPI.getAlbums(albums => {
            albums.forEach((album, i, arr) => {
                galleryAPI.getMedia(album, async images => {
                    await photoAlbums.push(images);
                    if (i == arr.length - 1) {
                        let photos = photoAlbums.reduce((a, b) => b.concat(a)).sort((a, b) => b.date_added - a.date_added);

                        let TILE_OFFSET = 15;
                        let COLUMNT_COUNT = 4;
                        let PADDING = 25;
                        let TILE_DIM = ((device.screenWidth - (PADDING * 2)) - TILE_OFFSET * (COLUMNT_COUNT - 1)) / COLUMNT_COUNT;

                        let rollUp = new RollUp({ title: 'Выбор фотографии', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } });

                        new CollectionView({
                            left: PADDING, right: PADDING, height: device.screenHeight * 0.5, scrollbarVisible: false,
                            itemCount: Math.ceil(photos.length / 4),
                            createCell: () => {
                                let row = new Composite();
                                for (let i = 0; i < 4; i++) new ImageView({ background: currentStyle.colors.contrast, width: TILE_DIM, height: TILE_DIM, scaleMode: 'fill', cornerRadius: 18, left: i == 0 ? 0 : `prev() ${TILE_OFFSET}` })
                                    .appendTo(row);
                                return row;
                            },
                            updateCell: (cell, x) => {
                                if (x == 0) cell.padding = 0;
                                else cell.padding = { top: 25 }

                                cell.find(ImageView).forEach((view, y) => {
                                    if ((4 * x) + y < photos.length) {
                                        galleryAPI.getMediaThumbnail(photos[(4 * x) + y], thumb => {
                                            view.image = `file://${thumb.thumbnail}`;
                                            view.onTap.once(() => {
                                                this.pickedPhoto = `file://${photos[(4 * x) + y].data}`;
                                                this.thumbnail = `file://${thumb.thumbnail}`;
                                                this.preview.image = this.thumbnail;
                                                this.actionIcon.image = currentStyle.icons.close;
                                                this.actionForeground.onTap.once(() => { this.thumbnail = ''; this.pickedPhoto = ''; this.preview.image = null; this.onTap.once(this.tapListener); this.actionIcon.image = currentStyle.icons.plus; this.trigger('depick'); })
                                                this.trigger('pick', { photo: this.pickedPhoto, thumbnail: this.thumbnail });
                                                rollUp.close();
                                            });
                                        }, err => console.error(err));
                                    }
                                });
                            }
                        })
                            .appendTo(rollUp);

                        // window.FirebasePerformance.stopTrace('gallery_open');
                        FirebasePlugin.stopTrace('gallery_open');
                    }
                })
            })
        });
    }

    constructor(values?: { isActive: boolean; }, properties?: Properties<Composite>) {
        super(Object.assign({ height: 80, width: 80, background: currentStyle.colors.contrast, cornerRadius: 18, highlightOnTouch: true }, properties));

        if (values) this.isActive = values.isActive;
        else this.isActive = true;

        this
            .append(
                this.preview,
                this.actionForeground
            );
    }
}