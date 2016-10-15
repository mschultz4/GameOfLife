//let React = require('react');
//let ReactDOM = require('react-dom');

var Cell = function (props) {
    return (
        <td
            id={props.id}
            onClick={props.handleCellClick}
            className={props.alive ? "alive" : "dead"}
            ></td>);
}

var Board = function (props) {
    var rows = [];

    for (let i = 1; i <= props.boardHeight; i++) {
        let cells = [];

        for (let j = 1; j <= props.boardWidth; j++) {
            let id = createId(i, j),
                alive = props.cells[id].alive ? true : false;
            cells.push(
                <Cell
                    id={id}
                    key={id}
                    alive={alive}
                    handleCellClick={props.handleCellClick} />
            );
        }
        rows.push(<tr key={i}>{cells}</tr>);
    }

    return (<table><tbody>{rows}</tbody></table>);
};

var Form = React.createClass({
    getInitialState: function () {
        return {
            boardWidth: this.props.boardWidth,
            boardHeight: this.props.boardHeight
        };
    },
    render: function () {
        return (
            <form onSubmit={this._onSubmit}>
                <div>
                    <label htmlFor="boardHeight">Height</label>
                    <input
                        id="boardHeight"
                        value={this.state.boardHeight}
                        type="text"
                        onChange={this._onHeightInput}
                        />
                </div>
                <div>
                    <label htmlFor="boardWidth">Width</label>
                    <input
                        id="boardWidth"
                        value={this.state.boardWidth}
                        type="text"
                        onChange={this._onWidthInput}
                        />
                </div>
                <button type="submit">submit</button>
                <button type="" onClick={this.props.handleStartClick}>start</button>
                <button type="" onClick={this.props.handleStopClick}>stop</button>
            </form>
        );
    },
    _onWidthInput: function (e) {
        if (typeof e.target.value === "string") {
            this.setState({ boardWidth: e.target.value });
        }
    },
    _onHeightInput: function (e) {
        if (typeof e.target.value === "string") {
            this.setState({ boardHeight: e.target.value });
        }
    },
    _onSubmit: function (e) {
        e.preventDefault();

        this.props.onBoardSizeChange({
            boardHeight: this.state.boardHeight,
            boardWidth: this.state.boardWidth
        });
    }
});

var Game = React.createClass({
    getInitialState: function () {
        let height = 20,
            width = 20;

        return {
            boardHeight: height,
            boardWidth: width,
            cells:{} 
        };
    },
    componentWillMount: function(){
       this._populateCells(this.state.boardHeight, this.state.boardWidth);
    },
    render: function () {
        return (
            <div>
                <Board
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                    handleCellClick={this._handleCellClick}
                    cells={this.state.cells}
                    />
                <Form
                    onBoardSizeChange={this._updateBoard}
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                    handleStartClick={this._handleStartClick}
                    handleStopClick={this._handleStopClick}
                    />
            </div>
        );
    },
    _updateBoard: function (boardSize) {
        this.setState({
            boardWidth: boardSize.boardWidth,
            boardHeight: boardSize.boardHeight
        });
    },
    _handleCellClick: function (e) {
        let cells = Object.assign({}, this.state.cells);
        cells[e.target.id].alive = cells[e.target.id].alive ? false : true;

        this.setState({ cells: cells });
    },
    _populateCells: function (height, width) {
        let cells = {};

        for (let i = 1; i <= width; i++) {
            for (let j = 1; j <= height; j++) {
                let id = createId(i, j);
                cells[id] = cell(i, j);
            }
        }
        this.setState({cells: cells}, function(){
            console.log(this.state.cells);
        });
    },
    _handleStartClick: function () {
        let self = this;
        let interval = setInterval(function(){
            self._runGeneration();
        }, 200);
        
        this.setState({interval: interval});
    },
    _handleStopClick: function(){
       clearInterval(this.state.interval); 
    },
    _runGeneration: function () {
        let cells = Object.assign({}, this.state.cells);
        
        for (let id in cells) {
            let alive = 0;
            cells[id]
                .neighbors
                .forEach(function (x) {
                    if (cells[x] && cells[x].alive) {
                        alive += 1;
                    }
            });

            cells[id].liveNeighbors = alive;
        }
        
        for (let id in cells) {
            let cell = cells[id];
            if (cell.liveNeighbors < 2){
                cell.alive = false;
            }
            
            if (cell.alive && cell.liveNeighbors > 3){
                cell.alive = false;
            }
            
            if (!cell.alive && cell.liveNeighbors === 3){
                cell.alive = true;
            }
        }


        this.setState({ cells: cells });
    }

});

function createId(x, y) {
    return .5 * (x + y) * (x + y + 1) + y;
}

function cell(x, y) {
    return {
        alive: false,
        liveNeighbors: 0,
        neighbors: findNeighbors(x, y)
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

}


ReactDOM.render(<Game/>, document.getElementById('game'));
