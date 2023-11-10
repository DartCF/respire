import axios from 'axios'
import { setModules, setActiveModule, setConfig } from '..'
import fetchAndUpdateConfig from './getAndSetActiveConfig'
import createSearchState from './createSearch'
import { initSearchResults } from '..'

function getAndSetModules() {
  return (dispatch, getState) => {
    axios.get(
      // move to config file
      // process.env.REGISTRY_API_URL
      // 'https://respire-registry-dev.dartmouth.edu/listModules'
      'https://respire-registry.dartmouth.edu/listModules'
    ).then((res) => {
      dispatch(setModules(res.data));
      const modules = selectModules(getState())

      dispatch(setActiveModule(modules['modules'][0]))
      dispatch(initSearchResults(makeSearchStruct(getState())))
      dispatch(fetchAndUpdateConfig())
      dispatch(createSearchState())
    }).catch((error) => {
      // eslint-disable-next-line
      console.error(error)
    })

  }
}

function selectModules(state) {
  return state.modules
}

function makeSearchStruct(state) {
  const modules = selectModules(state)
  return modules['modules'].map((module) => {return(module['module_name'])}).reduce((o, key) => ({ ...o, [key]: []}), {})
}

export default getAndSetModules