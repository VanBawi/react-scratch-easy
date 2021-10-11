# Installation

$ npm install react-scratch-easy

```js
import { ScratchImage } from 'react-scratch-easy';

<ScratchImage
	showReset={true}
	showConfirmText={true}
	showResetText={true}
	finishPercent={35}
	// onComplete={}
	//outerImageSrc='image src'
/>;
```

# Props

# Required Props

| No  | Props         | Description                       | Default |
| --- | ------------- | --------------------------------- | ------- |
| 1   | outerImageSrc | image url for scratching area     |
| 2   | onComplete    | requires a callback function      | none    |
| 2   | finishPercent | requires a number between 1 - 100 | 35      |

# Optional Props

| No  | Props           | Description                    | Default                   |
| --- | --------------- | ------------------------------ | ------------------------- |
| 1   | resetText       | can pass any text value        | Reset                     |
| 2   | confirmText     | can pass any text value        | Confirm                   |
| 3   | outerImageWH    | scratch image width and height | width=100%, height=300px  |
| 4   | innerImageWH    | inner image width and height   | width=200px, height=200px |
| 5   | showResetText   | Boolean                        | true                      |
| 6   | showConfirmText | Boolean                        | true                      |
| 7   | confirmBtn      | can pass any button css        | none                      |
| 8   | resetBtn        | can pass any button css        | none                      |
