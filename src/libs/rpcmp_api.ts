import { Certificates, AddCertificateResponseData, User, MapPoint, PointPlace, RemovePointResponseData, GetPointDataResponseData, FollowPlaceResponseData, UnfollowPlaceResponseData, ReverseGeocodeResponseData, APIResponse, SetProfileDataResponseData, AddPointResponseData, AuthResponseData, GetPointsResponseData, GetAllActivePointsResponseData, GetStoryLineResponseData } from './interfaces';
import config = require('../config');

function call<T>(action: string, data: any) {
    return new Promise<T>((resolve, reject) => {
        fetch(config.API_GATEWAY, { method: 'POST', body: JSON.stringify(Object.assign({ action: action }, data)), headers: { 'Content-Type': 'application/json' } })
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
    checkConnection: () => new Promise((resolve, reject) => {
        fetch(config.API_GATEWAY, { timeout: 1000, headers: { 'Content-Type': 'application/json' } } as any)
            .then(() => resolve())
            .catch(() => reject());
    }),
    users: {
        auth: (values: { email?: string; token?: string; password?: string; social?: { github?: { code: string; }; vk?: { token: string; }, google?: { token: string; } } }) => call<AuthResponseData>('users.auth', values),
        addCertificate: (values: { id: Certificates }) => call<AddCertificateResponseData>('users.addCertificate', Object.assign(values, { token: localStorage.getItem('token') })),
        setProfileData: (values: { name?: User['name']; email?: User['email']; password?: string; token: User['token'] }) => call<SetProfileDataResponseData>('users.setProfileData', values),
        getPoints: (values?: { owner?: User['id'], filter?: 'active' | 'past' }) => call<GetPointsResponseData>('users.getPoints', Object.assign(values, { token: localStorage.getItem('token') }))
    },
    map: {
        addPoint: (values: { type: 'volcano', place: PointPlace, position: MapPoint['position'], date: MapPoint['date'] }) => call<AddPointResponseData>('map.addPoint', Object.assign(values, { token: localStorage.getItem('token') })),
        removePoint: (values: { id: MapPoint['id']; }) => call<RemovePointResponseData>('map.removePoint', Object.assign(values, { token: localStorage.getItem('token') })),
        getPointData: (values: { id: MapPoint['id']; }) => call<GetPointDataResponseData>('map.getPointData', Object.assign(values, { token: localStorage.getItem('token') })),
        followPlace: (values: { id: MapPoint['id']; }) => call<FollowPlaceResponseData>('map.followPlace', Object.assign(values, { token: localStorage.getItem('token') })),
        unfollowPlace: (values: { id: MapPoint['id']; }) => call<UnfollowPlaceResponseData>('map.unfollowPlace', Object.assign(values, { token: localStorage.getItem('token') })),
        getAllActivePoints: () => call<GetAllActivePointsResponseData>('map.getAllActivePoints', { token: localStorage.getItem('token') })
    },
    utils: {
        reverseGeocode: (values: { point: Array<number>; }) => call<ReverseGeocodeResponseData>('utils.reverseGeocode', Object.assign(values, { token: localStorage.getItem('token') }))
    },
    feed: {
        getStoryLine: () => call<GetStoryLineResponseData>('feed.getStoryLine', { token: localStorage.getItem('token') })
    }
}