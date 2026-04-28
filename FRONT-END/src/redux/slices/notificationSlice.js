import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const baseURL =
  "http://localhost:3000";

// ================= TOKEN =================
const getToken = () =>
  localStorage.getItem("jwt");

// ================= FETCH =================
export const fetchNotifications =
  createAsyncThunk(
    "notifications/fetch",
    async (userId) => {
      console.log("Fetching notifications for user:", userId);
      const res =
        await axios.get(
          `${baseURL}/api/notification/${userId}`,
          {
            headers: {
             
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
console.log(res.data);
      return res.data;
    }
  );

// ================= MARK ONE READ =================
export const markAsRead =
  createAsyncThunk(
    "notifications/readOne",
    async (id) => {
      
      await axios.patch(
        `${baseURL}/api/notification/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      return id;
    }
  );

// ================= MARK ALL READ =================
export const markAllRead =
  createAsyncThunk(
    "notifications/readAll",
    async (userId) => {
      await axios.patch(
        `${baseURL}/api/notification/read-all/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      return userId;
    }
  );

const notificationSlice =
  createSlice({
    name: "notifications",

    initialState: {
      notifications: [],
      loading: false,
    },

    reducers: {
      // Live Socket.io notification
      addNotification:
        (state, action) => {
          state.notifications.unshift(
            action.payload
          );
        },
    },

    extraReducers: (
      builder
    ) => {
      builder

        // Fetch
        .addCase(
          fetchNotifications.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchNotifications.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.notifications =
              action.payload;
          }
        )

        .addCase(
          fetchNotifications.rejected,
          (state) => {
            state.loading = false;
          }
        )

        // Mark One
        .addCase(
          markAsRead.fulfilled,
          (
            state,
            action
          ) => {
            state.notifications =
              state.notifications.map(
                (item) =>
                  item._id ===
                  action.payload
                    ? {
                        ...item,
                        read: true,
                      }
                    : item
              );
          }
        )

        // Mark All
        .addCase(
          markAllRead.fulfilled,
          (state) => {
            state.notifications =
              state.notifications.map(
                (item) => ({
                  ...item,
                  read: true,
                })
              );
          }
        );
    },
  });

export const {
  addNotification,
} = notificationSlice.actions;

export default
  notificationSlice.reducer;