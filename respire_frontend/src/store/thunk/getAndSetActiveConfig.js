import axios from "axios";
import { setConfig } from "..";
import setOptions from './updateInputs'

function fetchAndUpdateConfig() {
    return (dispatch, getState) => {
        const active_module = selectActiveModule(getState())
        axios.get(
            active_module['module_api'].concat("admin/inputs")
        ).then((res) => {
            dispatch(setConfig(res.data['inputs']));
            dispatch(setOptions())
        })
    }
}

function selectActiveModule(state) {
    return state.modules.active
}

export default fetchAndUpdateConfig