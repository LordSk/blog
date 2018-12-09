+++
title = "Neuroevolution: the basics"
date = 2018-04-03T20:08:50+02:00
draft = false
categories = ["AI"]
image = ""
+++

Ever since I heard about **neural networks** I wanted to learn how they work and how to use them.
Today (deep) neural networks are being used in more and more domains, ranging from the popular self-driving vehicle system, to diverse uses in medicine or even speech recognition and synthesis.
That trend is not going to stop anytime soon, which meant it was time for me to start my journey to understanding this new revolutionary tool.

### A simple neural network

![neural network](/img/feedforward_nn.png "neural network")

The base concept of a neural network is fairly simple. You first have the **input** nodes, which are your input values. These could be a position x,y,z,
 pixel values or whatever you want depending on the issue to solve.
Then comes a number of **hidden** layers, each connected to the previous layer. In the same manner, the **output** layer is at the end,
 producing your output values. Each arrow represent a **connection** and has a weight associated to it.

This particular type of network is called a **feed forward deep neural network**. "Feed forward" because it goes from left to right, from the input layer to the output layer.
"Deep" because it has more than one hidden layer. So how do you actually compute the values?

* First you set your input values (ex: 1.0, 0.5, -1.0, 0.2)
* Then for each layer (hidden and output) you do:

`activate(previous_layer_node_val x connection_weight + bias)`

or here is the expanded version:

```
foreach node:
	val = bias
	
	for 0..prev_layer_node_count:
		val = val + prev_layer_node_val[i] * connection_weight[i]
	end
	
	val = activate(val)
end
```

**previous_layer_node_val** are the node values of the previous layer. **connection_weight** is the connection weight matrix and **bias** is a single value added for mathematical reasons
 (I encourage you to research why on your own). **activate** is the activation function. Functions like `sigmoid` or `tanh` are commonly used. The activation function allows us to construct
 non-linear functions, a feed forward NN is basically a big function.
 
### Training / Learning

Now we know how a simple NN works, but we still have to tune it, or as it is often called, *train* it. Training in this example is adjusting each connection weight to get the desired result.
**Backpropagation** is one way to do it but I wanted to explore another one first, **neuroevolution**.

### Neuroevolution

![neuroevolution](/img/neuroevolution_1.png "neuroevolution")

Neuroevolution bases itself upon biological evolution, **survival of the fittest**. We start with a random **population** of networks with each weight randomized, evaluate them and keep the best.
We then proceed to **mutate** some of them (disrupting a/several connection weight) and repeat the process. This is the barebones principle of neuroevolution, pretty simple right?

In the next article we'll expand on the concept and introduce you to my bird simulation, see you then!