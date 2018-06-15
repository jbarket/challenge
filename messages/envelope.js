/* In Scala/C#/etc, I would normally think of each message as being an
individual class with properties specific to the type of message being
passed. However, since we're in dynamic land here, it seems like a 
single class can represent any simple message for this system. */

class Envelope {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
}