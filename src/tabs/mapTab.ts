import { Tab, ImageView, Composite, TextView, ActivityIndicator, TextInput, ScrollView, device, contentView, CollectionView, Slider } from 'tabris';
import { currentStyle } from '..';
import { StaticVolcanoRollUp, GalleryPicker } from '../libs/components';
import { RollUp, Notification } from '../libs/ui';
import rpcmp_api = require('../libs/rpcmp_api');
import moment = require('moment');
import { uploadImage, getDistance } from '../libs/utils';
import { MapPoint } from '../libs/interfaces';

export = new Tab({ left: 0, right: 0, top: 0, bottom: 0 })
    .onAppear.once(({ target: tab }) => {
        let myPos = new Array<number>();
        tab.background = currentStyle.colors.main;

        new esmaps.Map({ left: 0, right: 0, top: 0, bottom: 0, background: currentStyle.colors.main })
            .appendTo(tab)
            .on('ready', ({ target: map }) => {
                let whereImButton = new Composite({ enabled: false, opacity: 0, cornerRadius: 18, highlightOnTouch: true, bottom: 25, centerX: 0, padding: 15, background: currentStyle.colors.main, elevation: 3 })
                    .append(
                        new TextView({ textColor: currentStyle.colors.opposite, text: 'Где я?' })
                    )
                    .onTap(() => {
                        map.moveToPosition(myPos, 1 * 500, { animate: true });
                        whereImButton.animate({ opacity: 0 }, { duration: 500 })
                            .then(() => whereImButton.enabled = true);
                        map.once('cameraMoved', () => {
                            whereImButton.animate({ opacity: 1 }, { duration: 500 })
                                .then(() => whereImButton.enabled = true);
                        });
                    }
                    )
                    .appendTo(tab);

                let loader = new Composite({ left: 0, right: 0, top: 0, bottom: 0 })
                    .append(
                        new ActivityIndicator({ elevation: 3, centerX: 0, centerY: 0, width: 80, height: 80, padding: 20, tintColor: currentStyle.colors.moreContrast, background: currentStyle.colors.main, cornerRadius: 18 })
                    )
                    .onTap(() => { })
                    .appendTo(tab);

                map.setMapStyle(JSON.stringify(currentStyle.googleMap));

                let mapPoints = new Array<MapPoint>();

                rpcmp_api.map.getAllActivePoints()
                    .then(data => {
                        mapPoints = data.items;
                        data.items.forEach(point => {
                            let marker = new esmaps.Marker({ position: point.position, image: { src: currentStyle.icons.beerVolcano } });
                            map.addMarker(
                                marker.on('tap', () => new StaticVolcanoRollUp(point, marker))
                            );
                        });
                    })
                    .catch(err => console.error(err));

                navigator.geolocation.getCurrentPosition(pos => {
                    myPos = [pos.coords.latitude, pos.coords.longitude];
                    map.moveToPosition(myPos, 3 * 1000, { animate: false });
                    map.once('cameraMoved', () => {
                        whereImButton.animate({ opacity: 1 }, { duration: 500 })
                            .then(() => whereImButton.enabled = true);
                    });
                    loader.dispose();
                }, err => console.error(err));

                let newVolcanoButton = new ImageView({ elevation: 3, right: 25, bottom: 25, width: 50, height: 50, cornerRadius: 25, background: currentStyle.colors.moreContrast, image: currentStyle.icons.plus, padding: 20, tintColor: '#fff', highlightOnTouch: true })
                    .insertBefore(loader)
                    .onTap(({ target: button }) => {
                        rpcmp_api.users.getPoints({ filter: 'active' })
                            .then(myPoints => {
                                if (myPoints.items.length == 0) {
                                    button.enabled = false;
                                    button.animate({ opacity: 0 }, { duration: 500 })
                                        .then(() => {
                                            let lastPosition = new Array<number>();
                                            let lastMarker: TabrisMarker;

                                            new ImageView({ id: 'cancel-button', elevation: 3, right: 25, bottom: 25, width: 50, height: 50, cornerRadius: 25, background: currentStyle.colors.moreContrast, image: currentStyle.icons.close, padding: 20, tintColor: '#fff', highlightOnTouch: true })
                                                .onTap.once(({ target: cancelButton }) => {
                                                    map.off('tap', mapTapFunc);
                                                    cancelButton.animate({ opacity: 0 }, { duration: 500 })
                                                        .then(() => {
                                                            cancelButton.dispose();
                                                            $('#pick-place-header').first().dispose();
                                                            button.enabled = true;
                                                            button.animate({ opacity: 1 }, { duration: 500 });
                                                        });

                                                })
                                                .appendTo(tab);

                                            let mapTapFunc = ({ position }: { position: Array<number> }) => {
                                                if (lastPosition.length == 0) {
                                                    $('#cancel-button').first().dispose();
                                                    let acceptButton = new ImageView({ opacity: 0, enabled: false, right: 25, bottom: 25, width: 50, height: 50, cornerRadius: 25, background: currentStyle.colors.main, elevation: 3, image: currentStyle.icons.check, padding: 20, tintColor: currentStyle.colors.opposite, highlightOnTouch: true })
                                                        .appendTo(tab)
                                                        .onTap(({ target: button }) => {
                                                            rpcmp_api.utils.reverseGeocode({ point: lastMarker.position })
                                                                .then(data => {
                                                                    let posAddress = `${data.country}, ${data.city}${data.road ? `, ${data.road}` : ''}${data.house_number ? `, ${data.house_number}` : ''}`;

                                                                    button.dispose();
                                                                    $('#pick-place-header').dispose();
                                                                    map.off('tap', mapTapFunc);
                                                                    newVolcanoButton.animate({ opacity: 1 }, { duration: 500, delay: 1000 })
                                                                        .then(() => newVolcanoButton.enabled = true);

                                                                    let placeTitleInput = new TextInput({ id: 'place-title-input', textColor: currentStyle.colors.opposite, message: 'Отображаемое название', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 0, style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' });
                                                                    let placeTextInput = new TextInput({ type: 'multiline', maxChars: 150, id: 'place-text-input', textColor: currentStyle.colors.opposite, message: 'Описание', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 0, style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' });
                                                                    let placeAddressInput = new TextInput({ id: 'place-address-input', textColor: currentStyle.colors.opposite, message: `Адрес (можно автоматически определить)`, messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 'next() 15', style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' });
                                                                    let placeDateInput = new TextInput({ id: 'place-date-input', textColor: currentStyle.colors.opposite, message: 'Дата (можно выбрать справа)', messageColor: currentStyle.colors.opposite, floatMessage: false, left: 0, right: 'next() 15', style: 'none', centerY: 0, keyboardAppearanceMode: 'ontouch' });

                                                                    let counter = new TextView({ text: `${placeTextInput.text.length}/${placeTextInput.maxChars}`, textColor: currentStyle.colors.opposite, top: 'prev() 15', right: 25 });

                                                                    let isNeedToSave = false;
                                                                    let date = new Date();

                                                                    placeAddressInput.text = posAddress;
                                                                    placeDateInput.text = `${moment(date).format('DD.MM.YYYY - HH:MM (UTC ZZ)')}`;

                                                                    let pickersScroll = new ScrollView({ left: 25, right: 25, top: 'prev() 25', direction: 'horizontal', scrollbarVisible: false })
                                                                        .append(
                                                                            new GalleryPicker(),
                                                                            new GalleryPicker({ isActive: false }, { left: 'prev() 25' }),
                                                                            new GalleryPicker({ isActive: false }, { left: 'prev() 25' }),
                                                                            new GalleryPicker({ isActive: false }, { left: 'prev() 25' }),
                                                                            new GalleryPicker({ isActive: false }, { left: 'prev() 25' })
                                                                        );
                                                                    pickersScroll.find(GalleryPicker).forEach((picker, i, pickers) => {
                                                                        picker.onPick(() => { pickers[i + 1].isActive = true; });
                                                                        picker.onDepick(() => pickers[i + 1].isActive = false);
                                                                    });

                                                                    let rollUp = new RollUp({ title: 'Новая метка', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                                                                        .append(
                                                                            new TextView({ left: 25, right: 25, text: 'Опишите Ваше место: как оно называется, что оно может предложить, когда будет происходить данное мероприятие и добавьте пару фото, чтобы незнакомцы понимали о чём идёт речь', textColor: currentStyle.colors.opposite }),
                                                                            new ScrollView({ left: 0, right: 0, top: 'prev() 25', height: device.screenHeight * 0.5, scrollbarVisible: false })
                                                                                .append(
                                                                                    new Composite({ padding: 5, left: 25, right: 25, background: currentStyle.colors.contrast, cornerRadius: 18 })
                                                                                        .append(placeTitleInput),
                                                                                    new Composite({ padding: 5, top: 'prev() 15', left: 25, right: 25, background: currentStyle.colors.contrast, cornerRadius: 18 })
                                                                                        .append(placeTextInput
                                                                                            .onInput(({ text }) => counter.text = `${text.length}/${placeTextInput.maxChars}`)
                                                                                        ),
                                                                                    counter,
                                                                                    new Composite({ padding: 5, top: 'prev() 15', left: 25, right: 25, background: currentStyle.colors.contrast, cornerRadius: 18 })
                                                                                        .append
                                                                                        (
                                                                                            placeAddressInput,
                                                                                            new ImageView({ right: 15, image: currentStyle.icons.compass, tintColor: '#fff', padding: 10, background: currentStyle.colors.moreContrast, cornerRadius: 30 / 4, highlightOnTouch: true, width: 30, height: 30, centerY: 0 })
                                                                                                .onTap(() => {
                                                                                                    rpcmp_api.utils.reverseGeocode({ point: myPos })
                                                                                                        .then(myPosData => {
                                                                                                            placeAddressInput.text = `${myPosData.country}, ${myPosData.city}${myPosData.road ? `, ${myPosData.road}` : ''}${myPosData.house_number ? `, ${myPosData.house_number}` : ''}`;
                                                                                                            new Notification({ image: currentStyle.icons.lightBulb, colors: { background: currentStyle.colors.main, text: currentStyle.colors.opposite }, closeCondition: { autoDuration: 3 * 1000 }, title: 'Сообщение', text: 'Адрес был автоматически определён по Вашему местоположению' });
                                                                                                        })
                                                                                                        .catch(err => {
                                                                                                            console.error(err);
                                                                                                            new Notification({ image: currentStyle.icons.lightBulb, colors: { background: currentStyle.colors.main, text: currentStyle.colors.opposite }, title: 'Ошибка', text: 'Что-то пошло не так, попробуйте ещё раз' });
                                                                                                        });
                                                                                                })
                                                                                        ),
                                                                                    new Composite({ padding: 5, top: 'prev() 15', left: 25, right: 25, background: currentStyle.colors.contrast, cornerRadius: 18 })
                                                                                        .append(
                                                                                            placeDateInput,
                                                                                            new ImageView({ right: 15, image: currentStyle.icons.time, tintColor: '#fff', padding: 10, background: currentStyle.colors.moreContrast, cornerRadius: 30 / 4, highlightOnTouch: true, width: 30, height: 30, centerY: 0 })
                                                                                                .onTap(() => {
                                                                                                    datePicker.show({ mode: 'datetime', date: date, androidTheme: currentStyle.isLightStatusBar ? 0 : 4, doneButtonColor: currentStyle.colors.contrast, cancelButtonColor: currentStyle.colors.contrast, allowOldDates: false, minDate: date }, data => {
                                                                                                        date = new Date(data);
                                                                                                        placeDateInput.text = `${moment(date).format('DD.MM.YYYY - HH:MM (UTC ZZ)')}`;
                                                                                                    }, err => console.error(err));
                                                                                                })
                                                                                        ),
                                                                                    pickersScroll,
                                                                                    new TextView({ top: 'prev() 15', left: 25, right: 25, text: 'Добавьте, как минимум, 1 фото. Обычно, это логотип места. Если его нет, хватит и фотки с iPhone 4S', textColor: currentStyle.colors.opposite }),
                                                                                    new Composite({ left: 25, right: 25, top: 'prev() 25', opacity: 0.75 })
                                                                                        .append(
                                                                                            new ImageView({ image: currentStyle.icons.volcano, tintColor: currentStyle.colors.opposite, height: 15 }),
                                                                                            new TextView({ left: 'prev() 15', text: 'Вулкан', textColor: currentStyle.colors.opposite, centerY: 0 })
                                                                                        )
                                                                                ),
                                                                            new Composite({ padding: 20, top: 'prev() 25', left: 25, right: 25, background: currentStyle.colors.moreContrast, cornerRadius: 18, highlightOnTouch: true })
                                                                                .append(
                                                                                    new TextView({ text: 'Добавить', textColor: currentStyle.colors.opposite, left: 0, right: 0, alignment: 'centerX' })
                                                                                )
                                                                                .onTap(() => {
                                                                                    let photos = pickersScroll.children(GalleryPicker).toArray().filter(el => el.pickedPhoto.length > 0);
                                                                                    if (!placeAddressInput.text || !placeDateInput.text || !placeTextInput.text || !placeTitleInput.text || photos.length == 0) {
                                                                                        navigator.vibrate([100, 100, 100]);
                                                                                        if (!placeAddressInput.text) placeAddressInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                                                                        if (!placeDateInput.text) placeDateInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                                                                        if (!placeTextInput.text) placeTextInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                                                                        if (!placeTitleInput.text) placeTitleInput.parent().animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                                                                        if (photos.length == 0) pickersScroll.animate({ opacity: 0 }, { duration: 500, repeat: 1, reverse: true });
                                                                                    }
                                                                                    else {
                                                                                        let loader = new Composite({ left: 0, right: 0, top: 0, bottom: 0 })
                                                                                            .append(
                                                                                                new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: '#000', opacity: 0.5 }),
                                                                                                new ActivityIndicator({ centerX: 0, centerY: 0, width: 80, height: 80, padding: 20, tintColor: currentStyle.colors.moreContrast, background: currentStyle.colors.main, cornerRadius: 18 })
                                                                                            )
                                                                                            .onTap(() => { })
                                                                                            .appendTo(contentView);
                                                                                        Promise.all(photos.map<Promise<string>>(picker => uploadImage(picker.thumbnail.replace('file://', ''))))
                                                                                            .then(uploadedImages => {
                                                                                                rpcmp_api.map.addPoint({ type: 'volcano', date: date, place: { title: placeTitleInput.text, text: placeTextInput.text, photos: uploadedImages, address: placeAddressInput.text }, position: lastMarker.position })
                                                                                                    .then(data => {
                                                                                                        isNeedToSave = true;
                                                                                                        rollUp.close();
                                                                                                        loader.dispose();
                                                                                                        lastMarker.on('tap', () => new StaticVolcanoRollUp(data.point, lastMarker));
                                                                                                        mapPoints.push(data.point);
                                                                                                    })
                                                                                                    .catch(err => { console.error('Добавление точки', err); loader.dispose(); });
                                                                                            })
                                                                                            .catch(err => { console.error(err); loader.dispose(); });
                                                                                    }
                                                                                })
                                                                        )
                                                                        .onDispose(() => { if (!isNeedToSave) map.removeMarker(lastMarker); });
                                                                })
                                                                .catch(err => console.error(err));
                                                        });
                                                    acceptButton.animate({ opacity: 1 }, { duration: 500 })
                                                        .then(() => acceptButton.enabled = true);
                                                }

                                                if (lastPosition != position) {
                                                    lastPosition = position;
                                                    if (lastMarker) map.removeMarker(lastMarker);
                                                    let marker = new esmaps.Marker({ position: position, image: { src: currentStyle.icons.beerVolcano } });
                                                    lastMarker = marker;
                                                    map.addMarker(marker);
                                                }
                                            }
                                            map.on('tap', mapTapFunc);
                                        });
                                    new TextView({
                                        id: 'pick-place-header', text: 'Выберите место', top: 25, centerX: 0, font: 'bold 18px', elevation: 3, textColor: currentStyle.colors.opposite, background: currentStyle.colors.contrast, cornerRadius: 18, padding: 15
                                    })
                                        .appendTo(tab);
                                }
                                else new Notification({ image: currentStyle.icons.lightBulb, colors: { background: currentStyle.colors.main, text: currentStyle.colors.opposite }, closeCondition: { autoDuration: 3 * 1000 }, title: 'Сообщение', text: 'Нельзя иметь более одного активного мероприятия! Спамить можно и в Одноклассниках' });
                            })
                            .catch(err => console.error(err));
                    });
                new Composite({ highlightOnTouch: true, background: currentStyle.colors.moreContrast, padding: 15, right: 25, top: 25, cornerRadius: 18, elevation: 3 })
                    .append(
                        new TextView({ text: 'Отобразить списком', textColor: '#fff' })
                    )
                    .appendTo(tab)
                    .onTap(() => {
                        let sortMethod: 'more' | 'less' = 'more';
                        let filterDistance = 10;
                        console.log(mapPoints);
                        let inputArray = mapPoints.filter(point => getDistance(myPos[0], myPos[1], point.position[0], point.position[1]) <= filterDistance).sort((a, b) => sortMethod == 'more' ? b.followers.length - a.followers.length : a.followers.length - b.followers.length);

                        let slider = new Slider({ centerY: 0, left: 'prev() 15', right: 'next() 15', minimum: 1, selection: filterDistance, maximum: 50, tintColor: currentStyle.colors.moreContrast });
                        let currentValueText = new TextView({ centerY: 0, left: 0, right: 'next() 15', text: `Текущее расстояние: ${slider.selection} км`, textColor: currentStyle.colors.opposite, opacity: 0.75 });
                        let rollUp = new RollUp({ title: 'Список мест', colors: { background: currentStyle.colors.main, title: currentStyle.colors.opposite } })
                        if (inputArray.length == 0) {
                            rollUp
                                .append(
                                    new Composite({ left: 25, right: 25 })
                                        .append(
                                            new ImageView({ width: 150, height: 150, centerX: 0, image: 'https://i.imgur.com/UDTcplx.png' }),
                                            new TextView({ top: 'prev() 25', left: 0, right: 0, alignment: 'centerX', text: 'Оп, а тут заяц в шляпе', textColor: currentStyle.colors.opposite, font: 'bold 21px' })
                                        )
                                );
                        }
                        else {
                            rollUp
                                .append(
                                    new Composite({ left: 25, right: 25 })
                                        .append(
                                            new TextView({ left: 0, right: 0, text: 'Расстояние до точки', textColor: currentStyle.colors.opposite }),
                                            new Composite({ left: 0, right: 0, top: 'prev() 15' })
                                                .append(
                                                    new TextView({ left: 0, text: `${slider.minimum} км`, textColor: currentStyle.colors.opposite }),
                                                    slider
                                                        .onSelect(({ selection }) => {
                                                            filterDistance = selection;
                                                            currentValueText.text = `Текущее расстояние: ${selection} км`;
                                                        }),
                                                    new TextView({ right: 0, text: `${slider.maximum} км`, textColor: currentStyle.colors.opposite })
                                                ),
                                            new Composite({ left: 0, right: 0, top: 'prev() 15' })
                                                .append(
                                                    currentValueText,
                                                    new Composite({ right: 0, padding: 15, cornerRadius: 18, background: currentStyle.colors.contrast, highlightOnTouch: true })
                                                        .append(
                                                            new ImageView({ centerY: 0, height: 15, image: currentStyle.icons.menu.map, tintColor: currentStyle.colors.opposite }),
                                                            new TextView({ centerY: 0, left: 'prev() 15', text: 'Более популярные', font: 'bold 14px', textColor: currentStyle.colors.opposite })
                                                        )
                                                        .onTap(({ target: button }) => {
                                                            if (sortMethod == 'more') {
                                                                sortMethod = 'less';
                                                                button.children(TextView).first().text = 'Менее популярные';
                                                            }
                                                            else {
                                                                sortMethod = 'more';
                                                                button.children(TextView).first().text = 'Более популярные';
                                                            }
                                                        })
                                                )
                                        ),
                                    new CollectionView({
                                        left: 25, right: 25, top: 'prev() 25', height: device.screenHeight * 0.55, scrollbarVisible: false,
                                        itemCount: inputArray.length,
                                        createCell: () => {
                                            let cell = new Composite({ left: 0, right: 0 });
                                            new Composite({ padding: 15, background: currentStyle.colors.contrast, left: 0, right: 0, cornerRadius: 18, highlightOnTouch: true })
                                                .append(
                                                    new ImageView({ centerY: 0, scaleMode: 'fill', height: 50, width: 50, cornerRadius: 18, background: currentStyle.colors.moreContrast }),
                                                    new TextView({ left: 'prev() 15', right: 'next() 15', centerY: 0, text: 'Классный заголовок', font: 'bold 16px', textColor: currentStyle.colors.opposite }),
                                                    new Composite({ right: 0, centerY: 0 })
                                                        .append(
                                                            new Composite()
                                                                .append(
                                                                    new ImageView({ centerY: 0, height: 15, image: currentStyle.icons.compass, tintColor: currentStyle.colors.opposite }),
                                                                    new TextView({ class: 'distance-text', centerY: 0, left: 'prev() 15', text: 'XX км', font: '16px', textColor: currentStyle.colors.opposite })
                                                                ),
                                                            new Composite({ left: 'prev() 15' })
                                                                .append(
                                                                    new ImageView({ centerY: 0, height: 15, image: currentStyle.icons.menu.map, tintColor: currentStyle.colors.opposite }),
                                                                    new TextView({ class: 'followers-text', centerY: 0, left: 'prev() 15', text: 'XX', font: '16px', textColor: currentStyle.colors.opposite })
                                                                )
                                                        )
                                                )
                                                .appendTo(cell);
                                            return cell;
                                        },
                                        updateCell: (cell, i) => {
                                            if (i != 0) cell.padding = { top: 25 }
                                            else cell.padding = 0;

                                            let p = inputArray[i];
                                            cell.find(ImageView).first().image = p.place.photos[0];
                                            cell.find('.distance-text').first(TextView).text = `${getDistance(myPos[0], myPos[1], p.position[0], p.position[1])} км`;
                                            cell.find('.followers-text').first(TextView).text = p.followers.length.toString();
                                            cell.onTap(() => new StaticVolcanoRollUp(p));
                                        }
                                    })
                                );
                        }
                    });
            });
    });