
// potentially revisit to farm out logic in handleModuleSelect
// not currently being used
import { setActiveModule } from "..";
import fetchAndUpdateConfig from "./getAndSetActiveConfig";

function setModule (module_name) {
    return (dispatch, getState) => {

        const modules = selectModules(getState())
        const selectedModule = modules['modules'].find(
            (module) => module['module_name'] === module_name
          );
        
          if (selectedModule) {
            dispatch(setActiveModule(selectedModule));
            dispatch(fetchAndUpdateConfig())
          }
    }
}

function selectModules(state){
    return state.modules
}
export default setModule