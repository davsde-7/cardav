
class BufferBattery {
    constructor(owner, currentCapacity, maxCapacity) {
        this.owner = owner;
        this.currentCapacity = currentCapacity;
        this.maxCapacity = maxCapacity;
        this.minCapacity = 0;
    }

    setCapacity(capacity) {
        if (this.currentCapacity + capacity > this.maxCapacity) {
            this.currentCapacity = this.maxCapacity;
        } else if (this.currentCapacity + capacity < this.minCapacity) {
            this.currentCapacity = this.minCapacity;
        } else {
            this.currentCapacity += capacity;
        }
    }

    getCapacity() {
        return this.currentCapacity;
    }
}
module.exports = BufferBattery;