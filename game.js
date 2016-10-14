/*
    Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by over-population.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/


function gameOfLife(height, width) {
    let cells = {};

    populateCells();

    return {
        cells: cells,
        runGeneration: runGeneration
    };

    function runGeneration() {
        for (cell in cells){
            switch(cell){
                case cell.liveNeighbors < 2:
                 cell.alive = false;
                break;

                case cell.alive && cell.liveNeighbors > 3:
                    cell.alive = false;
                    break;
                
                case !cell.alive && cell.liveNeighbors === 3:
                    cell.alive = true;
                    break;
            }
        }
    }

    function populateCells() {
        for (let i = 1; i <= width; i++) {
            for (let j = 1; j <= height; j++) {
                let id = createId(i, j);
                cells[id] = cell(i, j)
            }
        }
    }
}

function cell(x, y) {
    return {
        alive: false,
        liveNeighbors: 0,
        neighbors: findNeighbors(x, y),
        updateLiveNeighbors: updateLiveNeighbors
    };

    function findNeighbors(x, y) {
        return [
            createId(x - 1, y - 1),
            createId(x + 1, y),
            createId(x, y + 1),
            createId(x + 1, y + 1),
            createId(x, y - 1),
            createId(x + 1, y - 1),
            createId(x - 1, y + 1),
            createId(x - 1, y)
        ];
    }

    function updateLiveNeighbors() {
        let count = 0;
        this.neighbors
            .forEach(function (n) {
                if (cells[n] && cells[n].alive) {
                    count += 1;
                }
            });
        this.liveNeighbors = count;
        return count;
    }
}

function createId(x, y) {
    return .5 * (x + y) * (x + y + 1) + y;
}