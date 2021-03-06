So, after giving this exercise some thought, I feel like the actor model probably suits elevators very well.

You have individual items that need to retain state while they operate (Elevators), a parent that manages their operation (Elevator Banks) and a variety of messages that can be triggered.

I've left out using a particular actor library because, honestly, I'm not familiar with any of the JavaScript actor implementations. In my mind, I was thinking of Akka.

As far as scaling is concerned, I think we're pretty safe out of the box. A single elevator bank should be able to control a sane number of elevators while running on a single instance. If that instance dies, we can easily bring the whole suite back up on a new instance. If we're persisting actor state, we should be able to even restore their location, number of trips, et cetera in that case.

If we do come up with a scenario where a single bank of elevators is so large that it can't run on a single instance--or we're running this on a bunch of Raspberry Pis instead of AWS/Azure--actor frameworks are capable of scaling. We can have Elevator actors on remote machines, or even cluster the actual management of the Elevator Banks across multiple instances.

The thing I like best is that the pieces don't have to know anything about each other. The Elevators and their parent Bank can be on the same instance or different instances. Their locations are completely transparent. They just send out a message, and the actor system routes it for us without thinking about it. This leaves us to worry about only the state and logic of handling the elevators themselves.

We can also have additional actors that react to the same messages. We may want to move analytics out to its own actor that can manage all of the information about a given elevator. It can make determiantions about when it should be serviced based on a variety of factors without cluttering up the Elevator itself.

Oh, and if you guys turn out to be huge on prototypical inheritence and hate the fact that I used the class syntactic sugar, I'm pretty malleable.