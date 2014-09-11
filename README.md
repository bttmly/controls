# Controls [![Build Status](https://travis-ci.org/nickb1080/controls.svg?branch=master)](https://travis-ci.org/nickb1080/controls)
Controls is a library built on top of jQuery that makes dealing with control elements relatively painless. Specifically, it helps with client-side validation and state-setting. It is based on an earlier, similar library I wrote which is now called [controls-vanilla](https://github.com/nickb1080/controls-vanilla).

## Usage
Any way you please.

```js
$( 'input' ).controls();
$( 'input' ).mixinControls();
new $.Controls( 'input' );
new $.Controls( document.querySelectorAll( 'input' ) );
```

## API
**Comprehensive docs coming soon**
In the mean time, take a spin through [src/controls.coffee](https://github.com/nickb1080/controls/blob/master/src%2Fcontrols.coffee), it's pretty straightforward.


