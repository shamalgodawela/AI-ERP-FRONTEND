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
        const searchValue = (search ?? "").toString().toLowerCase();
        const tempProducts=products.filter((product)=> {
          const name = (product?.name ?? "").toString().toLowerCase();
          const category = (product?.category ?? "").toString().toLowerCase();
          const description = (product?.description ?? "").toString().toLowerCase();
          return (
            name.includes(searchValue) ||
            category.includes(searchValue) ||
            description.includes(searchValue)
          );
        })

        state.filteredProducts=tempProducts


    }
  }
});

export const {FILTER_PRODUCTS} = filterSclice.actions

export const selectFilteredProducts =(state)=>state.filter.filteredProducts;

export default filterSclice.reducer