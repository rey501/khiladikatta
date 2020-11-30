// Platers and Piece position of that player

const players = {
    "player0": {
        no: 0,
        piece: [
            0,
            1,
            18,
            45
        ]
    },
    "player1": {
        no: 1,
        piece: [
            1,
            6,
            18,
            45
        ]
    },
    "player3": {
        no: 2,
        piece: [
            1,
            6,
            18,
            45
        ]
    },
    "player4": {
        no: 3,
        piece: [
            1,
            6,
            18,
            45
        ]
    }
}


// Find the piecePosForCurrentPlayer between 2 Cookri

const findTheNextBestRandomNoForBot = []

const currentPlayer = "player1"

const currentPlayerData = players[currentPlayer]
let currentPlayerPiecePos = 1; // just for log

// Loop through all current player piece
for (let currentPiecePosition of currentPlayerData.piece) {
    currentPlayerPiecePos++;
    // if currentPlayer's position are somewhere when whatever number come it can't kill anyone then ignore it.
    if ([0, 52, 53, 54, 55, 56, 57].includes(currentPiecePosition))
        continue;

    // Loop through other players
    for (let playerKey of Object.keys(players).filter(k => k != currentPlayer)) {
        // Find the piecePosForCurrentPlayer between other players pieces
        let comparePlayerData = players[playerKey]
        let piecePos = 0; // Just for logs

        // Loop through all other player's piece
        for (let comparePiecePosition of comparePlayerData.piece) {
            piecePos++;

            // If other's player piece are in safe zone ignore it
            if ([0, 1, 9, 14, 22, 27, 35, 40, 48, 52, 53, 54, 55, 56, 57].includes(comparePiecePosition))
                continue;

            // Important :  Find What is other's player piece's position is for current player.Ex. if player 2's piece is in 8 then for player'1 that piece is in 21
            let piecePosForCurrentPlayer = (13 * (comparePlayerData.no - currentPlayerData.no)) + comparePiecePosition;
            // If the answer is more than 52 then minus it from 53. Ex. Player3's pos is 18 in that above formula will give answer 57. it's not possible answer should be 5. So 57-52 = 5
            if (piecePosForCurrentPlayer > 52) {
                piecePosForCurrentPlayer -= 52
            }
            // Calculate the distance between currentPlayer's price and the oponent's player peice
            let distanceFromCurrentPlayerPiece = piecePosForCurrentPlayer - currentPiecePosition;
            //If it's between 0to 7 then save it in findTheNextBestRandomNoForBot
            if (distanceFromCurrentPlayerPiece > 0 && distanceFromCurrentPlayerPiece < 7) {
                findTheNextBestRandomNoForBot.push(distanceFromCurrentPlayerPiece)
                console.log("nextLineIsKill")
            }
            //Log distance between 2 position
            console.log(`${playerKey}'s piece ${piecePos}(${comparePiecePosition}) is ${distanceFromCurrentPlayerPiece} moves far from ${currentPlayer}'s piece ${currentPlayerPiecePos} (${currentPiecePosition})`)

        }
    }


}
// Final array that contain the number for robot. Generate next random number from this array and it will kill any 1 piece
console.log({ findTheNextBestRandomNoForBot })