// import { createSlice } from "@reduxjs/toolkit";

// const chatSlice = createSlice({
//   name: "chat",
//   initialState: {
//     chats: {},
//     currentChatId: null,
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     createNewChat: (state, action) => {
//       const { chatId, title } = action.payload;
//       state.chats[chatId] = {
//         id: chatId,
//         title,
//         messages:[],
//         lastUpdated: new Date().toISOString(),
//       };
//     },

//     addNewMessage:(state,action) =>{
//         const{chatId,content,role} = action.payload
//         state.chats[chatId].messages.push({content,role})
//     },

//     addMessages:(state,action)=>{
//         const {chatId,messages} = action.payload
//         state.chats[chatId].messages.push(...messages)
//     },

//     setChats: (state, action) => {
//       state.chats = action.payload;
//     },
//     setCurrentChatId: (state, action) => {
//       state.currentChatId = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     },
//   },
// });

// export const { setChats, setCurrentChatId, setLoading, setError,createNewChat,addNewMessage,addMessages } =
//   chatSlice.actions;
// export default chatSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },

  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;

      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },

    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;

      // ✅ ensure chat exists
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: "",
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }

      // ✅ ensure messages exists
      if (!state.chats[chatId].messages) {
        state.chats[chatId].messages = [];
      }

      state.chats[chatId].messages.push({ content, role });
    },

    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;

      // 🔴 safety logs (optional — remove later)
      console.log("chatId:", chatId);
      console.log("messages:", messages);

      // ✅ ensure chat exists
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: "",
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }

      // ✅ ensure messages array exists
      if (!state.chats[chatId].messages) {
        state.chats[chatId].messages = [];
      }

      // ✅ ensure incoming messages is array
      if (!Array.isArray(messages)) {
        console.error("❌ messages is not an array:", messages);
        return;
      }

      state.chats[chatId].messages.push(...messages);
    },

    setChats: (state, action) => {
      state.chats = action.payload || {};
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
} = chatSlice.actions;

export default chatSlice.reducer;