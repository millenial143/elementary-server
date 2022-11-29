import Tile from "./Tile";
import PlainTile from "./PlainTile";
import BaseTile from "./BaseTile";

export default class Field{
    private size: number;
    private tiles: Tile[] = [];

    constructor(size: number) {
        this.size = size;

        this.generateTiles(this.size);
    }

    generateTiles(size: number){
        let baseNumber = 1;
        for (let i = 0; i <= this.size * 2; i++){
            for (let j = 0; j <= this.size * 2; j++){
                if ((i - j) <= this.size && (i - j) >= -this.size){
                    let tile: any;
                    /*if ((i == 3 && j == 2) ||
                        (i == 3 && j == 5) ||
                        (i == 5 && j == 4) ||
                        (i == 5 && j == 6) ||
                        (i == 7 && j == 5) ||
                        (i == 7 && j == 8)){
                        tile = new BaseTile(i, j, 1);
                    }*/
                    if ((i == 0 && j == 0) ||
                        (i == 10 && j == 10)){
                        this.tiles.push(new BaseTile(i, j, baseNumber));
                        baseNumber += 1;
                    } else {
                        this.tiles.push(new PlainTile(i, j));
                    }

                }
            }
        }
    }

    getSide(){
        return this.size;
    }

    getTiles(){
        return this.tiles;
    }
}