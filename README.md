# Viewport-Based Scaling

## What is this?

This is the source code for a website that lets you generate CSS code to set a
property's value based on the viewport width. It essentially helps you do what's
described in
[Modern Fluid Typography Using CSS Clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/),
[Linearly Scale font-size with CSS clamp() Based on the Viewport](https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/)
and [Between the Lines](https://css-tricks.com/between-the-lines/).

## Can't I just use the `vw` unit?

You must, but doing it manually is extra work. If you wanted to have a 12px font
size on a 280px screen, a 16px font size on a 768px screen, and all sizes
inbetween, you'd have to manually create a linear function that goes through
both points. This website can do that for you.

## Example

Here is an example of the font size being determined by two breakpoints. The
stripes denote the area between the breakpoints, where the interpolation
happens.

## More than 2 points

Although it may be simple to manually make a function such as the one specified
above, you may sometimes require more than two points. We call such point a
breakpoint (a viewport size and an associated size), and this website lets you
specify way more than two of them. Take the following table as an example.

| Viewport size | Font size |
| ------------: | :-------- |
|         280px | 12px      |
|         320px | 10px      |
|         480px | 24px      |
|         640px | 28px      |
|         768px | 16px      |

Given the above breakpoints, this website generates the following code which
goes through all of them.

```css
font-size: min(12px, 26px + -5vw);
@media screen and (min-width: 320px) {
  font-size: calc(-18px + 8.75vw);
}
@media screen and (min-width: 480px) {
  font-size: calc(12px + 2.5vw);
}
@media screen and (min-width: 640px) {
  font-size: max(16px, 88px + -9.38vw);
}
```
