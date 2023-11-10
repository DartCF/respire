import { configureStore, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: [],
    reducers: {
        addToCart(state, action) {
            state.push(action.payload);
        },
        removeFromCart(state, action) {
            state.splice(action.payload, 1);

        },
        clearCart(state, action) {
            return [];
        }
    }
});

const transformSlice = createSlice({
    name: 'transform',
    initialState: false,
    reducers: {
        setTransform(state, action) {
            return action;
        }
    }
})

const searchFlagSlice = createSlice({
    name: 'searchFlag',
    initialState: false,
    reducers: {
        setSearchFlag(state) {
            return true;
        }
    }
})

const searchResultSlice = createSlice({
    name: 'searchResults',
    initialState: {},
    reducers: {
        initSearchResults(state, action) {
            return action.payload;
        },
        setSearchResults(state, action) {
            let newState = state
            return {
                ...newState,
                [action.payload['module']]: action.payload['value']
            };
        }
    }
})

const selectedIdsSlice = createSlice({
    name: 'selectedIds',
    initialState: [],
    reducers: {
        clearSelectedIds(state, action) {
            return [];
        },
        removeId(state, action) {
            let newState = state.filter((id) => {
                return id !== action.payload
            })

            return newState;
        },
        addSelectedId(state, action) {
            state.push(action.payload);
        },
    }
})

const configSlice = createSlice({
    name: 'config',
    initialState: [],
    reducers: {
        setConfig(state, action) {
            return action.payload;
        },
        updateOptions(state, action) {
            let newState = state.map((input) => {
                if (input['searchField'] === action.payload['key']) {
                    return {
                        ...input,
                        args: {
                            ...input['args'],
                            options: action.payload['opts']
                        }
                    }
                }
                return input;
            });
            return newState;

        }
    }
})

const modulesSlice = createSlice({
    name: 'modules',
    initialState: { active: '', modules: [] },
    reducers: {
        setModules(state, action) {
            let newState = state
            newState['modules'] = action.payload
            return newState;
        },
        setActiveModule(state, action) {
            let newState = state
            newState['active'] = action.payload

            return newState;
        }
    }
})

const search = createSlice({
    name: 'search',
    initialState: {},
    reducers: {
        addField(state, action) {
            let newState = state
            newState[action.payload['key']] = action.payload['value']
            return newState;
        },
        setField(state, action) {
            let newState = state
            // console.log(action.payload)
            return {
                ...newState,
                [action.payload['key']]: action.payload['value']
            }
        }
    }
})

const loadingSlice = createSlice({
    name: 'loading',
    initialState: false,
    reducers: {
        setLoading(state, action) {
            return action.payload;
        }
    }
})

const processingSlice = createSlice({
    name: 'processing',
    initialState: {},
    reducers: {
        setProcessing(state, action) {
            return action.payload;
        },
        incrementProcessing(state, action) {
            let newState = state
            newState[action.payload] += 1
            return newState;
        }
    }
})

const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        loading: loadingSlice.reducer,
        searchFlag: searchFlagSlice.reducer,
        searchResults: searchResultSlice.reducer,
        config: configSlice.reducer,
        modules: modulesSlice.reducer,
        search: search.reducer,
        transform: transformSlice.reducer,
        processing: processingSlice.reducer,
        selectedIds: selectedIdsSlice.reducer
    }
});

export { store };
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const { initSearchResults, setSearchResults } = searchResultSlice.actions;
export const { setSearchFlag } = searchFlagSlice.actions;
export const { setConfig, updateOptions, processConfig } = configSlice.actions;
export const { setModules, setActiveModule } = modulesSlice.actions;
export const { addField, setField } = search.actions;
export const { setTransform } = transformSlice.actions;
export const { setLoading } = loadingSlice.actions;
export const { setProcessing, incrementProcessing } = processingSlice.actions;
export const { addSelectedId, removeId, clearSelectedIds } = selectedIdsSlice.actions;