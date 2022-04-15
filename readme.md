# Competition

A library for creating and managing competitions.

## Installation

Use either `npm` or `yarn` to install `competition`

```bash
# NPM
npm install --save competition

#Yarn
yarn add competition
```

## Usage
### Brackets
#### Elimination Bracket
```javascript
import { Elimination } from 'competition'

const options = {
  
}
const bracket = new EliminationBracket()
```
#### Swiss Tournament
Coming soon...
#### Round-Robin Tournament
Coming soon...
#### Participants
```javascript
import { Elimination, Participant } from 'competition'

// ...

const participantOptions = {

}
const participant = new Participant(participantOptions)

```
#### Matches

### Rating Systems

#### Elo

#### Glicko2
##### Player
##### Glicko2 for Teams
##### Glicko2 for Races

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)