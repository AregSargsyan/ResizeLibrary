import { Directive, Renderer2, ElementRef, NgZone, NgModule } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class ResizableDirective {
    constructor(renderer, elementRef, zone) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.zone = zone;
        this.isGrabbing = false;
        this.previousX = 0;
        this.previousY = 0;
        this.hostLeft = 0;
        this.hostLeftMargin = 0;
        this.hostRight = 0;
        this.hostRightMargin = 0;
        this.hostTop = 0;
        this.hostTopMargin = 0;
        this.hostBottom = 0;
        this.hostBottomMargin = 0;
        this.hostMaxWidth = 0;
        this.hostMinWidth = 0;
        this.hostMaxHeight = 0;
        this.hostMinHeight = 0;
        this.onDestroy$ = new Subject();
    }
    mouseMoveOnElement(event) {
        const elRightBorder = this.hostCoordinates.right;
        const elLeftBorder = this.hostCoordinates.left;
        const elTopBorder = this.hostCoordinates.top;
        const elBottomBorder = this.hostCoordinates.bottom;
        if ((elRightBorder - event.clientX) < 10 && (elRightBorder - event.clientX) > -10 && !this.isGrabbing) {
            if ((elTopBorder - event.clientY) < 10 && (elTopBorder - event.clientY) > -10) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'nesw-resize');
                this.mouseOnBorder = 'top_right';
            }
            else if ((elBottomBorder - event.clientY) < 10 && (elBottomBorder - event.clientY) > -10) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'se-resize');
                this.mouseOnBorder = 'bottom_right';
            }
            else {
                this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'e-resize');
                this.mouseOnBorder = 'right';
            }
        }
        else if ((elBottomBorder - event.clientY) < 10 && (elBottomBorder - event.clientY) > -10 && !this.isGrabbing) {
            if ((elLeftBorder - event.clientX) < 10 && (elLeftBorder - event.clientX) > -10) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'nesw-resize');
                this.mouseOnBorder = 'bottom_left';
            }
            else {
                this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 's-resize');
                this.mouseOnBorder = 'bottom';
            }
        }
        else if ((elLeftBorder - event.clientX) < 10 && (elLeftBorder - event.clientX) > -10 && !this.isGrabbing) {
            if ((elTopBorder - event.clientY) < 10 && (elTopBorder - event.clientY) > -10) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'se-resize');
                this.mouseOnBorder = 'top_left';
            }
            else {
                this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'e-resize');
                this.mouseOnBorder = 'left';
            }
        }
        else if ((elTopBorder - event.clientY) < 10 && (elTopBorder - event.clientY) > -10 && !this.isGrabbing) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 's-resize');
            this.mouseOnBorder = 'top';
        }
        else if (!this.isGrabbing) {
            this.renderer.removeStyle(this.elementRef.nativeElement, 'cursor');
            this.mouseOnBorder = false;
        }
        this.hostCoordinates = this.elementRef.nativeElement.getBoundingClientRect();
    }
    onMouseDown(event) {
        if (this.mouseOnBorder) {
            this.hostWidth = parseFloat(getComputedStyle(this.elementRef.nativeElement).width);
            this.hostHeight = parseFloat(getComputedStyle(this.elementRef.nativeElement).height);
            this.hostLeft = parseFloat(getComputedStyle(this.elementRef.nativeElement).left);
            this.hostRight = parseFloat(getComputedStyle(this.elementRef.nativeElement).right);
            this.hostLeftMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginLeft);
            this.hostRightMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginRight);
            this.hostTop = parseFloat(getComputedStyle(this.elementRef.nativeElement).top);
            this.hostTopMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginTop);
            this.hostBottom = parseFloat(getComputedStyle(this.elementRef.nativeElement).bottom);
            this.hostBottomMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginBottom);
            this.hostMaxWidth = parseFloat(getComputedStyle(this.elementRef.nativeElement).maxWidth);
            this.hostMinWidth = parseFloat(getComputedStyle(this.elementRef.nativeElement).minWidth);
            this.hostMaxHeight = parseFloat(getComputedStyle(this.elementRef.nativeElement).maxHeight);
            this.hostMinHeight = parseFloat(getComputedStyle(this.elementRef.nativeElement).minHeight);
            this.isGrabbing = true;
            this.previousX = event.clientX;
            this.previousY = event.clientY;
            event.preventDefault();
        }
    }
    onMouseMove(event) {
        if (this.isGrabbing && this.mouseOnBorder) {
            if (this.mouseOnBorder == 'top') {
                this.resizeElementFromTheTop(event);
            }
            else if (this.mouseOnBorder == 'bottom') {
                this.resizeElementFromTheBottom(event);
            }
            else if (this.mouseOnBorder == 'left') {
                this.resizeElementFromTheLeft(event);
            }
            else if (this.mouseOnBorder == 'right') {
                this.resizeElementFromTheRight(event);
            }
            else if (this.mouseOnBorder == 'top_left') {
                this.resizeElementFromTheLeft(event);
                this.resizeElementFromTheTop(event);
            }
            else if (this.mouseOnBorder == 'top_right') {
                this.resizeElementFromTheRight(event);
                this.resizeElementFromTheTop(event);
            }
            else if (this.mouseOnBorder == 'bottom_right') {
                this.resizeElementFromTheRight(event);
                this.resizeElementFromTheBottom(event);
            }
            else if (this.mouseOnBorder == 'bottom_left') {
                this.resizeElementFromTheLeft(event);
                this.resizeElementFromTheBottom(event);
            }
        }
        this.hostCoordinates = this.elementRef.nativeElement.getBoundingClientRect();
    }
    resizeElementFromTheBottom(event) {
        this.hostHeight += event.clientY - this.previousY;
        this.hostBottom -= event.clientY - this.previousY;
        this.hostBottomMargin -= event.clientY - this.previousY;
        this.previousY = event.clientY;
        if (this.hostHeight < 0 || this.hostHeight < this.hostMinHeight || this.hostHeight > this.hostMaxHeight)
            return;
        else {
            this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.hostHeight}px`);
            if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
                this.renderer.setStyle(this.elementRef.nativeElement, 'bottom', `${this.hostBottom}px`);
            }
            else {
                this.renderer.setStyle(this.elementRef.nativeElement, 'margin-bottom', `${this.hostBottomMargin}px`);
            }
        }
    }
    resizeElementFromTheTop(event) {
        this.hostHeight -= event.clientY - this.previousY;
        this.hostTop += event.clientY - this.previousY;
        this.hostTopMargin += event.clientY - this.previousY;
        this.previousY = event.clientY;
        if (this.hostHeight < 0 || this.hostHeight < this.hostMinHeight || this.hostHeight > this.hostMaxHeight)
            return;
        else {
            this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.hostHeight}px`);
            if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
                this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${this.hostTop}px`);
            }
            else {
                this.renderer.setStyle(this.elementRef.nativeElement, 'margin-top', `${this.hostTopMargin}px`);
            }
        }
    }
    resizeElementFromTheRight(event) {
        this.hostWidth += event.clientX - this.previousX;
        this.hostRight -= event.clientX - this.previousX;
        this.hostRightMargin -= event.clientX - this.previousX;
        this.previousX = event.clientX;
        if (this.hostWidth < 0 || this.hostWidth < this.hostMinWidth || this.hostWidth > this.hostMaxWidth)
            return;
        else {
            this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.hostWidth}px`);
            if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
                this.renderer.setStyle(this.elementRef.nativeElement, 'right', `${this.hostRight}px`);
            }
            else {
                this.renderer.setStyle(this.elementRef.nativeElement, 'margin-right', `${this.hostRightMargin}px`);
            }
        }
    }
    resizeElementFromTheLeft(event) {
        this.hostWidth -= event.clientX - this.previousX;
        this.hostLeft += event.clientX - this.previousX;
        this.hostLeftMargin += event.clientX - this.previousX;
        this.previousX = event.clientX;
        if (this.hostWidth <= 0 || this.hostWidth <= this.hostMinWidth || this.hostWidth >= this.hostMaxWidth)
            return;
        else {
            this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.hostWidth}px`);
            if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
                this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${this.hostLeft}px`);
            }
            else {
                this.renderer.setStyle(this.elementRef.nativeElement, 'margin-left', `${this.hostLeftMargin}px`);
            }
        }
    }
    onMouseUp() {
        if (this.isGrabbing) {
            this.isGrabbing = false;
        }
    }
    setSubscriptions() {
        this.mouseMoveOnElement$ = fromEvent(this.elementRef.nativeElement, 'mousemove')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event) => this.mouseMoveOnElement(event));
        this.mouseDownOnElement$ = fromEvent(this.elementRef.nativeElement, 'mousedown')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event) => this.onMouseDown(event));
        this.mouseMoveonDocument$ = fromEvent(document, 'mousemove')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event) => this.onMouseMove(event));
        this.mouseUpOnDocument$ = fromEvent(document, 'mouseup')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.onMouseUp());
    }
    ngOnInit() {
        this.hostCoordinates = this.elementRef.nativeElement.getBoundingClientRect();
        this.zone.runOutsideAngular(() => this.setSubscriptions());
    }
    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
ResizableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[resizable]',
            },] }
];
ResizableDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: NgZone }
];

class AngularElementsResizerModule {
}
AngularElementsResizerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ResizableDirective],
                imports: [],
                exports: [ResizableDirective]
            },] }
];

/*
 * Public API Surface of angular-elements-resizer
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AngularElementsResizerModule, ResizableDirective };
//# sourceMappingURL=angular-elements-resizer.js.map
