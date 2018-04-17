+++
title = "Neuroevolution: fitness and birds"
date = 2018-04-09T16:41:44+02:00
draft = false
categories = ["AI"]
image = "img/burds_neat_1.png"
+++

Last time we established what the basic concept of **neuroevolution** is and I used a simple diagram to illustrate it.
That diagram is actually slightly false. For simplification I omitted how we repopulate after selecting only the fittest specimen.
Most of the time, a type of **crossover** technique is used, but we could also simply clone the better specimen.
Here is the fixed version.

![neuroevolution2](/img/neuroevolution_2.png "neuroevolution2")

I will now go over each step in more details and explain a few techniques I employed for each of them.

### Evaluation / Fitness

First is the evaluation step. We run our network population (forward propagation) then calculate the **fitness** achieved by each NN.
Fitness is an arbitrarily computed number representing how well a specimen did during its simulated lifetime. Here is a example:

{{< gfycat_size ReadyAmpleEider 690 248 >}}

I'm sure most of you are familiar with this little game. The goal is simple, go as far **right** as you can.
The fitness is then **how far right we went before dying** (the top right score on the video). In this case fitness is easy grasp as a concept and thus easy to compute.
However as your problem gets harder to resolve so will the fitness to compute. This is arguably the most important cog in our machine. A bad fitness function will render the system
unable to evolve NNs properly or slow down the evolution by a lot. I will explain more when presenting the project I applied neuroevolution to.

### Selection

We now have our criteria for choosing the best specimen. There are several means of **parent** selection. We can sort NNs by fitness and eliminate the worst 50% and that would work.
Yet I found using a more random method yield better results. My favorite was **selection tournament**.
You pit specimen against random opponents multiple times and the victor becomes a parent (the best fitness wins). **Selection roulette** is very good as well.
Imagine a long band with all the fitnesses added up one after the other. Where you land on the band determines the parent. Bigger fitnesses have a lot more chance to be landed on,
while still leaving a chance for a low scoring specimen.

![selection roulette](/img/selection_roulette.png "selection roulette")

### Crossover

**Crossover** is the mating part, mixing two parents to produce a "child". There are a lot of ways to do this as well. Some choose to use a genome model, assigning genes to specimen and converting them
back to weight values or even different neuron topologies (Neuroevolution is also referred as **Genetic algorithm**). I personally didn't go down that path and stuck with weights instead.
Here are two examples of crossover techniques.

![crossover](/img/crossover_1.png "crossover")

_A,B,C are gene letters, but they could also be each connection weight value_

### Mutation

Finally, **mutation**. Mutation, in our case, will alter/reset one or more connection weight depending on the connection rate. We have to fine tune this rate in order to have a correct evolution system.
Too much mutation leads to randomness and no refining, too little will considerably slow down the process. We may also choose to keep a few specimen from mutating
in order to not lose the best solution in the next generation.

### Burds

It is time to put all this theory into practice. I created a little simulation where 2D birds teach themselves how to fly. Here is a sneak peek,
I will talk more about it in the next post, see you then!

{{< gfycat reasonableofficialaardwolf >}}

