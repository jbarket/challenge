import 'elevator';
import 'pseudo/actors';

class ElevatorBank {
    constructor(floorsTotal, numElevators = 1) {
        if (!floorsTotal) {
            throw "Elevator Bank did not receive required parameter floorsTotal. It is unsafe to run without knowing this.";
        }

        this.floorsTotal = floorsTotal;
        this.numElevators = numElevators;

        this.elevators = [];
        this.initializeElevators();
    }

    initializeElevators() {
        while (this.elevators.length < this.numElevators) {
            this.elevators.push(this.initializeElevator);
        }
    }

    /* For now, we have no actor persistence, so we'll have to assume that the orchestrator is always started in a clean state.
    That means that the elevators must be serviced and placed on the ground floor before initializing it. In the future, we can
    persist the individual actor states and use this to restore them in the event of a power failure or code explosion */
    
    initializeElevator() {
        return new Elevator(this.floorsTotal, 1, 0, 0)
    }

    decomissionElevator(id) {
        this.elevators = this.elevators.filter(e => e.id !== id);
    }
    
    request(floor) {
        var elevator = this.findElevator(floor);
        Actors.tell(new Envelope("MoveElevator", { id: elevator.id, floor: floor }));
    }

    /* We have three possibilities: 
        1. There is an elevator on this floor already.
        2. There is an occupied elevator about to pass this floor.
        3. We just get the closest unoccupied elevator */

    findElevator(floor) {
        /* Unoccupied elevator on this floor already */
        const waitingElevator = this.elevators.filter(e => e.floorsCurrent === floor && !e.occupied);

        if (waitingElevator.length > 0) {
            return waitingElevator[0];
        }

        /* Occupied elevator about to pass this floor. We sort them by distance from the requested floor */
        const movingElevators = this.elevators
                                .filter(e => e.occupied && this.floorIsBetween(e.floorsCurrent, e.floorsRequested, floor))
                                .sort((a, b) => abs(floor - b.floorsCurrent) - abs(floor - a.floorsCurrent));
        
        if (movingElevators.length > 0) {
            return movingElevators[0];
        }

        /* Closed unoccupied elevator. Pretty similar to last one */
        const unoccupiedElevators = this.elevators
                                .filter(e => !e.occupied)
                                .sort((a, b) => abs(floor - b.floorsCurrent) - abs(floor - a.floorsCurrent));
        
        if (unoccupiedElevators.length > 0) {
            return unoccupiedElevators[0];
        }
    }

    /* Thanks SO: https://codegolf.stackexchange.com/questions/8649/shortest-code-to-check-if-a-number-is-in-a-range-in-javascript */

    floorIsBetween(floorsCurrent, floorsRequested, floorToCheck) {
        return (floorToCheck - floorsCurrent) * (floorToCheck - floorsRequested) < 0
    }
} 