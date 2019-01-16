+++
color = "74, 183, 20"
date = "2019-01-08T15:42:55+01:00"
draft = false
image = "images/resacred_1.png"
tags = ["C++", "OpenGL", "Multi-threading", "Reverse-Engineering", "x64dbg", "IDA"]
title = "Resacred"
+++

Resacred is a complete remake of [Sacred Gold](https://www.gog.com/game/sacred_gold).

First we start by reverse-engineering the game from the executable binary and binary resource files, using tools such as **x64dbg**, **IDA Pro**, and **0xed**.

We then use that information to build a modern engine suited for the game. In particular, DirectX 7 was used at the time to render the game, we now use an asynchronous OpenGL renderer.

After months of work we can display every map sector, as well as the world overview grid. There is still much to be done, but the project is on hold for now as it it very time consuming.

<br>

{{% img "images/resacred_0.png" %}}
{{% img "images/resacred_1.png" %}}
{{% img "images/resacred_3.png" %}}
{{% img "images/resacred_4.png" %}}
{{% img "images/resacred_5.png" %}}
{{% img "images/resacred_6.png" %}}

{{% imgur_album rHP2d %}}

*Progress album*
