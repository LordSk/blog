+++
title = "Neuroevolution: bird simulation"
date = 2018-04-17T13:23:11+02:00
draft = false
categories = ["AI"]
image = "img/burds_1.jpg"
+++

We now know how to train feed forward neural networks through evolution. Let's see how it fairs in a "real" environment.

### Burds

I created a little simulation where 2D birds try to manoeuvre in the air in order to eat apples. They can flap their wings (moving them forward), turn left, right and "brake" to some extent
(this makes much more sense in motion, see video below). They have 10 seconds to reach the next apple. Upon reaching it, their lifetime is reset to 10 seconds. If they touch the ground they die.

### Brain

Here is the very simple NN topology I used.

![burd NN](/img/burd_nn.png "burd NN")

A **6x4x4** fully connected feed forward NN.

#### Input

- **offsetX**/**offsetY** is the relative distance between the next apple and the bird.
- **velocityX**/**velocityY** is the velocity vector of the bird.
- **angle** is the orientation of the bird.
- **canFlap** is either 1 or 0 depending of the flap cooldown.

#### Output

- **turnLeft**/**turnRight** will rotate the bird left or right.
- **flap** will make the bird flap if it can.
- **brake** will make the bird slow down.


### Fitness function

Now what is the fitness function? The objective here is to **eat apples**, so

`fitness = appleEatenCount`

makes sense. One bird flying in a random direction will eventually hit and apple leading to more
and more birds reaching the first apple. The cycle repeats for the next apple and so on. This would, after a very long time, converge to the solution we want, eating all the apples.
But we can do better than that, much better in fact. We can start by taking **the distance to the next apple** in account. At any point t the fitness function then becomes

`fitness = appleEatenCount + 1/distanceToNextApple`

The closer a bird is to the next apple, the more fit it is. However birds naturally will move in a curved manner, getting farther to the next apple before getting closer.
This function only rewards getting closer which is not ultimately what we want. In the end here is the code I settled on.

```
distFactor = 1.0 - (min(distance(birdPos, applePos), 2000) / 2000.0) // 0.0 -> 1.0
healthFactor = birdHealth / HEALTH_MAX

// fitness accumulation every frame
fitnessAcc += (healthFactor + distFactor * distFactor) * FRAME_DT
fitness = fitnessAcc
fitness += fitness * 0.1 * appleEatenCount
```

I won't go too much into details, but this function rewards staying close to the next apple, being healthy (and therefore quick) and of course eating apples.
So finally, here is the result.

{{< youtube DlfPMHCaD90 >}}
