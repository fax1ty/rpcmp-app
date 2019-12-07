import { Tab, ImageView, Composite, TextView, ActivityIndicator, device, CollectionView, Slider } from 'tabris';
import { currentStyle } from '..';
import { StaticVolcanoRollUp, GroupVolcanoRollUp, NewVolcanoRollUp } from '../libs/components';
import { RollUp, Notification } from '../libs/ui';
import rpcmp_api = require('../libs/rpcmp_api');
import { getDistance } from '../libs/utils';
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
                                marker.on('tap', () => point.verified ? new GroupVolcanoRollUp(point) : new StaticVolcanoRollUp(point, marker))
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
                                                    let isGeocodingInProcess = false;
                                                    $('#cancel-button').first().dispose();
                                                    let acceptButton = new ImageView({ opacity: 0, enabled: false, right: 25, bottom: 25, width: 50, height: 50, cornerRadius: 25, background: currentStyle.colors.main, elevation: 3, image: currentStyle.icons.check, padding: 20, tintColor: currentStyle.colors.opposite, highlightOnTouch: true })
                                                        .appendTo(tab)
                                                        .onTap(({ target: button }) => {
                                                            if (!isGeocodingInProcess) {
                                                                isGeocodingInProcess = true;
                                                                rpcmp_api.utils.reverseGeocode({ point: lastMarker.position })
                                                                    .then(data => {
                                                                        isGeocodingInProcess = false;
                                                                        let posAddress = `${data.country}, ${data.city}${data.road ? `, ${data.road}` : ''}${data.house_number ? `, ${data.house_number}` : ''}`;

                                                                        button.dispose();
                                                                        $('#pick-place-header').dispose();
                                                                        map.off('tap', mapTapFunc);
                                                                        newVolcanoButton.animate({ opacity: 1 }, { duration: 500, delay: 1000 })
                                                                            .then(() => newVolcanoButton.enabled = true);

                                                                        $(RollUp).length == 0 ? new NewVolcanoRollUp(posAddress, myPos, lastMarker, mapPoints)
                                                                            .onDispose.once(({ target }) => { if (!target.isNeedToSave) map.removeMarker(lastMarker); }) : null;
                                                                    })
                                                                    .catch(err => console.error(err));
                                                            }
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
                        if ($(RollUp).length == 0) {
                            let sortMethod: 'more' | 'less' = 'more';
                            let filterDistance = 10;
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
                                                        new ImageView({ centerY: 0, scaleMode: 'fill', height: 50, width: 50, cornerRadius: 8, background: currentStyle.colors.moreContrast }),
                                                        new TextView({ class: 'place-title', left: 'prev() 15', right: 'next() 15', centerY: 0, text: 'Классный заголовок', font: 'bold 16px', textColor: currentStyle.colors.opposite }),
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
                                            updateCell: (cell: Composite, i: number) => {
                                                if (i != 0) cell.padding = { top: 25 }
                                                else cell.padding = 0;

                                                let p = inputArray[i];
                                                cell.find(Composite).first().onTap(() => {
                                                    if ($('.place-rollup').length == 0) { let roll = new StaticVolcanoRollUp(p); roll.class = 'place-rollup'; }
                                                });
                                                cell.find(ImageView).first().image = p.place.photos[0];
                                                cell.find('.place-title').first(TextView).text = p.place.title;
                                                cell.find('.distance-text').first(TextView).text = `${getDistance(myPos[0], myPos[1], p.position[0], p.position[1]).toFixed(2)} км`;
                                                cell.find('.followers-text').first(TextView).text = p.followers.length.toString();
                                            }
                                        })
                                    );
                            }
                        }
                    });
            });
    });