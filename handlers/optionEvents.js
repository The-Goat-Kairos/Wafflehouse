class OptionEvent {
    #initialMessage;
    #options;
    constructor(initialMessage, options) {
        this.#initialMessage = initialMessage;
        this.#options = options
    }

    get initialMessage() {
        return this.#initialMessage;
    }

    get options() {
        return this.#options;
    }
}

class Option {
    #optionName;
    #values;
    constructor(optionName, values) {
        this.#optionName = optionName;
        this.#values = values;
    }

    getWeightedRandomValue() {
        const totalWeight = this.#values.reduce((sum, value) => sum + value.weight, 0);
        if (totalWeight !== 1) {
            console.error(`You fucked up. The total weight of options for ${optionName()} is ${totalWeight}.`);
        }
        const random = Math.random() * totalWeight;
        let cumulativeWeight = 0;

        for (const value of this.#values) {
            cumulativeWeight += value.weight;
            if (random < cumulativeWeight) {
                return value; // Return the selected value
            }
        }
    }

    get values() {
        return this.#values;
    }

    get optionName() {
        return this.#optionName;
    }
}

class OptionResult {
    constructor(message, gain, weight) {
        this.message = message;
        this.gain = gain;
        this.weight = weight;
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
        [
            new Option("Dodge", [
                new OptionResult("You dodge the bottle!", 0, 0.75),
                new OptionResult("You try to dodge, trip, and the bottle ends up shattering on the back of your head...", -10, 0.25)
            ]),
            new Option("Catch", [
                new OptionResult("You do a sick flip and catch the bottle!", 20, 0.25),
                new OptionResult("You try to catch the bottle, but it smashes cleanly into your face...", -5, 0.75)
            ]),
        ]
    ),
    new OptionEvent(
        "You find a wallet on the ground.",
        [
            new Option("Return it to the owner", [
                new OptionResult("You find the owner and return the wallet. They thank you!", 10, 0.75),
                new OptionResult("The owner is rude and accuses you of stealing!", -5, 0.25)
            ]),
            new Option("Keep it for yourself", [
                new OptionResult("You find $40 inside!", 30, 0.25),
                new OptionResult("You get caught by the police!", -15, 0.75)
            ])
        ]
    ),
    new OptionEvent(
        "A mysterious stranger offers you a potion.",
        [
            new Option("Drink the potion", [
                new OptionResult("You feel invigorated and gain some very needed energy.", 25, 0.25),
                new OptionResult("You feel sick and lose some health.", -15, 0.75)
            ]),
            new Option("Refuse the potion", [
                new OptionResult("You walk away safely from what was most likely poison. Good job, you.", 0, 0.75),
                new OptionResult("The stranger curses you!", -5, 0.25)
            ])
        ]
    ),
];


module.exports = optionEvents;
