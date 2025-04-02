import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  selectedVideo: null;
}
const initialState: ModalState = {
  isOpen: false,
  selectedVideo: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.selectedVideo = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.selectedVideo = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
