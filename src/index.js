import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick} style={props.winningSquare ? {backgroundColor: '#ccc'} : null}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {

    renderSquare(i) {
		let hightlightedSquare = [];
		if (this.props.hightlight){
			hightlightedSquare = this.props.hightlight;
		}
        return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				winningSquare ={hightlightedSquare.includes(i)}
			/>
		);
    }

    render() {
		let boardRender = [];
		for (let row = 0; row < 3; row++){
			let boardRow = [];
			for (let col = 0; col < 3; col++){
				let pos = (row * 3) + col;
				boardRow.push(
					<span key={pos}>{
						this.renderSquare(pos)
					}</span>
				);
			}
			boardRender.push(<div className="board-row" key={row}>{boardRow}</div> )
		}
        return (
            <div>{
				boardRender
			}</div>
        );
    }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				position: -1,
			}],
			stepNumber: 0,
			xIsNext: true,
			ascending: true,
		};
	}

	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]){
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				position: i
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		})
	}

	sortOrderClick(){
		this.setState({
			ascending: !this.state.ascending,
	})
	}
    render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winLines = calculateWinner(current.squares);


		const moves = history.map((step,move) => {
			const mark = history[move].squares[history[move].position]
			const pos = history[move].position
			const desc = move ?
				'Move #' + move + ", Mark " + mark + " at position " + pos
				: 'Go to game start';
			return (

				<li key={move}>
					<button style={this.state.stepNumber === move ? {fontWeight: "bold"} : null} onClick={() => {
						this.jumpTo(move);

					}}>{desc}</button>
				</li>
			)
		});

		let status;
		if (winLines) {
			status = 'Winner ' + current.squares[winLines[0]];
		}else if(this.state.stepNumber === 9){
			status = 'Draw';
		}else{
			status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
						hightlight={winLines}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => this.sortOrderClick()}
							style={this.state.ascending ? {backgroundColor: "#fff"} : {backgroundColor: "#ccc"}}>
						Descending Order Toggle</button>
					<ol>{this.state.ascending? moves : moves.reverse()}</ol>
				</div>
			</div>
		);
	}
}

// ========================================
//This is to render the component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return lines[i];
		}
	}
	return null;
}
