Alrighty gamers, this is the code for the Wafflehouse discord bot. You run it by running 'node deploy-commands.js && node index.js' in the terminal (very professional I know). This starts the bot. Then you can invite the bot to a server using [The Link](https://discord.com/oauth2/authorize?client_id=1349854140368683132&permissions=10173905366210&integration_type=0&scope=bot+applications.commands "very cool")

This will require you to have node.js installed on your computer and I also don't know how to run it on windows (or at least without a bash terminal) so good luck with that.

## This shit needs to be tested way more than it currently is.
The only good thing is I don't think I'm leaking data or anything so that's fine.

- [ ] Credit system
    - Users can gain credits by participating in events/commands
    - Users can spend credits on items
    - Shop System
- [x] funny useless commands
    - [x] Flip a coin
    - [x] Roll a dice (Default: 6)
    - [x] `!8ball`
    - [x] `!leave wafflehouse` : `You can never leave the wafflehouse`
- [x] Admin commands
    - [x] Add credits to a user
    - [x] Remove credits from a user
    - [x] Add items to a user
    - [x] Remove items from a user
- [x] Random encounters
    - [x] Some random encounters can lead to fights depending on whether the user accepts or not
    - [x] Some random encounters just result in nothing
    - [x] Some random encounters can result in good fortune
    - [x] Some random encounters you get an option (Dodge - Catch, if you dodge you get nothing, if you catch theres a chance you lose and a chance you win)

Fights:
- [x] When you get challenged to a fight you get a couple of options
    - Fight
    - Syrup
    - Hashbrown
    - Scream
    - Special attack every couple turns
- [ ] Status Effects (Later)
- [x] Make the special attack actually be Wafflehouse related
- [x] More opponents
- [x] Better Win/Lose messages
- [ ] Balancing
