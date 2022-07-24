import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
	items: [],
	status: 'loading',
	itemsPerPage: 8,
	pageCount: 1,
}

export const fetchPizzas = createAsyncThunk(
	'pizzas/fetchPizzas',
	async ({ urlParams, page }) => {
		const _apiBase = 'https://62d50136d4406e523550b12e.mockapi.io';
		const allItems = await axios.get(`${_apiBase}/items/?${urlParams}`);
		const res = await axios.get(`${_apiBase}/items/?${urlParams}${page}`);

		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		})

		return [allItems.data, res.data];
	}
)


export const pizzasSlice = createSlice({
	name: 'pizzas',
	initialState,
	extraReducers: {
		[fetchPizzas.pending]: (state) => {
			state.status = 'loading';
		},
		[fetchPizzas.fulfilled]: (state, action) => {
			state.pageCount = Math.ceil(action.payload[0].length / state.itemsPerPage);
			state.items = state.items = action.payload[1];
			state.status = 'success';
		},
		[fetchPizzas.rejected]: (state) => {
			state.status = 'error';
			state.items = [];
		},
	}
});

export const { setItems } = pizzasSlice.actions;

export default pizzasSlice.reducer;