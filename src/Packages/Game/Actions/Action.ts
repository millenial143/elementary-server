import Game from "../Game";

export default abstract class Action {
    protected code: string;
    protected isAura: boolean;
    protected range: number;

    protected constructor(code, isAura, range) {
        this.code = code;
        this.isAura = isAura;
        this.range = range;
    }

    getCode(){
        return this.code;
    }

    abstract doAction(game: Game, move: any)
}


