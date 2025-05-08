const optionEvents = require("./optionEvents.js")

function displayOptionEvents(events) {
    events.forEach((event, index) => {
        console.log(`Event ${index + 1}: ${event.initialMessage}`);
        console.log("Options:");

        event.options.forEach((option, optionIndex) => {
            console.log(`  ${optionIndex + 1}. ${option.optionName}`);
            option.values.forEach((result, resultIndex) => {
                console.log(`     - Result ${resultIndex + 1}: ${result.message} (Gain: ${result.gain}, Weight: ${result.weight})`);
            });
        });
    });
}

// Call the function to display the events
displayOptionEvents(optionEvents);
