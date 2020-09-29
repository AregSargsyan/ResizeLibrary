# AngularElementsResizer

Angular directive that allows element to be resized in all directions.
Works without adding borders to the element.This directive is very light and will not trigger change Detection because it works outside of NgZone

[![GitHub stars](https://img.shields.io/github/stars/AregSargsyan/ResizeLibrary.svg)](https://github.com/AregSargsyan/ResizeLibrary/stargazers)

## Demo
https://aregsargsyan.github.io/DemoForResizerReusableModule/  

## Usage

**Step 1:** Install angular-resize-element

```sh
npm i angular-elements-resizer
```

**Step 2:** Import angular resize element module into your app module

```ts
....
import { AngularElementsResizerModule } from 'angular-elements-resizer';

....

@NgModule({
    ...
    imports: [
        ....
        AngularElementsResizerModule
    ],
    ....
})
export class AppModule { }
```

**Step 3:** Add ts code to the component
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div resizable></div>`,
  styles: ['div { position: absolute; width: 300px;height: 400px; background: red; }']
})
export class AppComponent {
}

```
**Note:**  The css part here is only for example (for visualization) you can use whatever styles you want

## Further help

In case of questions feel free to contact me https://linkedin.com/in/areg-sargsyan

## License
[MIT](https://choosealicense.com/licenses/mit/)

