# Statistical Physics

#### Dr Carl Paterson

## Lecture 1

#### Introduction

Statistical Physics is fundamentally linked to **Thermodynamics**. Recall from the Thermodynamics course that there are 3 fundamental laws:

* **0th Law** 

  Expresses the idea of two system being in an **equilibrium** 


* **1st Law**  

  Expresses the idea that energy is a _conserved_ quantity, the only way to change the energy of a system is to either apply _heat_ or do _work_ on the system. This is summarised in the equation: $$ dU = dS - dW $$ 

* **2nd Law**

  $$ dS \geq 0 $$ 

  Expresses the idea of an _irreversible_ process. Heat cannot flow from a hot object to a cold object on its own.

* **3rd Law**

  Expresses the idea that there is an _absolute zero_ of temperature.  

Importantly, thermodynamics is entirely empirical. 

This means it makes no speculation to the behaviour at the **microscopic** level. Quantum Mechanics tells us that it is possible to specify how particles at the microscopic level _should_ behave by use of the Schrodinger equations. 

Macroscopic systems contain many particles $$\Rightarrow$$ Schrodinger equations become exponentially more complex. [^1] 

In statistical physics we deal with **Microstates** and **Macrostates** and their corresponding variables. 

| Macroscopic variables | Microscopic variables |
| :-------------------- | :-------------------- |
| Volume - _V_          | Position - $$x_i$$    |
| Entropy - _S_         | Momentum - $$p_i$$    |
| Temperature - _T_     |                       |

For a given **Microstate** we need to specify the set of microscopic variables for _every_ particle in the state, and so importantly a **Microstate** describe the state of _every_ particle in the system.

The **Statistical Weight**[^2] (symbol: **$\Omega$**), is a measure of the number of **Microstates** per **Macrostate**.

The **Statistical Weight** is always a positive integer, it is _un-normalized_ and it is **not** a probability!

----

####Single Particle States

We can construct a **single particle state** which is the set of **Microscopic** variables for a _single_ particle in the  system. So for particle _Steve_, its single particle state will be {$$x_{Steve}$$,$p_{Steve}$}. This is **NOT** a microstate, which describes _every_ particle in the system. 

Now, if we assume **weakly interacting** particles, then each particle can be treated independently. 

This means the **Microstate** of the system can be described by stating which **single particle state** each particle is in. We can do this because the **single particle state** of any one particle has no bearing on the state of another. 

---

#### Distinguishable vs Indistinguishable particles

**Indistinguishable particles** 

Quantum mechanics tells us that all particles of the same type are identical. If you have two electrons, you can't tell one from the other, they have identical properties. 







### Key things to remember

* **Macrostate**- Set of variables which describe the state of the whole system.
* **Microstate** - Set of variables which describe the state of an individual particle
* **Statistical Weight** ($$\Omega$$) - The number of microstates for a given microstate. 
* **Single-Particle State** - The set of microscopic variables for a single particle in a microstate. Not the same thing as a microstate.

[^1]: In a single mole of a substance there are $$6.02\times10^{24}$$ atoms, that's a lot of maths!
[^2]: Sometimes called _Thermodynamic probability_ though importantly the Statistical Weight is **not** a probability



