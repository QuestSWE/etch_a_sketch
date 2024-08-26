```
   ███████╗████████╗ ██████╗██╗  ██╗     █████╗     ███████╗██╗  ██╗███████╗████████╗ ██████╗██╗  ██╗
   ██╔════╝╚══██╔══╝██╔════╝██║  ██║    ██╔══██╗    ██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝██║  ██║
   █████╗     ██║   ██║     ███████║    ███████║    ███████╗█████╔╝ █████╗     ██║   ██║     ███████║
   ██╔══╝     ██║   ██║     ██╔══██║    ██╔══██║    ╚════██║██╔═██╗ ██╔══╝     ██║   ██║     ██╔══██║
   ███████╗   ██║   ╚██████╗██║  ██║    ██║  ██║    ███████║██║  ██╗███████╗   ██║   ╚██████╗██║  ██║
   ╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝    ╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝

```

This is just a little project to practice what I have learned so far following The Odin Project foundation curriculum.

<div align="center"> 
  <h3>---------------------------------------------&#91;CHALLENGE #1&#93;---------------------------------------------</h3>
</div>


The first major challenge I encountered was implementing the logic for the Darken mode. When Darken was
toggled on, it worked as expected—each time the mouse hovered over a div, the opacity increased by `0.1`.
However, the problem arose when Darken was toggled off and then back on. In this case, a lower opacity
value could override a higher one, which was not the desired behavior. Logically, only a higher opacity
should override a lower one.

I resolved this issue by declaring a `newOpacity` variable that held the current opacity(`opacity[index]`)
value plus `0.1`. This allowed me to compare the `newOpacity` value with `opacity[index]`. If `newOpacity`
was greater than `opacity[index]`, `opacity[index]` would be updated to `newOpacity`. This ensured that
the opacity could only increase and never decrease when hovering over the same div multiple times.
See the code below:

```js
if (newOpacity > opacities[index]) {
  opacities[index] = newOpacity;
  div.style.backgroundColor = `rgba(255, 0, 0, ${opacities[index]})`;
}
```
