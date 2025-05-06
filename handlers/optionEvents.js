class OptionEvent {
    constructor(initialMessage, optionOne, optionTwo) {
        this.initialMessage = initialMessage;
        this.optionOne = optionOne
        this.optionTwo = optionTwo
    }

    get initialMessage() {
        return this.initialMessage;
    }

    get optionOne() {
        return this.optionOne;
    }

    get optionTwo() {
        return this.optionTwo;
    }
}

class Option {
    constructor(optionName, values) {
        this.optionName = optionName;
        this.values = values;
    }

    getRandomValue() {
        return this.values[Math.floor(Math.random() * this.values.length)];
   }

    get optionName() {
        return this.optionName;
    }
}

// Option
// - OptionName: String
// - [
//      {potentialMessage: String, potentialCost: Int, weight: Float (Percentage)},
//      ...,
//      ...
//   ]

const optionEvents = [
    new OptionEvent(
        "A drunk man throws a beer at you!",
        new Option("Dodge", [
            {message: "You dodge the bottle!", gain: 0, weight: 0.5},
            {message: "You trip and the bottle smashes you in the face", gain: -10, weight: 0.5}
        ]),
        new Option("Catch", [
            {message: "You do a sick flip and catch the bottle", gain: 10, weight: 0.3},
            {message: "The bottle smashes cleanly into your face", gain: -5, weight: 0.7}
        ]),
    )
];

module.exports = optionEvents;
