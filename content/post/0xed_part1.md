+++
title = "0xed: the choice of GUI library"
date = 2018-06-17T20:17:26+02:00
draft = false
image = "img/0xed/0xed_screen_1.png"
categories = ["0xed"]
+++

### Preface

**0xed** is a hexadecimal data viewer/editor that I am currently working on. The idea to make my own arose after vainly searching for a decent one.
I actually found one which had almost all of the basic features I wanted to use, **010 editor**, but unfortunately it is neither free nor open source.
Thus I can't really tamper with it or make it "better".

### Basic features

I want to be able to visualize file data as either **hex, int16, float32** and so on.
I want to code a **simple script** to make structures and place them, to investigate file data depending on the format.
Later on I'd like to edit based on data type I chose.

That doesn't sound too hard, does it?

### Nuklear

The first UI library I tried is [Nuklear](https://github.com/vurtun/nuklear). I wanted to try it for a while as I heard good things about it.
Unfortunately it seems Nuklear is not really usable for what I wanted out of it. A lot of stuff is unpolished, correct padding and precise positioning seems impossible to achieve.
Text rendering is somewhat blurry, some behavior feels hacked in (menus, combobox). Anyway you get the idea, at the time I tested Nuklear (it may have changed now) it was not the right choice.


### Qt

Now onto the most popular UI library, **Qt**. So I setup a small application. All I had was a grid with each byte displayed as hexadecimal text, about 50x16.
Shockingly, **performance was terrible**. Rendering a small batch of text was causing hanging (during scrolling for example).
Now I know what you must think, surely this guy is thinking Qt is at fault but in reality his own code is causing the freezes.
I wish that was true. I spent weeks on the issue, caching text to pixmaps, to limiting refresh rate to 20fps. Nothing worked to the extend I wanted it to.
I am certain there is a solution to this, as 010 editor does use Qt as well, but I didn't find it.

### Dear ImGui

[Dear ImGui](https://github.com/ocornut/imgui) is an immediate mode GUI library (much like Nuklear), and possibly the best lib I ever used.
Immediate mode GUI libs are a joy to use, you can do things like:

```c++
if(ImGui::Button("OK")) {
    doSomething();
}
```

I already used Dear ImGui a bunch in the past, so I knew it would perform well.
I could render hundreds of panels (see below) and still be completely fine while still having all the advantages of immediate mode (code is very straightforward to write).
So that's what I am using for now. I may come back to Qt if I find a solution to the text rending issue, but I also may not. Dear ImGui is amazing and gives me everything I wanted and more.

![0xed_screen1](/img/0xed/0xed_screen_1.png "0xed_screen1")
