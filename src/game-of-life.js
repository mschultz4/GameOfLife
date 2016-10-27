"use strict";

const Tree = {
    type: "tree",
    display: 't',
    weapon: null,
    health: null,
    block: true
};

const Empty = {
    type: 'empty',
    display: '',
    weapon: null,
    health: null,
    block: false
};

let Game = React.createClass({
    getInitialState: function () {
        let player = {
            type: 'player',
            display: 'P',
            weapon: { name: 'sword', strength: 1 },
            health: 3,
            level: 1,
            block: true,
            currentPosition: { y: 10, x: 15 }
        }

        return {
            board: this._generateBoard(25, 25, player),
            player: player
        };
    },
    componentWillMount: function () {
        let self = this;
        document.addEventListener('keydown', function (e) {
            self._move(e.keyCode);
        });
    },
    componentWillUnmount: function () {
        document.removeEventListener('keydown');
    },
    render: function () {
        return (
            <div>
                <Board board={this.state.board}/>
                <Stats
                    health={this.state.player.health}
                    level={this.state.player.level}
                    weapon={this.state.player.weapon.name}
                    />
            </div>
        );

    },
    _move: function (keyCode) {
        let player = Object.assign({}, this.state.player),
            y = player.currentPosition.y,
            x = player.currentPosition.x,
            board = _.cloneDeep(this.state.board),
            interactions = [];

        switch (keyCode) {
            case 38:
                if (!this.state.board[y - 1][x].block) {
                    board[y][x] = Empty;
                    board[y - 1][x] = player;
                    y -= 1;
                }
                break;
            case 40:
                if (!this.state.board[y + 1][x].block) {
                    board[y][x] = Empty;
                    board[y + 1][x] = player;
                    y += 1;
                }
                break;
            case 39:
                if (!this.state.board[y][x + 1].block) {
                    board[y][x] = Empty;
                    board[y][x + 1] = player;
                    x += 1;
                }
                break;
            case 37:
                if (!this.state.board[y][x - 1].block) {
                    board[y][x] = Empty;
                    board[y][x - 1] = player;
                    x -= 1;
                }
                break;

        }

        player.currentPosition = { y: y, x: x };

        interactions.push(this.state.board[y][x]);
        getSurroundingPositions(player.currentPosition)
            .forEach(pos => {
                if (this.state.board[pos.y][pos.x].type === 'monster') {
                    interactions.push(this.state.board[pos.y][pos.x]);
                }
            });

        interactions.forEach(obj => {
            switch (obj.type) {
                case 'monster':
                    console.log('holy cow');
                    break;
                case 'heart':
                    player.health = player.health < 10 ? player.health + 1 : player.health;
                    break;
            }
        });


        this.setState({
            player: player,
            board: board
        });

    },
    _generateBoard: function (height, width, player) {

        let board = [];

        for (let i = 0; i < height; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                let cell;

                if (i === 0 || j === 0 || i === (height - 1) || j === (width - 1)) {
                    cell = Tree;
                } else {
                    cell = createRandomCell();
                }

                row.push(cell);
            }
            board.push(row);
        }

        board[player.currentPosition.y][player.currentPosition.x] = player;

        return board;
    }
});

let Board = function (props) {
    let rows = [];
    props.board.forEach(function (row, index) {
        let cells = [];
        row.forEach(function (cell, index) {
            cells.push(<Cell key={index} display={cell.display}/>);
        });
        rows.push(<tr key={index}>{cells}</tr>);
    });
    return (<table className="game-board"><tbody>{rows}</tbody></table>);
}

let Cell = function (props) {
    return (<td className={props.display}>{props.display}</td>);
};

let Stats = function (props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>level</th>
                    <th>health</th>
                    <th>weapon</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{props.level}</td>
                    <td>{props.health}</td>
                    <td>{props.weapon}</td>
                </tr>
            </tbody>
        </table>)
};

ReactDOM.render(<Game/>, document.getElementById('game'));


function createRandomCell() {
    let i = Math.ceil(Math.random() * 100);

    if (i < 5) {
        return createMonster();
    }

    if (i >= 10 && i < 20) {
        return Tree
    }

    if (i >= 20 && i < 40) {
        return createItem();
    }

    return Empty;
}

function createMonster() {
    return {
        type: "monster",
        display: 'm',
        weapon: { name: 'claws', strength: Math.ceil(Math.random() * 10) },
        health: 10,
        block: true
    };
}

function createItem() {
    let i = Math.ceil(Math.random() * 100),
        type = '',
        display = '';

    if (i < 5) {
        type = 'heart';
        display = 'h'
    } else if (i >= 10 && i < 20) {
        type = 'axe';
        display = 'a';
    } else if (i >= 20 && i < 40) {
        type = 'bat';
        display = 'b';
    } else {
        type = 'zebra';
        display = 'z';
    }

    return {
        type: type,
        display: display,
        weapon: null,
        health: null,
        block: false
    };
}

function getSurroundingPositions(pos) {
    let positions = [];

    positions.push({ x: pos.x, y: pos.y + 1 });
    positions.push({ x: pos.x, y: pos.y - 1 });
    positions.push({ x: pos.x + 1, y: pos.y });
    positions.push({ x: pos.x - 1, y: pos.y });

    return positions;
}

function fight(player, monster){
    while(player.health > 0 && monster.health > 0){
        monster.health -= Math.ceil(Math.random() * player.weapon.strength);

        if(monster.health > 0){
            player.health -= Math.ceil(Math.random() * monster.weapon.strength);
        }
    }

    return [player, monster];
}