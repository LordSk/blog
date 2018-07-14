+++
date = "2017-12-05T00:06:25+01:00"
description = ""
draft = false
tags = []
title = "Remaking Sacred, part 1: Introduction and textures"
topics = []
categories = ["Resacred"]
image = "img/resacred/sacred_gold_reference.jpg"
thumbnail = "img/resacred/sacred_gold_reference.jpg"

+++
### Introduction

**Sacred** is an old 2004 game, a RPG similar to Diablo. I remember getting it for free at the time, attached to my PC Gamer magazine. It was my first real RPG game I ever got my hands on, and it was amazing.
I have many great memories playing this game, overcoming difficult enemies, completing quests, and dropping loot! Oh the satisfaction.

The year is now 2017 and I wanted to revisit Sacred, many years later. You can actually buy the game on GOG right now and run it on Windows 10. However, the game did not age well. The resolution is locked to
1024x768, the framerate is very low (around <20 fps) and has plenty of other issues. The game is still playable yes, but I wanted more. First thing that came to mind was hack a better resolution in.
Dynamically patching the game at launch, changing a few instructions to use my full monitor resolution, seems simple enough. Unfortunately the values 1024 / 768 are hard coded. Furthermore,
 **Directx 7** was the chosen graphics api at the time and today's documentation of it is scarce to say the least. The patch solution is then quite difficult.
 
Then came another thought. How hard would it be to make a modern version of Sacred? The game's content is already there, I would "just" use it differently.
So that's what I am attempting to do, knowing full well that I may never complete this huge endeavour. To reverse the game I am using a combination of **x64dbg** and **IDA**.
To build the game anew I am using **C++** and **OpenGL**.

Here is the [repo](https://github.com/LordSk/Resacred) if you want to follow along.
 
### Initial goal

I can't just start blindly engineering an engine from the ground up without knowing the full problem to solve first. So I'll set a small goal to achieve,
 one that'll help me further understand how Sacred data is utilized. Sacred is a 2D isometric open world game, the world map seems be made of a composition of tiles.
There are several ground levels (house floors for example) and caves / dungeons to go into. I will start with that, try to render a basic version of the wold map.

Here is the simplified **TODO** list:

- Read texture data from texture file(s)
- Upload texture data to the GPU
- Read map data
- Draw tiles according to map data


### Texture data

![PAK folder](https://i.imgur.com/R7CUnlT.png "PAK folder")

The textures are located in the **texture.pak** file. I won't bore you with the specifics of said file, it has a simple archive-type layout. A header, followed by file descriptions and raw file data.
The thing I immediately noticed was the .TGA extension used in most filenames, representing the TARGA image format. Now you don't typically want to store your game textures in such a format.
You want your own, to load it as fast as possible. So I tried the obvious thing, load the texture data directly to an opengl texture using the standard *RGBA8* (1 byte per channel) pixel format.
And it worked! For a few images. For **type 6** images precisely. The rest (which are all **type 4**) were noisy and incoherent. Usually when you mess up the GPU image format you can still
make out what the image is, but here all I got was noise.
 
![Noise textures](https://i.imgur.com/dqJJqxF.png "Noise textures")

This can mean two things, the upload data is wrong and points to who knows where in memory (meaning a bug in my program), or textures are compressed.
After a while I finally found the corresponding function in IDA, as well as a few references to a "gzopen" command.
The next logical step is to use **zlib** and try to decompress (or deflate) this noisy texture data. To my surprise, it worked on the first try.
The decompressed image format is ARGB 16 bit (4 bits per channel).

![16bit textures](https://i.imgur.com/82C7gmr.png "16bit textures")

![16bit textures 2](https://i.imgur.com/h343aSM.png "16bit textures 2")

### Conclusion

That's it for now! Next up, reading map data and rendering the open world in glorious 1080p!