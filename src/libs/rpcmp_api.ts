interface APIResponse {
    data?: any;
    error?: {
        code: number;
        message: string;
    }
}

enum Certificates {
    MAIN = 1
}

interface User {
    token: string;
    certificates: Array<Certificates>;
    name: string;
    email: string;
}

interface AuthResponseData {
    user: User
    reference: 'socials' | 'rpcmp'
    type: 'login' | 'register'
}

interface AddCertificateResponseData {
    editedCount: number;
}

interface SetProfileDataResponseData {
    editedCount: number;
}

interface AddPointResponseData {
    editedCount: number;
}

interface ReverseGeocodeResponseData {
    house_number: string;
    city: string;
    cafe: string;
    road: string;
    suburb: string;
    county: string;
    region: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
}

let GATEWAY = 'http://85.113.37.241:8000/api/v1';

function call<T>(action: string, data: any) {
    return new Promise<T>((resolve, reject) => {
        fetch(GATEWAY, { method: 'POST', body: JSON.stringify(Object.assign({ action: action }, data)), headers: { 'Content-Type': 'application/json' } })
            .then((data) => data.json().then((data: APIResponse) => {
                if (!data.error) resolve(data.data as any);
                else reject(data.error);
            })
                .catch(err => reject(err))
            )
            .catch(err => reject(err));
    });
}

export = {
    users: {
        auth: (values: { id?: string; token?: string; password?: string; social?: { github?: { code: string; }; vk?: { token: string; }, google?: { token: string; } } }) => call<AuthResponseData>('users.auth', values),
        addCertificate: (values: { id: Certificates }) => call<AddCertificateResponseData>('users.addCertificate', Object.assign(values, { token: localStorage.getItem('token') })),
        setProfileData: (values: { name?: User['name']; email?: User['email']; password?: string; token: User['token'] }) => call<SetProfileDataResponseData>('users.setProfileData', values)
    },
    map: {
        addPoint: (values: {}) => call<AddPointResponseData>('map.addPoint', values)
    },
    utils: {
        reverseGeocode: (values: { point: Array<number>; }) => call<ReverseGeocodeResponseData>('utils.reverseGeocode', Object.assign(values, { token: localStorage.getItem('token') }))
    }
}