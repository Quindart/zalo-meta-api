
let messages = [];
let lastId = 1;
async function onSocketControllerTesting(app,appSocket){
    //router messages
    app.get("/messages", (req, res) => {
    const messages = listMessages();
    res.json(messages);
    });

    app.post("/messages", (req, res) => {
    const message = createMessage(req.body);
     appSocket.io.on("connection", (socket) => {
        socket.on("send-message",(mess)=>{
       console.log("💲💲💲 ~ SocketService ~ socket.on ~ mess:", mess)
       appSocket.io.emit("receive_message", {mess});
      })
    });
    res.json(message);
    });
}
function getmessageWithAuthor(message) {
  return { ...message, author: findUserById(message.authorId) };
}

function createMessage(params) {
  const message = {
    id: lastId++,
    body: params.body,
    authorId: params.authorId,
    insertedAt: new Date().toISOString(),
  };

  messages.push(message);

  const messageWithAuthor = getmessageWithAuthor(message);
  return messageWithAuthor;
}

function listMessages() {
  return messages.map((message) => getmessageWithAuthor(message));
}

const users = [
    {
      _id:  "6576b6ef0b84781a9078a1c8",
      userName: "wang",
      password: "wang",
      email: "wang@gmail.com",
      name: "wang",
      role: "admin",
      isActive: true,
      avatar: "https://png.pngtree.com/png-vector/20191122/ourlarge/pngtree-beautiful-admin-roles-glyph-vector-icon-png-image_2002847.jpg"
    },
  ];
  
  function findUserById(userId) {
    return users.find((user) => user._id == userId);
  }
  
export default onSocketControllerTesting