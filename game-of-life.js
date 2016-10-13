let React = require('react');
let ReactDOM = require('react-dom');

var Cell = React.createClass({
    getInitialState: function () {
        return {
            alive: false,
            neighborsAlive: 0 
        };
    },
    render: function () {
        return (
            <td 
                onClick={this._toggleAlive}
                className={this.state.alive ? "alive" : "dead"}
            ></td>);
    },
    _toggleAlive: function(){
        this.setState({alive: !this.state.alive});
    }
});

var Row = function (props) {
    var cells = [];

    for (var i = 1; i <= props.cols; i++) {
        cells.push(<Cell key={createId(props.cols, i)} x={props.cols} y={i}/>);
    }

    return (<tr>{cells}</tr>);
};

var Board = function (props) {
        var rows = [];

        for (var i = 1; i <= props.boardHeight; i++) {
            rows.push(<Row key={i} cols={props.boardWidth}/>);
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
                <label htmlFor="boardHeight">Height</label>
                <input 
                    id="boardHeight" 
                    value={this.state.boardHeight} 
                    type="text"
                    onChange={this._onHeightInput}
                />
                <label htmlFor="boardWidth">Width</label>
                <input 
                    id="boardWidth" 
                    value={this.state.boardWidth} 
                    type="text"
                    onChange={this._onWidthInput}
                />
                <button type="submit">submit</button>
            </form>
        );
    },
    _onWidthInput: function(e){
        if(typeof e.target.value === "string"){
            this.setState({boardWidth: e.target.value});
        }
    },
    _onHeightInput: function(e){
        if(typeof e.target.value === "string"){
            this.setState({boardHeight: e.target.value});
        }
    },
    _onSubmit: function(e){
        e.preventDefault();

        this.props.onBoardSizeChange({
            boardHeight: this.state.boardHeight,
            boardWidth: this.state.boardWidth
        });
    }
});

var Game = React.createClass({
    getInitialState: function () {
        return {
            boardHeight: 20,
            boardWidth: 20
        };
    },
    render: function () {
        return (
            <div>
                <Board 
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                />
                <Form 
                    onBoardSizeChange={this._updateBoard}
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                />
            </div>
        );
    },
    _updateBoard: function(boardSize){
        this.setState({
            boardWidth: boardSize.boardWidth,
            boardHeight: boardSize.boardHeight
        });
    }
});

function createId(x, y){
    return .5*(x + y)*(x + y + 1) + y;
}


ReactDOM.render(<Game/>, document.getElementById('game'));