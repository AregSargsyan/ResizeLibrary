import { Directive, ElementRef, Renderer2, NgZone } from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type ResizeDirection = 'top' | 'bottom' | 'right' | 'left' | 'top_right' | 'bottom_right' | 'bottom_left' | 'top_left' | false

@Directive({
  selector: '[resizable]',
})

export class ResizableDirective {

  hostCoordinates: DOMRect
  isGrabbing: boolean = false
  hostWidth: number
  hostHeight: number
  previousX: number = 0
  previousY: number = 0
  hostLeft: number = 0
  hostLeftMargin: number = 0
  hostRight: number = 0
  hostRightMargin: number = 0
  hostTop: number = 0
  hostTopMargin: number = 0
  hostBottom: number = 0
  hostBottomMargin: number = 0
  hostMaxWidth: number = 0
  hostMinWidth: number = 0
  hostMaxHeight: number = 0
  hostMinHeight: number = 0
  mouseOnBorder: ResizeDirection
  mouseMoveOnElement$: Subscription
  mouseDownOnElement$: Subscription
  mouseMoveonDocument$: Subscription
  mouseUpOnDocument$: Subscription
  onDestroy$ = new Subject<void>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private zone: NgZone) { }

  private mouseMoveOnElement(event: MouseEvent) {

    const elRightBorder = this.hostCoordinates.right
    const elLeftBorder = this.hostCoordinates.left
    const elTopBorder = this.hostCoordinates.top
    const elBottomBorder = this.hostCoordinates.bottom

    if ((elRightBorder - event.clientX) < 10 && (elRightBorder - event.clientX) > -10 && !this.isGrabbing) {
      if ((elTopBorder - event.clientY) < 10 && (elTopBorder - event.clientY) > -10) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'nesw-resize')
        this.mouseOnBorder = 'top_right'
      }
      else if ((elBottomBorder - event.clientY) < 10 && (elBottomBorder - event.clientY) > -10) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'se-resize')
        this.mouseOnBorder = 'bottom_right'
      }
      else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'e-resize')
        this.mouseOnBorder = 'right'
      }
    }

    else if ((elBottomBorder - event.clientY) < 10 && (elBottomBorder - event.clientY) > -10 && !this.isGrabbing) {
      if ((elLeftBorder - event.clientX) < 10 && (elLeftBorder - event.clientX) > -10) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'nesw-resize')
        this.mouseOnBorder = 'bottom_left'
      }
      else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 's-resize')
        this.mouseOnBorder = 'bottom'
      }
    }

    else if ((elLeftBorder - event.clientX) < 10 && (elLeftBorder - event.clientX) > -10 && !this.isGrabbing) {
      if ((elTopBorder - event.clientY) < 10 && (elTopBorder - event.clientY) > -10) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'se-resize')
        this.mouseOnBorder = 'top_left'
      }
      else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'e-resize')
        this.mouseOnBorder = 'left'
      }
    }

    else if ((elTopBorder - event.clientY) < 10 && (elTopBorder - event.clientY) > -10 && !this.isGrabbing) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 's-resize')
      this.mouseOnBorder = 'top'
    }

    else if (!this.isGrabbing) {
      this.renderer.removeStyle(this.elementRef.nativeElement, 'cursor')
      this.mouseOnBorder = false
    }
    this.hostCoordinates = this.elementRef.nativeElement.getBoundingClientRect();
  }

  private onMouseDown(event: MouseEvent) {
    if (this.mouseOnBorder) {
      this.hostWidth = parseFloat(getComputedStyle(this.elementRef.nativeElement).width)
      this.hostHeight = parseFloat(getComputedStyle(this.elementRef.nativeElement).height)
      this.hostLeft = parseFloat(getComputedStyle(this.elementRef.nativeElement).left)
      this.hostRight = parseFloat(getComputedStyle(this.elementRef.nativeElement).right)
      this.hostLeftMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginLeft)
      this.hostRightMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginRight)
      this.hostTop = parseFloat(getComputedStyle(this.elementRef.nativeElement).top)
      this.hostTopMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginTop)
      this.hostBottom = parseFloat(getComputedStyle(this.elementRef.nativeElement).bottom)
      this.hostBottomMargin = parseFloat(getComputedStyle(this.elementRef.nativeElement).marginBottom)
      this.hostMaxWidth = parseFloat(getComputedStyle(this.elementRef.nativeElement).maxWidth)
      this.hostMinWidth = parseFloat(getComputedStyle(this.elementRef.nativeElement).minWidth)
      this.hostMaxHeight = parseFloat(getComputedStyle(this.elementRef.nativeElement).maxHeight)
      this.hostMinHeight = parseFloat(getComputedStyle(this.elementRef.nativeElement).minHeight)
      this.isGrabbing = true
      this.previousX = event.clientX
      this.previousY = event.clientY
      event.preventDefault()
    }
  }



  private onMouseMove(event: MouseEvent) {
    if (this.isGrabbing && this.mouseOnBorder) {
      if (this.mouseOnBorder == 'top') {
        this.resizeElementFromTheTop(event)
      }
      else if (this.mouseOnBorder == 'bottom') {
        this.resizeElementFromTheBottom(event)
      }
      else if (this.mouseOnBorder == 'left') {
        this.resizeElementFromTheLeft(event)
      }
      else if (this.mouseOnBorder == 'right') {
        this.resizeElementFromTheRight(event)
      }
      else if (this.mouseOnBorder == 'top_left') {
        this.resizeElementFromTheLeft(event)
        this.resizeElementFromTheTop(event)
      }
      else if (this.mouseOnBorder == 'top_right') {
        this.resizeElementFromTheRight(event)
        this.resizeElementFromTheTop(event)
      }
      else if (this.mouseOnBorder == 'bottom_right') {
        this.resizeElementFromTheRight(event)
        this.resizeElementFromTheBottom(event)
      }
      else if (this.mouseOnBorder == 'bottom_left') {
        this.resizeElementFromTheLeft(event)
        this.resizeElementFromTheBottom(event)
      }
    }
    this.hostCoordinates = this.elementRef.nativeElement.getBoundingClientRect();
  }

  private resizeElementFromTheBottom(event: MouseEvent) {
    this.hostHeight += event.clientY - this.previousY
    this.hostBottom -= event.clientY - this.previousY
    this.hostBottomMargin -= event.clientY - this.previousY
    this.previousY = event.clientY
    if (this.hostHeight < 0 || this.hostHeight < this.hostMinHeight || this.hostHeight > this.hostMaxHeight) return
    else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.hostHeight}px`)
      if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
        this.renderer.setStyle(this.elementRef.nativeElement, 'bottom', `${this.hostBottom}px`)
      }
      else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'margin-bottom', `${this.hostBottomMargin}px`)
      }
    }
  }

  private resizeElementFromTheTop(event: MouseEvent) {
    this.hostHeight -= event.clientY - this.previousY
    this.hostTop += event.clientY - this.previousY
    this.hostTopMargin += event.clientY - this.previousY
    this.previousY = event.clientY
    if (this.hostHeight < 0 || this.hostHeight < this.hostMinHeight || this.hostHeight > this.hostMaxHeight) return
    else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this.hostHeight}px`)
      if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
        this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${this.hostTop}px`)
      }
      else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'margin-top', `${this.hostTopMargin}px`)
      }
    }
  }

  private resizeElementFromTheRight(event: MouseEvent) {
    this.hostWidth += event.clientX - this.previousX
    this.hostRight -= event.clientX - this.previousX
    this.hostRightMargin -= event.clientX - this.previousX
    this.previousX = event.clientX
    if (this.hostWidth < 0 || this.hostWidth < this.hostMinWidth || this.hostWidth > this.hostMaxWidth) return
    else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.hostWidth}px`)
      if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
        this.renderer.setStyle(this.elementRef.nativeElement, 'right', `${this.hostRight}px`)
      }
      else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'margin-right', `${this.hostRightMargin}px`)
      }
    }
  }

  private resizeElementFromTheLeft(event: MouseEvent) {
    this.hostWidth -= event.clientX - this.previousX
    this.hostLeft += event.clientX - this.previousX
    this.hostLeftMargin += event.clientX - this.previousX
    this.previousX = event.clientX
    if (this.hostWidth <= 0 || this.hostWidth <= this.hostMinWidth || this.hostWidth >= this.hostMaxWidth) return
    else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${this.hostWidth}px`)
      if (getComputedStyle(this.elementRef.nativeElement).position == 'absolute' || getComputedStyle(this.elementRef.nativeElement).position == "fixed") {
        this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${this.hostLeft}px`)
      }
      else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'margin-left', `${this.hostLeftMargin}px`)
      }
    }

  }

  private onMouseUp() {
    if (this.isGrabbing) {
      this.isGrabbing = false
    }
  }

  private setSubscriptions() {
    this.mouseMoveOnElement$ = fromEvent(this.elementRef.nativeElement, 'mousemove')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event: MouseEvent) => this.mouseMoveOnElement(event))
    this.mouseDownOnElement$ = fromEvent(this.elementRef.nativeElement, 'mousedown')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event: MouseEvent) => this.onMouseDown(event))
    this.mouseMoveonDocument$ = fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event: MouseEvent) => this.onMouseMove(event))
    this.mouseUpOnDocument$ = fromEvent(document, 'mouseup')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.onMouseUp())
  }

  ngOnInit(): void {
    this.hostCoordinates = this.elementRef.nativeElement.getBoundingClientRect();
    this.zone.runOutsideAngular(() => this.setSubscriptions())
  }

  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete();
  }
}
