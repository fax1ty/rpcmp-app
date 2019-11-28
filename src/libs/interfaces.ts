export interface APIResponse {
    data?: any;
    error?: {
        code: number;
        message: string;
    }
}

export enum Certificates {
    MAIN = 1
}

export interface User {
    id: number;
    token: string;
    certificates: Array<Certificates>;
    name: string;
    email: string;
}

export interface AuthResponseData {
    user: User
    reference: 'socials' | 'rpcmp'
    type: 'login' | 'register'
}

export interface AddCertificateResponseData {
    editedCount: number;
}

export interface SetProfileDataResponseData {
    user: User;
}

export interface AddPointResponseData {
    point: MapPoint;
}

export interface MapPoint {
    id: string;
    followers: Array<User['id']>;
    owner: User['id'];
    place: PointPlace;
    date: Date;
    position: Array<number>;
}

export interface PointPlace {
    text: string;
    title: string;
    photos: Array<string>;
    address: string;
}

export interface ReverseGeocodeResponseData {
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

export interface RemovePointResponseData {
    editedCount: number;
}

export interface GetPointDataResponseData {
    editedCount: number;
}

export interface FollowPlaceResponseData {
    editedCount: number;
}

export interface UnfollowPlaceResponseData {
    editedCount: number;
}

export interface GetPointsResponseData {
    items: Array<MapPoint>;
}

export interface GetAllActivePointsResponseData {
    items: Array<MapPoint>;
}

export interface GetStoryLineResponseData {
    items: Array<FeedContent>;
}

export interface FeedContent {
    type: 'story' | 'post' | 'place';
    content: {
        title: string;
        text: string;
        background: string;
    }
    point?: MapPoint;
}

export interface AddFirebaseTokenResponseData {
    editedCount: number;
}