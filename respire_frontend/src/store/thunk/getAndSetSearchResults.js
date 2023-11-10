import axios from "axios"
import { setSearchResults } from ".."
import { setTransform } from ".."
import { setSearchFlag } from ".."

function getAndSetSearchResults(){
    return function(dispatch, getState){
        const query_body = JSON.stringify(selectSearch(getState()))
        const active_module = selectActiveModule(getState())
        axios.post(
            active_module['module_api'].concat("studies/searchMetadata"),
            query_body,
            { headers: {'Content-Type': 'application/json'} }
        ).then((res) => {
            dispatch(setSearchResults({module: active_module.module_name, value: res.data}))
            dispatch(setSearchFlag())
            dispatch(setTransform(true))
        }).catch((error) => {
            // eslint-disable-next-line
            console.error(error)
        })

    }
}

function selectSearch(state){
    return state.search
}
function selectActiveModule(state){
    return state.modules.active
}

export { getAndSetSearchResults }