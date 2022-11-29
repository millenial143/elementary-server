export default class ClientCommands{
    protected phase: number;
    protected priority: number;
    protected name: string;
    protected properties: object;

    constructor(phase, priority, name, properties) {
        this.phase = phase;
        this.priority = priority;
        this.name = name;
        this.properties = properties;
    }

    public getName(){
        return this.name;
    }
}