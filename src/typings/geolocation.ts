interface Navigator {
    geolocation:
    {
        getCurrentPosition: (
            geolocationSuccess: (pos: GeolocationPosition) => void,
            geolocationError?: (err: GeolocationError) => void,
            geolocationOptions?: GeolocationOption
        ) => void;
        watchPosition: (
            geolocationSuccess: (pos: GeolocationPosition) => void,
            geolocationError?: (err: GeolocationError) => void,
            geolocationOptions?: GeolocationOption
        ) => string;
        clearWatch: (id: string) => void;
    }
}

interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
        altitude: number;
        accuracy: number;
        altitudeAccuracy: number | null;
        heading: number;
        speed: number;
    };
    timestamp: number;
}

interface GeolocationError {
    code: number;
    message: string;
}

interface GeolocationOption {
    maximumAge: number;
    timeout: number;
    enableHighAccuracy: boolean;
}