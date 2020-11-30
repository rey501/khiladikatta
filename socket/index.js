const _ = require("lodash");
const uniqid = require("uniqid");
const {io} = require("../server");
const {	getUserInfo} = require("./utils/users");
//const {	placeBet,	addHistory} = require("./utils/game");

let liveRooms = {};
let pendingRooms = {};
let usersToRoom={};
//This variable used for repeat 6 in 2 times only
let repeat=0;
// roomId:{ users:{userid: { name: "sandip", balance: 156456, avtarId: 15 startTime:},startTime: }}};
// {uId:{users:{_id:{name:"sandip",balance:4555,avtarId:15}}}};

io.on("connection", (socket) => {
	console.log("Socketconnected");
	socket.on("join", async({token, roomPrice}) => {
	
		const user = await getUserInfo(token);
		if (!pendingRooms[roomPrice]) {
			let roomId = uniqid();
			socket.join(roomId);
			usersToRoom[user._id] = {
				socketId: socket.id,
				roomId,
				roomPrice
			};
			pendingRooms[roomPrice] = {
				roomId,
				price: roomPrice,
				users: {
					[user._id]: addPendingUsers(user,roomPrice)
				}
	  }
	  console.log("Pending",roomPrice,pendingRooms[roomPrice]);
	  sendPendingRoomData(roomId,roomPrice);
	
		} else {
			let roomId = pendingRooms[roomPrice].roomId
			usersToRoom[user._id] = {
				socketId: socket.id,
				roomId,
				roomPrice
			};
      socket.join(pendingRooms[roomPrice].roomId);      
      pendingRooms[roomPrice].users[user._id] = addPendingUsers(user,roomPrice);
      sendPendingRoomData(roomId,roomPrice);
			if (Object.keys(pendingRooms[roomPrice].users).length === 4) {
				liveRooms[roomId] = {
					users: _.cloneDeep(pendingRooms[roomPrice].users),
					roomPrice: roomPrice,
					currentTurn:0 
				}
				delete pendingRooms[roomPrice];
				startGame(roomId);
			}
		}


	});

	socket.on("changeTurn",({currentSeatNo,roomId,isReTurn})=>{
		console.log("dum dum");
		let random=findRandom();
		if(!isReTurn)
			currentSeatNo=currentSeatNo===3?0:currentSeatNo+=1;
		console.log("Current Cheat NO is:",currentSeatNo)
		io.in(roomId).emit("res",{data:{seatNo:currentSeatNo,diceNo:findRandom()},en:"turn",status:1})
		console.log("jaimin suthiyo....")
	})
	socket.on("rotateDice",({roomId})=>{
		io.in(roomId).emit("res",{data:"rotateDice",en:"rotateDice",status:1})
	})

	socket.on("move",({userId,roomId,pownNo,pownStep,isKill}) => {
		let random=findRandom()
		 

	});

	socket.on('leaveRoom',({roomId,userId,roomPrice}) => {
		//if user is available in pending room than delete otherwise its stay on live room
		if(userId!=undefined && roomPrice!=undefined && roomId!=undefined){
			if(pendingRooms[roomPrice]){
				if(pendingRooms[roomPrice].users[userId]!=undefined){
					delete pendingRooms[roomPrice].users[userId];
					delete usersToRoom[userId];
					return sendDesconnectUser(roomId, userId);
				}	
				if (liveRooms[roomId]){
					delete liveRooms[roomId].users[userId];
					delete usersToRoom[userId];
					return sendDesconnectUser(roomId, userId);
				}				
			}
			
		}		
	})


	socket.on("disconnect", ()=>{
		let userId ;
		let roomId ;
		let roomPrice;
		for(let user of Object.keys(usersToRoom))
		{ 
			if(socket.id===usersToRoom[user].socketId){
				userId=userId;
				roomId=usersToRoom[user].roomId;
				roomPrice=usersToRoom[user].roomPrice;
				break;
			}
		}
		//if user is available in pending room than delete otherwise its stay on live room
		if(userId!=undefined && roomPrice!=undefined && roomId!=undefined){
			if(pendingRooms[roomPrice]){
				if(pendingRooms[roomPrice].users[userId]!=undefined){
					delete pendingRooms[roomPrice].users[userId];
					delete usersToRoom[userId];
					return sendDesconnectUser(roomId, userId);
				}	
				if (liveRooms[roomId]){
					return sendDesconnectUser(roomId, userId);
				}				
			}			
		}		
	})
});
const findRandom=()=>{
 let random = Math.floor(Math.random() * 7)+1;
		random=random===7?6:random;
		repeat=random===6?repeat+=1:0;
		if(repeat===3){
			random=Math.floor(Math.random() *5)+1;
			repeat=0;
		}
		return random;
}

const startGame = (roomId) => {
	let seatNo=0;	
	io.in(roomId).emit("res",{data:{seatNo:0,diceNo:findRandom()},en:"turn",status:1})

}

const addPendingUsers = (user,roomPrice) => {
	console.log("addPendingRooms Call");
	let seatNo=-1;

	if(pendingRooms[roomPrice]){
		for (var i = 0; i < 5; i++) {
		  //is Seated check user available on this cheat or not
		  let isSeated = false;

		  for (const userId of Object.keys(pendingRooms[roomPrice].users)) {
			if (pendingRooms[roomPrice].users[userId].seatNo == i) {
			  console.log("is true ==", i);
			  isSeated = true;
			  break;
			}
		  }
		  console.log("is true outer for ==", i);
		  if (!isSeated) {
			seatNo = i;
			console.log("Assign user Seat Number =", seatNo, " === ", i);
			break;
		  }
		}
		console.log("New user Seat Number =", seatNo);
		if (seatNo === -1) {
		  seatNo = Object.keys(pendingRooms[roomPrice].users).length;
		}
	}
	if(seatNo===-1)
		seatNo =0
	return {
		name: user.name,
		profilePic: user.profilePic,
		avtarId: user.avtarId,
		seatNo,
		pawns:[0,0,0,0]

	}
}

const sendDesconnectUser=(roomId, userId)=>{
	return io.in(roomId).emit("res",{data:userId,en:"disconnect",status:1})
}
const sendPendingRoomData=(roomId,roomPrice)=>{	
  return io.in(roomId).emit("res",{data:pendingRooms[roomPrice],en:"join",status:1});
}
