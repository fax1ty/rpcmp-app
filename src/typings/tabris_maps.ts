import { Properties, Widget, ImageLikeObject } from 'tabris';

interface MapProps {
    position: Array<number>;
    region: { southWest: MapProps['position']; northEast: MapProps['position'] };
    camera: { position: MapProps['position'] };
    mapType: 'none' | 'hybrid' | 'normal' | 'satellite' | 'terrain' | 'satelliteflyover' | 'hybridflyover'
}

declare global {
    namespace esmaps {
        const Map: {
            new(props: Properties<Widget> | { position: MapProps['position']; region: MapProps['region']; camera: MapProps['camera']; showMyLocation: boolean; showMyLocationButton: boolean; myLocation: MapProps['position']; mapType: MapProps['mapType'] }): TabrisMap;
        };
        const Marker: {
            new(props: { position: MapProps['position']; image: ImageLikeObject | string }): TabrisMarker;
        }
    }

    interface TabrisMap {
        //? Properties
        /** The current center position of the map. The array has to be a two element tuple consisting of latitude and longitude. */
        position: MapProps['position'];
        /** Describes the currently visible rectangle of the map. A region object has the two properties 'southEast' and 'northWest' that span the visible region of the map. In case the map is tilted the region is represented by the smallest possible rectangle that could contain the trapezoid representing the visible region. */
        region: MapProps['region'];
        /** Represents the orientation of the camera. The camera currently only holds the one property position. It is the same property as the top level property position. */
        camera: MapProps['camera'];
        /** Displays the current location of the user on the map. To activate the option the app has to have the necessary permissions to retrieve the users location. Be aware that the position has to be obtained by the device so the effect might no be visible immediately. */
        showMyLocation: boolean;
        /** Displays a button to animate the camera to the current location of the user when the location is available. Can only be activated when showMyLocation is enabled. The property is only available on Android but a similar effect can be achieved with the moveTo functions. */
        showMyLocationButton: boolean;
        /** Retrieves the current location of the user. The returned array is a position array consisting of latitude and longitude. Can only be used when showMyLocation is enabled. Since the location obtained by showMyLocation is not available immediately this call can return null or undefined. The property is read only. */
        myLocation: MapProps['position'];
        /** Defines how the map is visualized. The most common properties are normal and sattelite. Not all variants are supported on each platform. hybrid; normal; satellite are supported on Android and iOS whereas none; and terrain is only available on Android and satelliteflyover and hybridflyover is only available on iOS. */
        mapType: MapProps['mapType'];

        //? Events
        off(event: 'ready' | 'tap' | 'longpress' | 'cameraMoved' | 'cameraChanged', callback: Function): void;
        /**
         * Registers a *listener* function to be notified of events of the given *type*.
         * @param event The 'ready' event is fired when the map is fully initialized and ready for user interaction. The properties and functions of the Map can only be accessed after the ready event has fired.
         * @param callback The function that will be performed when the event is triggered
         */
        on(event: 'ready', callback: ({ target }: { target: TabrisMap; }) => void): Widget;
        once(event: 'ready', callback: ({ target }: { target: TabrisMap; }) => void): Widget;
        /**
        * Registers a *listener* function to be notified of events of the given *type*.
        * @param event The 'tap' event is fired when a tap on a map is detected.
        * @param callback The function that will be performed when the event is triggered
        */
        on(event: 'tap', callback: ({ target, position }: { target: TabrisMap, position: MapProps['position'] }) => void): Widget;
        once(event: 'tap', callback: ({ target, position }: { target: TabrisMap, position: MapProps['position'] }) => void): Widget;
        /**
        * Registers a *listener* function to be notified of events of the given *type*.
        * @param event The 'longpress' event is fired when a long press on a map is detected.
        * @param callback The function that will be performed when the event is triggered
        */
        on(event: 'longpress', callback: ({ target, position }: { target: TabrisMap, position: MapProps['position'] }) => void): Widget;
        once(event: 'longpress', callback: ({ target, position }: { target: TabrisMap, position: MapProps['position'] }) => void): Widget;
        /**
        * Registers a *listener* function to be notified of events of the given *type*.
        * @param event The 'cameraMoved' event is fired when the user changed the position of the map by interacting with the map via touch. The callback is not guaranteed to fire continuously but rather when the map has reached a resting position.
        * @param callback The function that will be performed when the event is triggered
        */
        on(event: 'cameraMoved', callback: ({ target, camera }: { target: TabrisMap, camera: MapProps['camera'] }) => void): Widget;
        once(event: 'cameraMoved', callback: ({ target, camera }: { target: TabrisMap, camera: MapProps['camera'] }) => void): Widget;
        /**
        * Registers a *listener* function to be notified of events of the given *type*.
        * @param event The 'cameraChanged' event is fired when the position of the map has reached its final destination by a programmatic camera change. E.g. by setting the position or using one of the moveTo functions.
        * @param callback The function that will be performed when the event is triggered
        */
        on(event: 'cameraChanged', callback: ({ target, camera }: { target: TabrisMap; camera: MapProps['camera']; }) => void): Widget;
        once(event: 'cameraChanged', callback: ({ target, camera }: { target: TabrisMap; camera: MapProps['camera']; }) => void): Widget;

        //? Methods
        /**
         * The function 'moveToPosition()' updates the cameras center to a new position and makes sure the given radius is fully contained in the visible region. This function resets the maps tilt.
         * @param position The target center position of the map as an array of latitude and longitude. E.g. [48.8644458; 2.3589976].
         * @param radius The radius in meters that should be visible on the map. Effectively this parameter controls the "zoom" level of the map.
         */
        moveToPosition(position: MapProps['position'], radius: number): void
        /**
         * The function 'moveToPosition()' updates the cameras center to a new position and makes sure the given radius is fully contained in the visible region. This function resets the maps tilt.
         * @param position The target center position of the map as an array of latitude and longitude. E.g. [48.8644458; 2.3589976].
         * @param radius The radius in meters that should be visible on the map. Effectively this parameter controls the "zoom" level of the map.
         * @param options The optional options object contains additional information for the camera placement.
         */
        moveToPosition(position: MapProps['position'], radius: number, options: { padding?: number; animate?: boolean }): void;
        /**
         * The function 'moveToPosition()' sets the cameras center to a new position and makes sure the given radius is fully contained in the visible region. This function resets the maps tilt.
         * @param region The visible area to show on the map. The format of the region parameter is the same as for the region property. It consists of two properties southEast and northWest to span the visible region of the map. E.g. {southWest: [48.8644458; 2.3589976]; northEast: [48.8821597;2.3856527]}
         */
        moveToRegion(region: MapProps['region']): void;
        /**
         * The function 'moveToPosition()' sets the cameras center to a new position and makes sure the given radius is fully contained in the visible region. This function resets the maps tilt.
         * @param region The visible area to show on the map. The format of the region parameter is the same as for the region property. It consists of two properties southEast and northWest to span the visible region of the map. E.g. {southWest: [48.8644458; 2.3589976]; northEast: [48.8821597;2.3856527]}
         * @param options The optional options object contains additional information for the camera placement.
         */
        moveToRegion(region: MapProps['region'], options: { padding?: number; animate?: boolean }): void;
        /**
         * The function 'addMarker(marker)' adds a marker to the map. When a map gets disposed all of its previously added markers are disposed with it.
         * @param marker Marker to be created on the map
         */
        addMarker(marker: TabrisMarker): void;
        /**
         * The function 'removeMarker(marker)' removes a marker from the map.
         * @param marker Marker to be removed from the map
         */
        removeMarker(marker: TabrisMarker): void;
        /** The function 'getMarkers()' returns an array of all currently added markers. */
        getMarkers(): Array<TabrisMarker>;

        appendTo(widget: Widget): this;

        //! experimental
        setMapStyle(style: string): void // fully ready
        setAllGesturesEnabled(enabled: boolean): void // fully ready
        /** Returns X and Y in PX */
        positionToScreenPoint(position: MapProps['position']): [number, number] // fully ready
        screenPointToPosition(point: MapProps['position']): [number, number] | null // need more tests
    }

    interface TabrisMarker {
        //? Properties
        /** The current position of the marker if set. The position is an array consisting of latitude and longitude: E.g. [48.8644458, 2.3589976] */
        position: MapProps['position'];
        /** Image to be shown instead of the standard marker image. */
        image?: ImageLikeObject | string;

        //? Events
        /**
        * Registers a *listener* function to be notified of events of the given *type*.
        * @param event The tap event is fired when the user taps on a marker.
        * @param callback The function that will be performed when the event is triggered
        */
        on(event: 'tap', callback: ({ target }: { target: TabrisMarker }) => void): TabrisMarker;

        //? Methods
        /** Remove a marker from the map. */
        dispose(): void
    }
}