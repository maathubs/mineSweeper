import React from 'react';
import Cell from './Cell';
import axios from '../Axios';

export default class Board extends React.Component {
    state = {
        boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
        gameWon: false,
        mineCount: this.props.mines,
        isClicked:true,
        
    };
    
    componentDidMount(){
        console.log("this.props",this.props)
        console.log("Newstate in component did mount ",JSON.parse(localStorage.getItem("newState")))
        let user=JSON.parse(localStorage.getItem("user"))
        // console.log("user",user[0].log.length);
        if(this.props.isClicked){
            this.setState({
                isClicked:true
            })
        }
        if(user[0].log){
            // if(this.props.isClicked){
            //     this.setState({
            //         isClicked:true
            //     })
            // }
            let mineCount;
            if(user[0].log.length===12){
               mineCount=20;
            }
            else if(user[0].log.length===16){
                mineCount=40;
            }
            else{
                mineCount=10;
            }
            console.log(mineCount)
            this.setState({
                boardData:user[0].log,
                mineCount:mineCount,
                isClicked:true
            })      
        }
        else{
            this.setState({
                boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
                mineCount:this.props.mines
            })
        }
    }
    // get mines
    getMines(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Flags
    getFlags(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Hidden cells
    getHidden(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (!dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get random number given a dimension
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    // Gets initial board data
    initBoardData(height, width, mines) {
        let data = [];
        console.log("this.props.userDetails...",this.props.userDetails)
        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);
        console.log("data.................",data);
        return data;
    }

    // plant mines on the board
    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(width);
            randomy = this.getRandomNumber(height);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }
        return (data);
    }

    // get number of neighbouring mines for each board cell
    getNeighbours(data, height, width) {
        let updatedData = data, index = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }

        return (updatedData);
    };

    // looks for neighbouring cells and returns them
    traverseBoard(x, y, data) {
        const el = [];

        //up
        if (x > 0) {
            el.push(data[x - 1][y]);
        }

        //down
        if (x < this.props.height - 1) {
            el.push(data[x + 1][y]);
        }

        //left
        if (y > 0) {
            el.push(data[x][y - 1]);
        }

        //right
        if (y < this.props.width - 1) {
            el.push(data[x][y + 1]);
        }

        // top left
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }

        // top right
        if (x > 0 && y < this.props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }

        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }

        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }

        return el;
    }

    // reveals the whole board
    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }

    /* reveal logic for empty cell */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }

    // Handle User Events

    handleCellClick(x, y) {
        if(this.state.isClicked){
        let win = false;
         console.log(this.props)
        // check if revealed. return if true.
        if (this.state.boardData[x][y].isRevealed) return null;

        // check if mine. game over if true
        if (this.state.boardData[x][y].isMine) {
            this.revealBoard();
            let alert="game Over";
            console.log(alert);
            // alert("game over");
            this.setState({
                status:"failed"
            })
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if (this.getHidden(updatedData).length === this.props.mines) {
            win = true;
            this.revealBoard();
            alert("You Win");
            // this.setState({
            //     status:"win"
            // })
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
            gameWon: win,
        });
        console.log("this.state.boardData in onclick",this.state.status)
        axios.post('http://localhost:8000/api/log', {
            userId:this.props.userDetails,
            state:this.state.boardData
        }).then((response)=>{
            let user=JSON.parse(localStorage.getItem("user"))
            user[0].log=this.state.boardData;
            localStorage.setItem("user",JSON.stringify(user))
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;
        let win = false;

        // check if already revealed
        if (updatedData[x][y].isRevealed) return;

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines++;
        } else {
            updatedData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            win = (JSON.stringify(mineArray) === JSON.stringify(FlagArray));
            if (win) {
                this.revealBoard();
                alert("You Win");
            }
        }
        this.setState({
            boardData: updatedData, 
            mineCount: mines,
            gameWon: win,
        });
        axios.post('http://localhost:8000/api/log', {
            userId:this.props.userDetails,
            state:this.state.boardData
        }).then((response)=>{
            let user=JSON.parse(localStorage.getItem("user"))
            user[0].log=this.state.boardData;
            localStorage.setItem("user",JSON.stringify(user))
        })
        .catch(function (error) {
            console.log(error);
        }); 
    }
    //newgame()
    newGame=()=>{
        let boardData= this.initBoardData(this.props.height, this.props.width, this.props.mines)
        console.log("this.props",this.props);
        axios.post('http://localhost:8000/api/log', {
            userId:this.props.userDetails,
            state:boardData
        }).then((response)=>{
            let user=JSON.parse(localStorage.getItem("user"))
            user[0].log=null;
            localStorage.setItem("user",JSON.stringify(user))
            this.setState({
                boardData:boardData,
                mineCount: this.props.mines,
                // isClicked:false
            })
        })
        .catch(function (error) {
            console.log(error);
        }); 
    }
    renderBoard(data) {
        // console.log(this.state.status)
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
                            cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                            userId={this.props.userDetails}
                            boardData={this.state.boardData}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>
                );
            })
        });

    }
    // Component methods
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            this.setState({
                boardData: this.initBoardData(nextProps.height, nextProps.width, nextProps.mines),
                gameWon: false,
                mineCount: nextProps.mines,
            });
        }
    }
    render() {
        console.log("this.state.status",this.state.status)
        return (
            <div className="board">
                <div className="game-info">
                    <span className="info">Mines: {this.state.mineCount}<button className="newGame" onClick={this.newGame}>New game</button></span><br />
                    <span className="status">{this.state.gameWon ? "You Win" : ""}</span>
                    <span className="status">{this.state.status ? "Game over" : ""}</span>
                </div>
                <div className="gameBoard">
                {
                    this.renderBoard(this.state.boardData)
                }
                </div>
            </div>
        );
    }
}