In the summer of 2019 I was fortunate enough to be selected to participate in Imperial's International Research
Opportunities program (or IROP) where I had the chance to conduct research at the University of British
Columbia in Vancouver, BC, Canada.  
<br/>
The focus of my research this summer was in applying Neural Networks to statistical models in physics,
more specifcally the Ising Model. The Ising Model is a simple model that describes ferromagnetic behaviour
and is one of the simplest statistical models to display a phase transition. A phase transition is defined as a
rapid change in the behaviour at a given temperature, known as the **critical temperature**. In the case of
the Ising Model, the phase transition observed is between the ordered phase, where all the spins in the lattice
are aligned in one direction and the disordered phase where the spin direction is entirely randomised. The first
part of my project was to create a **Monte Carlo simulation** that replicated this behaviour. The images shown on the left show a comparison of a configuration taken at cold temperatures *(T << TC)* and a configuration at a hot
temperature *(T >> TC)*. As the temperature of the lattice increases the single large domain begins to split
into many smaller domains of spins all aligned in the same direction until the critical temperature is reached.
At that point the domains begin to break down into pure noise and there is no magnetic order at all left in
the system. By plotting the net magnetization of the lattice, that is the sum of all the spin directions in the
lattice and plotting this as a function of the temperature, the phase transition was observed.  
<br/>
One interesting thing that is seen with the Ising Model is that snapshots of lattice configurations at temperatures slightly above or slightly below the critical temperature appear near indistinguishable. This leads onto the main focus of the project, to try and see if a neural network can detect and learn a difference between
the two samples: one sub-critical *(T < TC)* and the other super-critical *(T > TC)*. The first test was to use
a *feed forward* neural network. In this structure the network is divided up into several *hidden
layers* between the output and input neurons. These intermediate layers are fully connected to the previous
and subsequent layers. This neural network architecture is able to distinguish temperature of approximatly 0.1 *kB*  away from
the critical temperature with greater than 99% accuracy. Around the critical temperature the performance
begins to degrade however to some extent this is to be expected. From a statistical physics perspective it is
known that any given lattice configuration can be valid across all temperatures. Configurations with energies
far away than the statistical average however are statistically exceptionally rare. For two temperatures close
together on either side of TC, a configuration drawn at one temperature is also a likely to be a probable configuration of the other temperature.  
<br/>
One improvement that was made was to use convolutional neural networks **(CNNs)**. These have the ad-
vantage of preserving the original structure and shapes present in the original 2D images. When using **CNNs**
the training accuracy improved by around 7% from 80% to 87% still a fairway from the maximum obtainable
accuracy of around 93%. Towards the end of the project the idea of using residual connections inside both
network structures was investigated. This involves allowing connections in the network to allow for larger more
complex networks to be tested. This helps to mitigate the problem of the input signal being lost due to as the
network depth increased.