var Cell = React.createClass({
    getInitialState: function () {
        return {
            alive: false,
            neighors: []
        };
    },
    render: function () {
        return (<td></td>);
    }
});

var Row = function (props) {
    var cells = [];

    for (var i = 1; i <= props.cols; i++) {
        cells.push(<Cell key={props.cols + " " + i} x={props.cols} y={i}/>);
    }

    return (<tr>{cells}</tr>);
};

var Board = React.createClass({
    getInitialState: function(){
        return {
            width: 100,
            height: 150
        };
    },
    render: function(){
        var rows = [];

        for (var i = 1; i <= this.state.height; i++){
            rows.push(<Row key={i} cols={this.state.width}/>);
        }

        return (<table><tbody>{rows}</tbody></table>);
    },
    _setBoardSize: function(){}
}); 

ReactDOM.render(<Board/>, document.getElementById('game'));