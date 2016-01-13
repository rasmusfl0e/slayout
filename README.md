![Slayout](https://github.com/rasmusfl0e/slayout/blob/master/img/logo.png)

Slayout
=======

> Custom property syntax to enable semantic layout in CSS.

This repository describes the custom property and contains an algorithm to interpret it.
Actual usable code is provided as [plugins](#plugins).

## Synopsis

Using utility classes to control layouts adds cruft to the HTML and can be quite difficult to decode once written. 

Instead Slayout uses a custom property (`slayout`) with a shorthand notation to easily describe responsive row/column layouts.  

The custom property is added to a container element to control the layout of its child elements.
This keeps layout handling in your stylesheets - where it belongs - and keeps layout data in one place.

### Features

* Semantic - avoid the myriad of classes in your HTML - keeps your styling in your CSS.
* Minimal syntax - easy to write, easy to read.
* Flexible - use the any number of sub-columns you want for your grid - per media query even.

## Syntax

```css
/* A single row with one full width block and 2 half width underneath. */
slayout: 12 / 12 6 6;

/* Same as above with an added media query where layout changes. */
slayout: 12 / 12 6 6,
         (min-width: 640px) 12 / 6 3 3;

/* Use different sub-column count per media query if you want. */
slayout: 4 / 4 2 2,
         (min-width: 640px) 12 / 6 3 3;
         
/* The last block width is repeated which means it can be shortened to this: */
slayout: 4 / 4 2,
         (min-width: 640px) 12 / 6 3;
```

### Values

* **`<media-query>`** - describes the media query a set of values should be active for. Optional for the first set of values.  
* **`<sub-columns>`** - an number describing how many sub-columns you want to divide your layout into.
* **`<blocks>`** - a set of numbers describing how many sub-columns each block spans in your layout. The last 

### Formal syntax

```
<initial-layout-values> [ , <layout-values> ]*

where
<initial-layout-values> = <media-query>? <sub-columns> / <blocks>

where
<layout-values> = <media-query> <sub-columns> / <blocks>

where
<sub-columns> = <number>

where
<blocks> = <number>+
```

The above uses the [value definition syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Value_definition_syntax) from MDN.

Writing:

```css
.test {
	slayout: 12 / 12 6 6,
		(min-width: 640px) 12 / 6 3 3;
}
```

...should translate into:

```css
.test {
	margin-left: -10px;
	margin-right: -10px;
}
.test:after {
	content: "";
	display: table;
	clear: both;
}
.test > * {
	box-sizing: border-box;
	padding-left: 10px;
	padding-right: 10px;
	width: 100%;
	float: left;
}
.test > :nth-child(2), .test > :nth-child(n+3) {
	width: 50%;
}
.test > :nth-child(1) {
	width: 100%;
}
@media (min-width: 640px) {
	.test > :nth-child(2), .test > :nth-child(n+3) {
		width: 25%
	}
	.test > :nth-child(1) {
		width: 50%
	}
}
```

## Plugins

* [postcss-slayout](https://github.com/rasmusfl0e/postcss-slayout) - PostCSS Slayout plugin.