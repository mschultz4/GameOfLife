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
            let id = createId(j, i),
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
                    <input
                        id="boardHeight"
                        value={this.state.boardHeight}
                        type="text"
                        onChange={this._onHeightInput}
                        />
                    <i className="fa fa-times"></i>
                    <input
                        id="boardWidth"
                        value={this.state.boardWidth}
                        type="text"
                        onChange={this._onWidthInput}
                        />
                    <button type="submit">update</button>
                </div>
                <button type="button" onClick={this.props.handleStartClick}><i className="fa fa-play"></i></button>
                <button type="button" onClick={this.props.handleStopClick}><i className="fa fa-stop"></i></button>
                <button type="button" onClick={this.props.handleClearClick}><i className="fa fa-eraser"></i></button>
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
        let height = 30,
            width = 30,
            cells = this._populateCells(width, height, true),
            lastModified = [];

        for (let id in cells) {
            if (cells[id].alive) {
                lastModified.push(id);
            }
        }

        return {
            boardHeight: height,
            boardWidth: width,
            cells: cells,
            lastModified: lastModified,
            generation: 0
        };
    },
    componentDidMount: function () {
        this._handleStartClick();
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
                <div>Generation: {this.state.generation}</div>
                <Form
                    onBoardSizeChange={this._updateBoard}
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                    handleStartClick={this._handleStartClick}
                    handleStopClick={this._handleStopClick}
                    handleClearClick={this._handleClearClick}
                    />
            </div>
        );
    },
    _runGeneration: function () {
        let cells = Object.assign({}, this.state.cells);
        let nextModified = [];

        this.state.lastModified.forEach(function (id) {
            cells[id].neighbors.forEach(function (nId) {
                let cell = cells[nId];
                if (cell) {
                    cell.liveNeighbors += cells[id].alive ? 1 : -1;
                }
            });
        });

        this.state.lastModified.forEach(function (id) {
            cells[id].neighbors.forEach(function (nId) {
                let cell = cells[nId];
                if (cell) {
                    if (cell.alive && cell.liveNeighbors < 2) {
                        cell.alive = false;
                        nextModified.push(nId);

                    }

                    if (cell.alive && cell.liveNeighbors > 3) {
                        cell.alive = false;
                        nextModified.push(nId);

                    }

                    if (!cell.alive && cell.liveNeighbors === 3) {
                        cell.alive = true;
                        nextModified.push(nId);

                    }
                }
            });
            let cell = cells[id];
            if (cell) {
                if (cell.alive && cell.liveNeighbors < 2) {
                    cell.alive = false;
                    nextModified.push(id);
                }

                if (cell.alive && cell.liveNeighbors > 3) {
                    cell.alive = false;
                    nextModified.push(id);
                }

                if (!cell.alive && cell.liveNeighbors === 3) {
                    cell.alive = true;
                    nextModified.push(id);
                }
            }
        });

        this.setState({
            cells: cells,
            lastModified: nextModified,
            generation: this.state.generation + 1
        });
    },
    _updateBoard: function (boardSize) {
        this.setState({
            cells: this._populateCells(boardSize.boardWidth, boardSize.boardHeight),
            boardWidth: boardSize.boardWidth,
            boardHeight: boardSize.boardHeight,
            generation: 0
        });
    },
    _handleCellClick: function (e) {
        let cells = Object.assign({}, this.state.cells),
            modified = this.state.lastModified;

        cells[e.target.id].alive = cells[e.target.id].alive ? false : true;

        if (modified.indexOf(e.target.id) < 0) {
            modified.push(e.target.id);
        }

        this.setState({ cells: cells, lastModified: modified });
    },
    _populateCells: function (width, height, random) {
        let cells = {};

        for (let i = 1; i <= width; i++) {
            for (let j = 1; j <= height; j++) {
                let id = createId(i, j);
                cells[id] = cell(i, j);
                cells[id].alive = random ? Math.random() > .5 ? true : false : false;
            }
        }

        return cells;
    },
    _handleStartClick: function () {
        let self = this;
        let interval = setInterval(function () {
            self._runGeneration();
        }, 0);

        this.setState({ interval: interval });
    },
    _handleStopClick: function () {
        clearInterval(this.state.interval);
    },
    _handleClearClick: function () {
        this.setState({
            cells: this._populateCells(this.state.boardWidth, this.state.boardHeight),
            lastModified: [],
            generation: 0
        });
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

