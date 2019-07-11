import React from 'react';
import './Home.css';
import Board from '../Board';

export default class Home extends React.Component {

    state = {
        level:"beginner",
        height: 8,
        width: 8,
        mines: 10,
        isClicked:false
    };
    
    handleGameStart = () => {
        let difficulty = document.querySelector("#level_select");
        console.log("this.props.location.state before",this.props.location.state)
        if (difficulty.value === "beginner") {
            this.setState({
                level:"beginner",
                height: 8,
                width: 8,
                mines: 10,
                isClicked:true
            });
        }
        if (difficulty.value === "intermediate") {
            this.setState({
                level:"intermediate",
                height: 12,
                width: 12,
                mines: 20,
                isClicked:true
            });
        }
        if (difficulty.value === "expert") {
            this.setState({
                level:"expert",
                height: 16,
                width: 16,
                mines: 40,
                isClicked:true
            });
        }
        console.log("this.props.location.state after",this.props.location.state)
    }

    render() {
       console.log("this.props.location.state",this.state)
        const { height, width, mines, level, isClicked } = this.state;
        return (
            <div className="game">
                <div className="game-info">
                    <div className="instructions">
                        <h4>Rules</h4>
                        <p>💣 You are presented with a board of squares. Some squares contain mines (bombs), others don't. If you click on a square containing a bomb, you lose. If you manage to click all the squares (without clicking on any bombs) or flag all the mines, you win.</p>
                        <p>💣 Clicking a square which doesn't have a bomb reveals the number of neighbouring squares containing bombs. Use this information plus some guess work to avoid the bombs.</p>
                        <p>💣 To open a square, point at the square and click on it. To mark a square you think is a bomb, point and right-click.</p>
                    </div>
                    <h4>Select a level and  click "start"</h4>
                    <span className="info">Level:
                        <select id="level_select">
                            <option value="beginner"> Beginner </option>
                            <option value="intermediate"> Intermediate </option>
                            <option value="expert"> Expert </option>
                        </select>
                    </span>   
                    <button className="startButton" onClick={this.handleGameStart}>Start</button>
                </div>

                <Board height={height} level={level} isClicked={isClicked} width={width} mines={mines} userDetails={this.props.location.state.userData[0].userId} userData={this.props.location.state.userData[0]} />
                
            </div>
        );
    }
}

