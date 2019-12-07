interface Navigator {
    /** Will vibrate device for some amount of time
     * @param duration Duration of vibration
     * 0 will immediately cancels any currently running vibration.
     * [1000, 1000, 3000] vibrate for 1000ms, wait for 1000ms, vibrate for 3000ms
     */
    vibrate: (duration: number | Array<number>) => boolean;
}