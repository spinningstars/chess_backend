// const WebSocket = require("ws");

class Game {
  constructor(player1, player2,room,mode,state) {
    this.player1 = player1;
    this.room=room;
    this.mode=mode;
    this.state=state;
    this.player2 = player2;
    this.startTime = new Date();
    this.moveCount = 0;

    this.player1.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          room:room,
          color: "white",
          turns:0,
          mode:mode,
          state:state
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          room:room,
          color: "black",
          turns:0,
          mode:mode,
          state:state
        },
      })
    );
    // this.player2.send(
    //   JSON.stringify({
    //     type: "updateData",
    //     state: this.state,
    //   })
    // );

    // this.player1.send(
    //   JSON.stringify({
    //     type: "updateData",
    //     state: this.state,
    //   })
    // );

  }
  // changemode(socket ,selectMode){
  //   this.mode=selectMode;
  //   this.player1.send(JSON.stringify({
  //     type:"selectedChange",
  //     room:this.room,
  //     selectedIndex:this.mode,
  //   }))
  //   this.player2.send(JSON.stringify({
  //     type:"selectedChange",
  //     room:this.room,
  //     selectedIndex:this.mode,
  //   }))
  // }
  gameOver(winner){
    try{
      this.player1.send(JSON.stringify({
        type:"gameOver",
        winner:winner
      }))
      this.player2.send(JSON.stringify({
        type:"gameOver",
        winner:winner
      }))
    }catch(e){
      console.log(e)
    }
  }
  makeMoves(socket, state) {
    // Validate the type of move using zod

    try {
      this.moveCount++;
      if(this.player2!==socket){

        this.player2.send(
          JSON.stringify({
            type: "updateData",
            state: state,
          })
        );
        this.player2.send(
            JSON.stringify({
                type:"turnUpdate",

            })
        )   
      }
      if(this.player1!==socket){

        this.player1.send(
          JSON.stringify({
            type: "updateData",
            state: state,
          })
        );
        this.player1.send(
            JSON.stringify({
                type:"turnUpdate",
            })
        )
      }
      
    } catch (e) {
      console.log(e);
      return;
    }

    // if (isGameOver()) {
    //     // Send the game over message to both players
    //     this.player1.emit(JSON.stringify({
    //         type: GAME_OVER,
    //         payload: {
    //             winner: this.board.turn() === "w" ? "black" : "white"
    //         }
    //     }));
    //     this.player2.emit(JSON.stringify({
    //         type: GAME_OVER,
    //         payload: {
    //             winner: this.board.turn() === "w" ? "black" : "white"
    //         }
    //     }));
    // }
  }

  
}

module.exports = { Game };
