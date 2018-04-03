+++
date = "2017-12-05T00:06:25+01:00"
description = ""
draft = true
tags = []
title = "Remaking Sacred, part 1: Introduction and textures"
topics = []
categories = ["Resacred"]
image = "https://i.imgur.com/nXHUcuK.jpg"

+++
### Introduction

**Sacred** is an old 2004 game, a RPG similar to Diablo. I remember getting for free at the time, attached to my PC Gamer magazine. This was my first real rpg game I ever got my hands on, and it was amazing.
I have many great memories playing this game, overcoming difficult enemies, completing quests, and dropping loot! Oh the statisfaction.

The year is now 2017 and I wanted to revisit Sacred, 13 years later. You can actually buy the game on GOG right now and run it on Windows 10. However, the game did not age well. the resolution is locked to
1024x768, the framerate is very low (around <20 fps) and a lot of other small issues. The game is still playable yes, but I wanted more. First thing that came to mind was hack a better resolution in.
Dynamically patching the game at launch, changing a few intructions to use my full monitor resolution, seems simple enough. Unfortunately the values 1024 and 768 are used all over the place, furthermore,
 directx 7 was the chosen graphics api at the time and today's documentation of it is scarse to say the least. The patch solution is doable but far from optimum.
 
Then came another thought. How hard would it be to make a modern version of Sacred? The game's content is already there, I "just" need to use it differently, code a whole new and more recent engine.
So that's what I am attempting to do, my weapons of choice will be **IDA/x64dbg** to reverse the game's binary and **C++/OpenGL** as well as a few good libraries to make the engine.
 
 
### Initial goal

I can't just start blindly engineering an engine from the ground up without knowing the full problem to solve first. So I'll set a small first goal to achieve,
 one that'll help me further understand how Sacred data is utilized. The first goal I set is as follow: "Render the whole base map". Sacred is a 2D isometric open world game,
 the map is a composition of tiles rendered beside each others. There are also several levels (house floors for examples) and caves / dungeons to go into. But we'll limit ourself to the basic outside for now.

 So then here is the simplified TODO list:
* Read texture data from the hard drive
* Upload texture data to the GPU
* Read map data
* Draw textures according to map data

### Texture data

![PAK folder](https://i.imgur.com/R7CUnlT.png "PAK folder")

The textures are located in the PAK folder, specifically in the **texture.pak** file. I won't bore you with the specifics of said file, this has a simple archive-type layout. A header, followed by file descriptions
and finally raw file data. The thing I immediately noticed in the texture names was the .TGA extension, the TARGA image format. Now you don't typically want to store your game's textures in such a format, you want
 your own, to load it as fast as possible. So I tried the obvious thing, load the texture data directly to an opengl texture using the standard *RGBA8* (1byte per channel) pixel format. And it worked! For a few images.
 For type 6 images precisely. All the other images (which are all type 4) were very noisy and incoherent. When you mess up the format you use to upload to the GPU you can still discern features or even see the image clearly
 but with wrong colours. Here all I got was noise.
 
![Noise textures](https://i.imgur.com/dqJJqxF.png "Noise textures")
*[Zoom image](https://i.imgur.com/dqJJqxF.png)*

This can mean two things, the upload data is wrong a points who knows where in memory or the textures are compressed. After while I finally found the corresponding function in IDA, and also found a few references to a "gzopen" command.
The logical next step is to use zlib and try and decompress (or *deflate*) this noisy texture data. To my surprise, it worked on the first try. The decompressed image format is ARGB 16 bit (4 bits per channel).

![16bit textures](https://i.imgur.com/82C7gmr.png "16bit textures")
*[Zoom image](https://i.imgur.com/82C7gmr.png)*

![16bit textures 2](https://i.imgur.com/h343aSM.png "16bit textures 2")
*[Zoom image](https://i.imgur.com/h343aSM.png)*

### Conclusion

That's it for now, I wanted to go into the technical details of this first prototype, but this post is long enough already. Next up, reading map data and rendering the open world in glorious 1080p!
You can follow me on twitter [@LordSk_](https://twitter.com/LordSk_) to get updated when I post again.
Cheers!