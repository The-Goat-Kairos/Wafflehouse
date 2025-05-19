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
    #optionResults;
    constructor(optionName, values) {
        this.#optionName = optionName;
        this.#optionResults = values;
    }

    getWeightedRandomValue() {
        let totalWeight = 0;
        this.#optionResults.forEach(result => {
            totalWeight += result.weight;
        });

        if (totalWeight !== 1) {
            console.error(`You fucked up. The total weight of options for ${this.#optionName} is ${totalWeight}.`);
        }

        const random = Math.random() * totalWeight;

        let cursor = 0;
        for (const optionResult of this.#optionResults) {
            cursor += optionResult.weight;
            if (cursor >= random) {
                return optionResult; // Return the selected value
            }
        }

        return "Okay something's not right";
    }

    get optionResults() {
        return this.#optionResults;
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

const optionEvents = [
    new OptionEvent(
        "A drunk man throws a beer at you!",
        [
            new Option("Dodge", [
                new OptionResult("You dodge the bottle!", 0, 0.75),
                new OptionResult("You try to dodge, trip, and the bottle ends up shattering on the back of your head...", -10, 0.25),
            ]),
            new Option("Catch", [
                new OptionResult("You do a sick flip and catch the bottle!", 20, 0.25),
                new OptionResult("You try to catch the bottle, but it smashes cleanly into your face...", -5, 0.75),
            ]),
        ]
    ),
    new OptionEvent(
        "You find a wallet on the ground.",
        [
            new Option("Return it to the owner", [
                new OptionResult("You find the owner and return the wallet. They thank you!", 10, 0.75),
                new OptionResult("The owner is rude and accuses you of stealing!", -5, 0.25),
            ]),
            new Option("Keep it for yourself", [
                new OptionResult("You find $40 inside!", 30, 0.25),
                new OptionResult("You get caught by the police!", -15, 0.75),
            ])
        ]
    ),
    new OptionEvent(
        "A mysterious stranger offers you a potion.",
        [
            new Option("Drink the potion", [
                new OptionResult("You feel invigorated and gain some very needed energy.", 25, 0.25),
                new OptionResult("You feel sick and lose some health.", -15, 0.75),
            ]),
            new Option("Refuse the potion", [
                new OptionResult("You walk away safely from what was most likely poison. Good job, you.", 0, 0.75),
                new OptionResult("The stranger curses you!", -5, 0.25),
            ])
        ]
    ),
    new OptionEvent(
        "You walk into a Waffle House and see a fight breaking out in the parking lot.",
        [
            new Option("Watch the fight", [
                new OptionResult("You witness an epic showdown and get some great stories to tell!", 10, 0.75),
                new OptionResult("You accidentally get hit by a flying chair!", -10, 0.25),
            ]),
            new Option("Try to break it up", [
                new OptionResult("You successfully calm everyone down and earn their respect!", 25, 0.25),
                new OptionResult("You get pulled into the fight!", -20, 0.75),
            ])
        ]
    ),
    new OptionEvent(
        "A group of mysterious cloaked figures who claim to hail from the forests enter the establishment.",
        [
            new Option("Serve them like normal", [
                new OptionResult("Nothing out of the ordinary happens and they even tip you generously.", 10, 0.75),
                new OptionResult("They are displeased and drag a random customer deep into the forests.", -10, 0.25),
            ]),
            new Option("Call the local witch hunters", [
                new OptionResult("One of the figures intercepts you before you can make the call and you are sacrificed ceremoniously.", -25, 0.75),
                new OptionResult("The group is successfully apprehended and they pay you handsomly for your service.", 25, 0.25),
            ])
        ]
    ),
    new OptionEvent(
        "There is a power surge in Waffle House during a busy night.",
        [
            new Option("Stay and help", [
                new OptionResult("The power goes back on a while later and nothing substantial really happened. You got a waffle for helping.", 5, 0.75),
                new OptionResult("You had trouble calming an old couple, resulting in them storming out of the waffle house.", -5, 0.25),
            ]),
            new Option("Panic and leave immediately", [
                new OptionResult("You trip on the way out and drop your phone!", -15, 0.75),
                new OptionResult("While stumbling through the crowd outside, you accidentally find the cat on the missing cat posters!", 15, 0.25),
            ])
        ]
    ),
];


module.exports = optionEvents;
