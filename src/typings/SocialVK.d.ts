interface VKAuth {
    init: (appID: string) => void;
    login: (scopes: ['offline'?], cb: (data: string) => void) => void;
}

declare const SocialVk: VKAuth;