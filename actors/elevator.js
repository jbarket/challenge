import '../messages/envelope';
import 'pseudo/floorStatus';

class Elevator {

    /* We'll take all information necessary in the constructor. This way, if we
    persist the Elevator actor's state somehow in the future, we can recover from
    a failure without losing vital information like how many trips have been made
    between services */
    
    constructor(floorsTotal, floorsCurrent = 1, tripsMade = 0, floorsPassed = 0) {
        if (!floorsTotal) {
            throw "Elevator did not receive required parameter floorsTotal. It is unsafe to run without knowing this.";
        }

        this.floorsTotal = floorsTotal;
        this.floorsCurrent = floorsCurrent;
        this.tripsMade = tripsMade;
        this.floorsPassed = floorsPassed;

        /* We'll start assuming that we're in the right place. */
        this.floorsRequested = floorsCurrent;
        this.floorsLastMove = null;
    }

    /* To make the math simpler, we'll expect that the floors will be specified in human friendly format, rather
    than starting at 0. */

    move(floor) {
        if (!Number.isInteger(floor)) {
            return new Envelope("InvalidFloor", "You must specify a whole number for the floor.")
        }

        if (floor > floorsTotal) {
            return new Envelope("InvalidFloor", "That floor is too high for this elevator. Please try the Wonkavator.");
        }

        if (floor < 1) {
            return new Envelope("InvalidFloor", "That floor is too low. Look for basement support in an upcoming release.")
        }

        return true;
    }

    /* For this to be accurate, we have to be able to retrieve the floor via instrumentation, like a switch that will be
    tripped by the elevator car as it approaches each floor. This method is pseudo-code to handle messages from some
    external library that's retrieving the current state of that switch. */

    setFloor(floor) {

        /* We may receive multiple signals that we are at the same floor. There's nothing to record for this. */
        if (this.floorsCurrent == floor) {
            return;
        }

        /* Otherwise, we've moved at least one floor. We expect this number to usually be 1, but because we're
        receiving these messages externally and we don't want to ignore the possibility that a switch could be
        disabled preventing us from detecting a particular floor, we always want to take the difference. */
        this.floorsPassed += abs(this.floorsCurrent - floor);

        this.floorsCurrent = floor;

        if (this.floorsCurrent == this.floorsRequested) {
            this.tripsMade += 1;
        }
    }    
    
}