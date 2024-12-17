import { createSlice } from '@reduxjs/toolkit';

// Safe retrieval and parsing of "name" from localStorage
let name = "";
try {
  const storedName = localStorage.getItem("name");
  name = storedName ? JSON.parse(storedName) : "";
} catch (error) {
  console.error("Error parsing name from localStorage:", error);
  name = ""; // Fallback to default value
}

const initialState = {
  isLoggedIn: false,
  name: name,
  user: {
    name: "",
    email: "",
  },
};

const authSliceExe = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      const profile = action.payload;
      state.user.name = profile.name;
      state.user.email = profile.email;
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSliceExe.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSliceExe.reducer;
