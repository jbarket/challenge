import '../messages/envelope';

class Elevator {

    /* We'll take all information necessary in the constructor. This way, if we
    persist the Elevator actor's state somehow in the future, we can recover from
    a failure without losing vital information like how many trips have been made
    between services */
    
    constructor(floorsTotal, floorsCurrent = 0, tripsMade = 0, floorsPassed = 0) {
        if (!floorsTotal) {
            throw "Elevator did not receive required parameter floorsTotal. It is unsafe to run without knowing this.";
        }

        this.floorsTotal = floorsTotal;
        this.floorsCurrent = floorsCurrent;
        this.tripsMade = tripsMade;
        this.floorsPassed = floorsPassed;
    }

    /* We expect the message to specify the machine friendly format of the floor.
    That is to say, if the user pushes the 1 button on the elevator, our expectation
    is that we'll receive 0 here. */

    move(floor) {
        if (floor > floorsTotal - 1) {
            return 
        }

    }
}