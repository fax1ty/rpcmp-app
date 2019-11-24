interface CrashlyticsPlugin {
    initialise: () => CrashlyticsPluginInstance;
}

declare enum LOG {
    VERBOSE, DEBUG, INFO, WARN, ERROR
}

interface CrashlyticsPluginInstance {
    crash: () => void;
    logPriority: (priority: LOG, tag: string, message: string) => void;
    log: (message: string) => void;
    logException: (value: string) => void;
    setString: (key: string, value: string) => void;
    setBool: (key: string, value: boolean) => void;
    setDouble: (key: string, value: number) => void;
    setFloat: (key: string, value: number) => void;
    setInt: (key: string, value: number) => void;
    setUserIdentifier: (identifier: string) => void;
}

declare const FirebaseCrashlytics: CrashlyticsPlugin;