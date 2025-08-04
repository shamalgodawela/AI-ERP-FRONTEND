import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filteredProducts:[]

}

const filterSclice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_PRODUCTS(state,action){
        const {products, search}=action.payload;
        const tempProducts=products.filter((product)=> product.name.toLowerCase().includes(search.toLowerCase()) ||  product.category.toLowerCase().includes(search.toLowerCase()))

        state.filteredProducts=tempProducts


    }
  }
});

export const {FILTER_PRODUCTS} = filterSclice.actions

export const selectFilteredProducts =(state)=>state.filter.filteredProducts;

export default filterSclice.reducer