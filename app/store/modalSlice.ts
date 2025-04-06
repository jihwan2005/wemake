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
    openModal: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.selectedVideo = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.selectedVideo = null;
    },
    updateSelectedVideo: (state, action: PayloadAction<any>) => {
      state.selectedVideo = action.payload;
    },
  },
});

export const { openModal, closeModal, updateSelectedVideo } =
  modalSlice.actions;
export default modalSlice.reducer;
