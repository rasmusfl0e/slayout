![Slayout](https://github.com/rasmusfl0e/slayout/blob/master/img/logo.png)

> Custom property syntax to enable semantic layout in CSS.

Slayout is a custom property with a shorthand notation to easily describe responsive row/column layouts.

This repository describes the custom property and contains an algoritm to calculate the layouts.
Actual usable code is provided as [plugins](#plugins).

## Syntax

```
/* A single row with one full width block and 2 half width underneath. */
slayout: 12 / 12 6 6;

/* Same as above with an added media query where layout changes. */
slayout: 12 / 12 6 6,
         (min-width: 640px) 12 / 6 3 3;
``` 

### Values

* **`<media-query>`** - describes the media query a set of values should be active for. Optional for the first set of values.  
* **`<columns>`** - an integer describing the width of your layout.
* **`<blocks>`** - a set of integers describing the width each block in your layout.


### Formal syntax

```
	[ <layout-values>, ]* <layout-values>
	
	where
	<layout-values> = [<media-query>] <columns> / <blocks>
	
	where
	<columns> = <integer>
	
	where
	<blocks> = [ <integer> ]* <integer>
```

Writing:

```
.test {
	slayout: 12 / 12 6 6,
		(min-width: 640px) 12 / 6 3 3;
}
```

...should translate into:

```
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