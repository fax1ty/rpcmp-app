// The author of this code is fax1ty.

// Hi, this part of the code I give just like that. 
// If you see something that you like - don't be afraid to use it. 
// This file is licensed under the WTFPL

// If you find a bug, please email me at fax1ty.ru@gmail.com

import { device, Composite, contentView, TextView, ImageView, app, ImageValue, Widget, Properties, statusBar, navigationBar, ColorValue } from 'tabris';

// This shitty code is needed to get the size of contentView after measuring
let contentViewHeight: number = device.screenHeight - (statusBar.displayMode == 'float' ? 0 : statusBar.height) - (true ? 0 : navigationBar.height);
contentView.onResize(({ height }) => contentViewHeight = height);

// This code controls the closing of the RollUp and Popover widgets. 
// If you don't need to control closing with the back key, 
// comment out or delete this part of the code
app.onBackNavigation((event) => {
    let isDone = false;
    contentView.children().toArray().reverse().forEach(c => {
        // Option 1: app always be unclosable
        // Option 2: app is closable, but if something triggers 'onBackNavigation', 
        // event will be overwtitter, due custom widget scopes
        event.preventDefault(); // option 1
        if (!isDone && c instanceof PopUp) {
            c.close();
            isDone = true;
        }
        else if (!isDone && c.class == 'rollup') {
            // event.preventDefault(); // option 2
            let rollUp = (c as Composite).find(RollUp).first();
            if (rollUp.isClosable) {
                rollUp.close();
                isDone = true;
            }
        }
        else if (!isDone && c instanceof Popover) {
            // event.preventDefault(); // option 2
            if (c.isClosable) {
                c.close();
                isDone = true;
            }
        }
        // just comment out this fragment if you don't use vibration plugin in your app
        else if (!isDone && navigator.vibrate) {
            navigator.vibrate(250);
            isDone = true;
        }
    });
});

interface RollUpValues {
    /** Label on top of widget */
    title: string;
    colors?: {
        title: string,
        background: string
    };
    /** Indicates whether the widget needs to be closed. Default: **true** */
    isClosable?: boolean;
    /** Indicates whether to darken behind the widget. Default: **true** */
    isDim?: boolean;
    noBottomGap?: boolean;
}

export class RollUp extends Composite {
    title: TextView;

    private dim = new Composite({ left: 0, right: 0, bottom: 0, top: 0, background: '#000', opacity: 0 })
        .appendTo(contentView);
    rollUpBox = new Composite({ class: 'rollup', left: 0, right: 0, top: contentViewHeight, cornerRadius: 10 });
    private header = new Composite({ left: 25, right: 25, top: 25 })
        .appendTo(this.rollUpBox);
    arrow = new ImageView({ opacity: 0, right: 0, centerY: 0, image: 'https://i.imgur.com/UBbmWD6.png', height: 15 })
        .appendTo(this.header);
    private noTap = () => { if (this.isClosable) this.close(); }
    private closeTap = () => this.close();
    private colors = { background: '#fff', title: '#000' }

    private _isClosable: boolean;
    get isClosable() { return this._isClosable; }
    set isClosable(value: boolean) {
        this._isClosable = value;
        if (value === true) {
            this.arrow.onTap.once(this.closeTap);
            this.rollUpBox.onSwipeDown.once(this.closeTap);
            this.arrow.animate({ opacity: 1 }, { duration: 500 });
        } else {
            this.arrow.onTap.removeListener(this.closeTap);
            this.rollUpBox.onSwipeDown.removeListener(this.closeTap);
            this.arrow.animate({ opacity: 0 }, { duration: 500 });
        }
    }

    private _isDim: boolean;
    get isDim() { return this._isDim; }
    set isDim(value: boolean) {
        this._isDim = value;
        if (value === true) {
            this.dim.onTap.addListener(this.noTap);
            this.dim.animate({ opacity: 0.35 }, { duration: 1000 });
        } else {
            this.dim.onTap.removeListener(this.noTap);
            this.dim.animate({ opacity: 0 }, { duration: 1000 });
        }
    }

    /**
     * Minimizes the widget and permanently deletes it from memory. 
     * If you want to remove it without animation, use Rollup.dispose()
     */
    close() {
        if (this.isDim) this.dim.animate({ opacity: 0 }, { duration: 900 })
            .then(() => this.dim.dispose()); else { this.dim.dispose(); }
        this.isClosable = false;
        this.rollUpBox.animate({ transform: { translationY: this.absoluteBounds.height } }, { duration: 1000 })
            .then(() => {
                this.rollUpBox.dispose();
            })
            .catch(e => console.error(e));
    }

    /**
     * A bottom-up widget inside which you can attach other widgets.
     * 
     * Important: the body of the widget will not have a RollUp class due to the its structure. 
     * Look for a widget with class "rollup", otherwise, when you find RollUp, 
     * you will find only the inner part where the widgets are inserted.
     * You can see an example in the code above.
     */
    constructor(values: RollUpValues) {
        super({ top: 'prev() 15', left: 0, right: 0 });

        if (values.colors) {
            if (values.colors.background) this.colors.background = values.colors.background;
            if (values.colors.title) this.colors.title = values.colors.title;
        }
        if (values.isClosable === false) this.isClosable = values.isClosable; else this.isClosable = true;
        if (values.isDim === false) this.isDim = values.isDim; else this.isDim = true;

        this.rollUpBox.background = this.colors.background;
        // My thoughts: https://pastebin.com/3XdEaBrV
        // Just do it! Make *my* dreams come true. https://github.com/eclipsesource/tabris-js/issues/1883
        this.title = new TextView({ text: values.title, textColor: this.colors.title, font: 'bold 24px' })
            .appendTo(this.header);
        this.arrow.tintColor = this.colors.title
        this.appendTo(this.rollUpBox);
        if (!values.noBottomGap) this.rollUpBox.append(new Composite({ left: 0, right: 0, height: 25, top: 'prev() 0' }));

        this.rollUpBox.appendTo(contentView);
        this.rollUpBox.onResize.once(({ height }) =>
            this.rollUpBox.animate({ transform: { translationY: -height } }, { duration: 1000 })
                .then(() => this.trigger('open'))
        );
    }
}

interface NotificationValues {
    image?: ImageValue,
    colors?: {
        text?: string,
        background?: string
    },
    closeCondition?: {
        autoDuration?: number,
        userInteraction?: true
    }, title?: string, text?: string
}

export class Notification extends Composite {
    image = new ImageView({ centerY: 0, height: 50, width: 50, cornerRadius: 50 / 2, scaleMode: 'fill' })
        .appendTo(this);

    readonly colors = { text: '#000', background: '#fff' };

    close(direction: 'left' | 'rigth' | 'up') {
        if (direction == 'left') this.animate({ transform: { translationX: -this.absoluteBounds.width } }, { duration: 1000 })
            .then(() => this.dispose());
        else if (direction == 'rigth') this.animate({ transform: { translationX: this.absoluteBounds.width } }, { duration: 1000 })
            .then(() => this.dispose());
        else this.animate({ transform: { translationY: -this.absoluteBounds.height } }, { duration: 1000 })
            .then(() => this.dispose());
    }

    constructor(values: NotificationValues) {
        super({ bottom: contentViewHeight, left: 25, right: 25, cornerRadius: 10, padding: 15, elevation: 15 });

        if (values.image) this.image.image = values.image;

        if (values.colors) {
            if (values.colors.background && typeof values.colors.background == 'string') this.colors.background = values.colors.background;
            if (values.colors.text && typeof values.colors.text == 'string') this.colors.text = values.colors.text;
        }

        this.background = this.colors.background;

        let contentBox = new Composite({ centerY: 0, left: 'prev() 25', right: 25 })
            .appendTo(this);
        if (values.title) new TextView({ text: values.title, left: 0, right: 0, font: 'bold 16px', textColor: this.colors.text })
            .appendTo(contentBox);
        if (values.text) new TextView({ text: values.text, left: 0, right: 0, top: 'prev() 0', textColor: this.colors.text })
            .appendTo(contentBox);

        this.appendTo(contentView);
        this.onResize.once(({ height }) => {
            this.animate({ transform: { translationY: height + 20 } }, { duration: 1000 })
                .then(() => {
                    let closeTimer = 1000;
                    let needInteraction = false;
                    if (values.closeCondition) {
                        if (values.closeCondition.autoDuration) closeTimer = values.closeCondition.autoDuration;
                        if (values.closeCondition.userInteraction) needInteraction = values.closeCondition.userInteraction;
                    }
                    if (needInteraction === true) {
                        // this.onSwipeLeft.once(() => this.close('left'));
                        // this.onSwipeRight.once(() => this.close('rigth'));
                        this.onSwipeUp.once(() => this.close('up'));
                    } else {
                        setTimeout(() => this.close('up'), closeTimer);
                    }
                });
        });
    }
}

interface NotyProperties {
    content: Widget;
    duration: number;
    colors?: {
        background?: string,
        status?: string
    }
}

export class Noty extends Composite {
    private dim = new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: '#000', opacity: 0 })
        .appendTo(contentView);

    private colors = { background: '#fff', status: '#000' };
    get statusColor() { return this.colors.status; }
    set statusColor(value: string) {
        this.colors.status = value;
        this.status.background = value;
    }

    private status = new Composite({
        left: 0,
        right: '99%',
        height: 5,
        top: 'next() 25',
        background: this.colors.status
    })
        .appendTo(this);

    close() {
        this.dim.animate({ opacity: 0 }, { duration: 700 })
            .then(() => this.dim.dispose());
        this.animate({ opacity: 0 }, { duration: 1000 })
            .then(() => this.dispose());
    }

    constructor(values: NotyProperties) {
        super({ cornerRadius: 10, elevation: 3, centerY: 0, opacity: 0, left: 25, right: 25 });

        if (values.colors) {
            if (values.colors.background) this.colors.background = values.colors.background;
            if (values.colors.status) this.colors.status = values.colors.status;
        }

        this.background = this.colors.background;

        this.append(values.content)
            .appendTo(contentView);

        this.dim.animate({ opacity: 0.35 }, { duration: 1000 });
        this.animate({ opacity: 1 }, { duration: 1000 })
            .then(() => {
                this.status.animate({ transform: { scaleX: 100 * 2 } }, { duration: values.duration })
                    .then(() => this.close());
            });
    }
}

export class Popover extends Composite {
    isClosable = true;
    crossIcon: ImageView = new ImageView({ left: 25, top: statusBar.displayMode == 'float' ? statusBar.height + 25 : 25, image: 'https://i.imgur.com/nf0Vc6o.png', height: 20, tintColor: '#000' })
        .onTap.once(() => this.close());
    content = new Composite({ left: 0, right: 0, bottom: 0, top: 0 });

    private previousStatusBarTheme = statusBar.theme;

    readonly animationDuration: number = 1000;

    close() {
        if (statusBar.theme != this.previousStatusBarTheme) statusBar.theme = this.previousStatusBarTheme;
        this.isClosable = false;
        this.animate({ opacity: 0 }, { duration: this.animationDuration })
            .then(() => this.dispose());
    }

    constructor(values?: { isClosable?: boolean, statusBarTheme?: 'dark' | 'light', animationDuration?: number }, properties?: Properties<Composite>) {
        super(properties);

        if (properties) {
            if (!properties.left) this.left = 0;
            if (!properties.right) this.right = 0;
            if (!properties.top) this.top = 0;
            if (!properties.bottom) this.bottom = 0;

            if (!properties.background) this.background = '#fff';
        } else {
            this.left = 0; this.right = 0; this.top = 0; this.bottom = 0; this.background = '#fff';
        }

        if (values) {
            if (values.isClosable) this.isClosable = values.isClosable;
            if (values.statusBarTheme) statusBar.theme = values.statusBarTheme;
            if (values.animationDuration) this.animationDuration = values.animationDuration;
        }

        this.opacity = 0;

        this.onTap(() => { });

        this.append(this.content, this.crossIcon);

        this.appendTo(contentView);
        this.animate({ opacity: 1 }, { duration: this.animationDuration });
    }
}

export class RunningLine extends Composite {
    constructor(content: Widget, properties: Properties<Composite>) {
        super(properties);

        this.append(content);

        content.onResize.once(() => {
            content.left = 0;
            content.animate({ transform: { translationX: -content.absoluteBounds.width / 2 } }, { duration: (content.absoluteBounds.width - this.absoluteBounds.width) * 10, easing: 'ease-in-out', reverse: true, repeat: Infinity });
        });
    }
}

export class PopUp extends Composite {
    private dim = new Composite({ left: 0, right: 0, top: 0, bottom: 0, background: '#000', opacity: 0 })
        .appendTo(contentView);

    close() {
        this.dim.animate({ opacity: 0 }, { duration: 500 })
            .then(() => this.dim.dispose());
        this.animate({ opacity: 0 }, { duration: 700 })
            .then(() => this.dispose());
    }

    constructor(values: { title: string, text: string, buttons?: { ok?: { color?: ColorValue, text: string, action: () => any }, no?: { color?: ColorValue, text: string, action: () => any } } }, properties?: Properties<Composite>) {
        super();

        this.cornerRadius = 18;
        this.left = 25;
        this.right = 25;
        this.centerY = 0;
        this.padding = 25;
        this.elevation = 3;
        this.opacity = 0;

        if (!properties) this.background = '#fff';

        this.append(
            new TextView({ text: values.title, left: 0, right: 0, font: 'bold 18px' }),
            new TextView({ text: values.text, left: 0, right: 0, top: 'prev() 10' })
        );

        if (values.buttons) {
            let buttons = new Composite({ left: 0, right: 0, top: 'prev() 25' })
                .appendTo(this);
            if (values.buttons.ok) {
                let okButton = new TextView({ text: values.buttons.ok.text, font: 'bold 16px', right: 0 })
                    .onTap(values.buttons.ok.action)
                    .appendTo(buttons);
                if (values.buttons.ok.color) okButton.textColor = values.buttons.ok.color;
            }
            if (values.buttons.no) {
                let noButton = new TextView({ text: values.buttons.no.text, font: 'bold 16px' })
                    .onTap(values.buttons.no.action)
                    .appendTo(buttons);
                if (values.buttons.no.color) noButton.textColor = values.buttons.no.color;
                if (values.buttons.ok) noButton.right = 'prev() 25';
                else noButton.right = 0;
            }
        }


        this.dim.onTap(() => { });
        this.dim.animate({ opacity: 0.35 }, { duration: 500 });

        this.animate({ opacity: 1 }, { duration: 700 });

        this.appendTo(contentView);
    }
}