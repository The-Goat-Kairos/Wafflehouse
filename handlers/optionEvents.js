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
                new OptionResult("You dodge the bottle and stumble into a good waffle. Delicious!", 10, 0.1),
                new OptionResult("You trip and the bottle smashes you in the face", -10, 0.15)
            ]),
            new Option("Catch", [
                new OptionResult("You do a sick flip and catch the bottle", 10, 0.3),
                new OptionResult("The bottle smashes cleanly into your face", -5, 0.7)
            ]),
        ]
    ),
    new OptionEvent(
        "You find a wallet on the ground.",
        [
            new Option("Return it to the owner", [
                new OptionResult("You find the owner and return the wallet. They thank you!", 10, 0.7),
                new OptionResult("The owner is rude and accuses you of stealing!", -5, 0.3)
            ]),
            new Option("Keep it for yourself", [
                new OptionResult("You find $40 inside!", 40, 0.2),
                new OptionResult("You get caught by the police!", -20, 0.8)
            ])
        ]
    ),
    new OptionEvent(
        "A mysterious stranger offers you a potion.",
        [
            new Option("Drink the potion", [
                new OptionResult("You feel invigorated and gain some very needed energy.", 20, 0.2),
                new OptionResult("Your hair falls out but it *did* cure your headache.", 8, 0.2),
                new OptionResult("You feel sick and lose some health.", -15, 0.6)
            ]),
            new Option("Refuse the potion", [
                new OptionResult("You walk away safely from what was most likely poison. Good job, you.", 0, 0.8),
                new OptionResult("The stranger curses you!", -5, 0.2)
            ])
        ]
    ),
];


module.exports = optionEvents;
