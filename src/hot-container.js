import { hot } from "@nodegui/react-nodegui";

let Entry = require('__entry__'); // eslint-disable-line import/no-unresolved
let App = Entry.default || Entry;

export default hot(App);