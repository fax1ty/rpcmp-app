import { Tab, ImageView, Composite, TextView, ActivityIndicator } from "tabris";
import { currentStyle } from "..";
import { StaticVolcanoRollUp } from "../libs/components";

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
                navigator.geolocation.getCurrentPosition(pos => {
                    myPos = [pos.coords.latitude, pos.coords.longitude];
                    map.moveToPosition(myPos, 3 * 1000, { animate: false });
                    let marker = new esmaps.Marker({ position: myPos, image: { width: 100, height: 100, src: 'https://i.imgur.com/hTfbBkS.png' } })
                        .on('tap', () => new StaticVolcanoRollUp());
                    map.addMarker(marker);
                    map.once('cameraMoved', () => {
                        whereImButton.animate({ opacity: 1 }, { duration: 500 })
                            .then(() => whereImButton.enabled = true);
                    });
                    loader.dispose();
                }, err => console.error(err));

                let newVolcanoButton = new ImageView({ elevation: 3, right: 25, bottom: 25, width: 50, height: 50, cornerRadius: 25, background: currentStyle.colors.moreContrast, image: currentStyle.icons.plus, padding: 20, tintColor: '#fff', highlightOnTouch: true })
                    .insertBefore(loader)
                    .onTap(({ target: button }) => {
                        button.enabled = false;
                        button.animate({ opacity: 0 }, { duration: 500, easing: 'ease-out' })
                            .then(() => {
                                let lastPosition = new Array<number>();
                                let lastMarker: TabrisMarker;

                                let mapTapFunc = ({ position }: { position: Array<number> }) => {
                                    if (lastPosition.length == 0) {
                                        let acceptButton = new ImageView({ opacity: 0, enabled: false, right: 25, bottom: 25, width: 50, height: 50, cornerRadius: 25, background: currentStyle.colors.main, elevation: 3, image: 'https://i.imgur.com/15j7lXi.png', padding: 20, tintColor: currentStyle.colors.opposite, highlightOnTouch: true })
                                            .appendTo(tab)
                                            .onTap.once(({ target: button }) => {
                                                button.dispose();
                                                $('#pick-place-header').dispose();
                                                map.off('tap', mapTapFunc);
                                                lastMarker.on('tap', () => new StaticVolcanoRollUp());
                                                newVolcanoButton.animate({ opacity: 1 }, { duration: 500, delay: 1000, easing: 'ease-out' })
                                                    .then(() => newVolcanoButton.enabled = true);
                                            });
                                        acceptButton.animate({ opacity: 1 }, { easing: 'ease-out' })
                                            .then(() => acceptButton.enabled = true);
                                    }

                                    if (lastPosition != position) {
                                        lastPosition = position;
                                        if (lastMarker) map.removeMarker(lastMarker);
                                        let marker = new esmaps.Marker({ position: position, image: { width: 100, height: 100, scale: 1, src: 'https://i.imgur.com/hTfbBkS.png' } });
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
                    });
            });
    });