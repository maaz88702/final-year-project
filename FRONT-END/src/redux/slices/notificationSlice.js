import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:3000";
const token = localStorage.getItem("jwt");

export const fetchNotifications =
  createAsyncThunk(
    "notifications/fetch",
    async (userId) => {
      const res = await axios.get(
        `${baseURL}/api/notification/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    }
  );

export const markAsReadNotification =
  createAsyncThunk(
    "notifications/readOne",
    async (id) => {
      await axios.patch(
        `${baseURL}/api/notification/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return id;
    }
  );

export const markAllReadNotification =
  createAsyncThunk(
    "notifications/readAll",
    async (userId) => {
      await axios.patch(
        `${baseURL}/api/notification/read-all/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return userId;
    }
  );

const notificationSlice = createSlice({
  name: "notifications",

  initialState: {
    notifications: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        fetchNotifications.fulfilled,
        (state, action) => {
          state.loading = false;
          state.notifications =
            action.payload;
        }
      )

      .addCase(
        markAsReadNotification.fulfilled,
        (state, action) => {
          state.notifications =
            state.notifications.map(
              (item) =>
                item._id === action.payload
                  ? {
                      ...item,
                      read: true,
                    }
                  : item
            );
        }
      )

      .addCase(
        markAllReadNotification.fulfilled,
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

export default notificationSlice.reducer;