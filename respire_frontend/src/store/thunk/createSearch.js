import { addField } from ".."

function createSearchState() {
    return (dispatch, getState) => {
        const inputs = selectInputs(getState())
        inputs.forEach((input) => {
            dispatch(addField({key: input['searchField'], value: ""}))
        })
    }
}

function selectInputs(state) {
    // console.log(state.config)
    return state.config
}

export default createSearchState