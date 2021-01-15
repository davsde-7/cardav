
class BufferBattery {
    constructor(owner, currentCapacity, maxCapacity) {
        this.owner = owner;
        this.currentCapacity = currentCapacity;
        this.maxCapacity = maxCapacity;
        this.minCapacity = 0;
    }

    /*setCapacity(x) sets the current capacity in the battery*/
    setCapacity(capacity) {
        if (this.currentCapacity + capacity > this.maxCapacity) {
            this.currentCapacity = this.maxCapacity;
        } else if (this.currentCapacity + capacity < this.minCapacity) {
            this.currentCapacity = this.minCapacity;
        } else {
            this.currentCapacity += capacity;
        }
    }

    /*getCapacity() returns the current capacity in the battery*/
    getCapacity() {
        return this.currentCapacity;
    }
}
module.exports = BufferBattery;