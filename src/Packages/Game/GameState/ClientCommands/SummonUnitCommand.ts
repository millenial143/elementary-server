import ClientCommands from "./ClientCommands";

export default class SummonUnitCommand extends ClientCommands{
    constructor(props: object) {
        super(0, 0, 'SummonUnit', props);
    }
}