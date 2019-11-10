interface GoogleUserData {
    accessToken: string;
    expires: number;
    expires_in: number;
    email: number;
    userId: string;
    displayName: string;
    familyName: string;
    givenName: string;
}

interface CordovaPlugins {
    googleplus: {
        login: (options?: { scopes?: string; webClientId?: string; offline?: boolean; }, cb?: (data: GoogleUserData) => void, err?: (msg: string) => void) => void;
        disconnect: (cb?: (msg: string) => void) => void;
    }
}