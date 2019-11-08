import { Composite, TabFolder, ImageView, ScrollView, TextView } from "tabris";
import { currentStyle } from "..";
import { RollUp } from "./ui";

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
    constructor() {
        super({ title: 'Локи бар', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } });

        this
            .append(
                new ScrollView({ left: 25, right: 25, height: 150, direction: 'horizontal', scrollbarVisible: false })
                    .append(
                        new ImageView({ top: 0, bottom: 0, image: 'https://sun9-10.userapi.com/c844216/v844216100/160ba1/T545u7SGq2E.jpg' }),
                        new ImageView({ top: 0, bottom: 0, left: 'prev() 25', image: 'https://sun9-4.userapi.com/c857432/v857432022/59320/83Mdhn5PS9Q.jpg' }),
                        new ImageView({ top: 0, bottom: 0, left: 'prev() 25', image: 'https://sun9-13.userapi.com/c857432/v857432022/59280/F_VRg5i1GXM.jpg' }),
                        new ImageView({ top: 0, bottom: 0, left: 'prev() 25', image: 'https://sun9-72.userapi.com/c857432/v857432022/59370/Z27r940pwqE.jpg' })
                    ),
                new Composite({ left: 25, right: 25, top: 'prev() 25', opacity: 0.75 })
                    .append(
                        new ImageView({ image: 'https://i.imgur.com/dh9BimY.png', tintColor: currentStyle.colors.opposite, height: 15 }),
                        new TextView({ left: 'prev() 15', text: 'Вулкан', textColor: currentStyle.colors.opposite, centerY: 0 })
                    ),
                new TextView({ textColor: currentStyle.colors.opposite, top: 'prev() 25', left: 25, right: 25, text: 'Равным образом постоянный количественный рост и сфера нашей активности позволяет выполнять важные задания по разработке направлений прогрессивного развития. Товарищи!' }),
                new Composite({ padding: 15, highlightOnTouch: true, top: 'prev() 25', left: 25, right: 25, cornerRadius: 18, elevation: 3, background: currentStyle.colors.contrast })
                    .append(
                        new TextView({ alignment: 'centerX', textColor: currentStyle.colors.opposite, left: 0, right: 0, text: 'Святые приправы, я в деле!' }),
                    ),
                new TextView({ textColor: currentStyle.colors.opposite, left: 0, right: 0, alignment: 'centerX', top: 'prev() 15', text: 'О мои фрикадели, с нами уже X человек', opacity: 0.7 })
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
        menu: {
            feed: string;
            map: string;
            settings: string;
        }
        plus: string;
        check: string;
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
            menu: {
                feed: 'https://i.imgur.com/BXrRwj6.png', // моя иконка
                map: 'https://i.imgur.com/F1Ejxxh.png',// https://www.flaticon.com/free-icon/star_149763
                settings: 'https://i.imgur.com/6PdEbYX.png' // https://www.flaticon.com/free-icon/gear_64577#term=settings&page=5&position=65
            },
            plus: 'https://i.imgur.com/EoKSZmu.png',
            check: 'https://i.imgur.com/EoKSZmu.png'
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
            menu: {
                feed: 'https://i.imgur.com/BXrRwj6.png', // моя иконка
                map: 'https://i.imgur.com/F1Ejxxh.png', // https://www.flaticon.com/free-icon/star_149763
                settings: 'https://i.imgur.com/6PdEbYX.png' // https://www.flaticon.com/free-icon/gear_64577#term=settings&page=5&position=65
            },
            plus: 'https://i.imgur.com/EoKSZmu.png',
            check: 'https://i.imgur.com/EoKSZmu.png'
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