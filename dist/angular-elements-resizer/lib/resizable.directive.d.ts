import { ElementRef, Renderer2, NgZone } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
export declare type ResizeDirection = 'top' | 'bottom' | 'right' | 'left' | 'top_right' | 'bottom_right' | 'bottom_left' | 'top_left' | false;
export declare class ResizableDirective {
    private renderer;
    private elementRef;
    private zone;
    hostCoordinates: DOMRect;
    isGrabbing: boolean;
    hostWidth: number;
    hostHeight: number;
    previousX: number;
    previousY: number;
    hostLeft: number;
    hostLeftMargin: number;
    hostRight: number;
    hostRightMargin: number;
    hostTop: number;
    hostTopMargin: number;
    hostBottom: number;
    hostBottomMargin: number;
    hostMaxWidth: number;
    hostMinWidth: number;
    hostMaxHeight: number;
    hostMinHeight: number;
    mouseOnBorder: ResizeDirection;
    mouseMoveOnElement$: Subscription;
    mouseDownOnElement$: Subscription;
    mouseMoveonDocument$: Subscription;
    mouseUpOnDocument$: Subscription;
    onDestroy$: Subject<void>;
    constructor(renderer: Renderer2, elementRef: ElementRef, zone: NgZone);
    private mouseMoveOnElement;
    private onMouseDown;
    private onMouseMove;
    private resizeElementFromTheBottom;
    private resizeElementFromTheTop;
    private resizeElementFromTheRight;
    private resizeElementFromTheLeft;
    private onMouseUp;
    private setSubscriptions;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
