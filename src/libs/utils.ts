import { fs } from 'tabris';

export function encodeArrayBufferAsBase64(arraybuffer: ArrayBuffer) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    let bytes = new Uint8Array(arraybuffer),
        i, len = bytes.length, base64 = '';

    for (i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
        base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }

    return base64;
}

interface ImgurResponse {
    data: {
        id: string;
        title: null | string;
        description: null | string;
        datetime: number;
        type: string;
        animated: boolean;
        width: number;
        height: number;
        size: number;
        views: number;
        bandwidth: number;
        vote: null | number;
        favorite: boolean;
        nsfw: null | any;
        section: null | string;
        account_url: null | string;
        account_id: number;
        is_ad: boolean;
        in_most_viral: boolean;
        tags: Array<string>;
        ad_type: number;
        ad_url: string;
        in_gallery: boolean,
        deletehash: string;
        name: string;
        link: string;
    },
    success: boolean;
    status: number;
}

let IMGUR_CLIENT_ID = 'dbd936330207126';

export function uploadImage(uri: string) {
    return new Promise<ImgurResponse['data']['link']>((resolve, reject) => {
        fs.readFile(uri)
            .then(buffer => {
                let formData = new FormData();
                formData.append('image', encodeArrayBufferAsBase64(buffer));
                fetch('https://api.imgur.com/3/image', { method: 'POST', body: formData, headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` } })
                    .then(response => {
                        if (response) {
                            response.json()
                                .then((data: ImgurResponse) => {
                                    if (data.success) resolve(data.data.link);
                                    else reject(data.status);
                                })
                                .catch(err => reject(err));
                        }
                        else reject('Network error');
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}