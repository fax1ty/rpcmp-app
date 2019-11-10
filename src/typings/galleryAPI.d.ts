interface GalleryItem {
    id: string;
    title: string;
    lat: number;
    lon: number;
    thumbnail: string;
    data: string;
    width: number;
    height: number;
    size: number;
    date_create: string;
}

interface GalleryAlbum {
    id: string;
    title: string;
}

interface GalleryAPI {
    getAlbums: () => Array<GalleryAlbum>;
    getMedia: (album: GalleryAlbum, cb: (items: Array<GalleryItem>) => void) => void;
}

declare const galleryAPI: GalleryAPI;