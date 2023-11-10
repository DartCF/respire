import axios from "axios";
import { updateOptions } from "..";

function setOptions(){
    return (dispatch, getState) => {
        const inputs = selectInputs(getState())

        inputs.forEach((input) => {
            // if "source" is  present in the keys of "args" for "input", then get the options from the source
            if (Object.keys(input['args']).includes('source')) {
              axios.get(input['args']['source']
              ).then((res) => {
                dispatch(
                  updateOptions({ opts: res.data, key: input['searchField'] })
                )
              }).catch((error) => {
                // eslint-disable-next-line
                console.error(error)
              })
            }
          })
    }
}

function selectInputs(state){
    return state.config
}

export default setOptions