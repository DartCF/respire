import Cart from "./components/cart";
import Loader from "./components/loader";

import { useSelector } from "react-redux";
import ResultInterface from "./components/ResultInterface";
import { NumberInput, CheckboxInput, SelectInput, TextInput } from "./components/inputs";
import { useDispatch } from "react-redux";
import { setActiveModule } from "./store";

import fetchAndUpdateModules from "./store/thunk/fetchAndUpdateModules";
import fetchAndUpdateConfig from "./store/thunk/getAndSetActiveConfig";
import { setField } from './store';
import { getAndSetSearchResults } from "./store/thunk/getAndSetSearchResults";
import { useEffect } from "react";
import InfoIcon from '@mui/icons-material/Info';
import { Icon, IconButton, Modal } from '@mui/material';
import { useState } from "react";

function App({ applicationName }) {
  const dispatch = useDispatch();

  // store subscriptions
  const config = useSelector((state) => {
    return state.config
  });

  const modules = useSelector((state) => {
    return state.modules
  }
  );

  const cart = useSelector((state) => {
    return state.cart
  });

  const searchFlag = useSelector((state) => {
    return state.searchFlag
  });

  const transform = useSelector((state) => {
    return state.transform
  });

  const loading = useSelector((state) => {
    return state.loading
  });

  function handleChange(searchField, value) {
    dispatch(setField({ key: searchField, value: value }))
  }


  // initialize modules
  useEffect(() => {
    dispatch(fetchAndUpdateModules())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleModuleSelect(event) {
    const selectedValue = event.target.value;

    const selectedModule = modules['modules'].find(
      (module) => module['module_name'] === selectedValue
    );

    if (selectedModule) {
      dispatch(setActiveModule(selectedModule));
      dispatch(fetchAndUpdateConfig())
    }
  }

  // define available input components
  const functions = {
    numberInput: NumberInput,
    checkboxInput: CheckboxInput,
    selectInput: SelectInput,
    textInput: TextInput
  }

  // function to render input components
  const renderInputComponents = (inputs, handleChange) => {
    return inputs.map((input, index) => {

      const Component = functions[input.function];

      if (Component) {
        return (
          <Component
            key={index}
            searchField={input.searchField}
            cfg={input.args}
            handleChange={handleChange}
          />
        );
      }
      console.warn(`Unknown component function: ${input.function}`);
      return null;

    });
  };

  function handleSubmit(event) {
    event.preventDefault();

    dispatch(getAndSetSearchResults())

  }
  const [isModalOpen, setModalOpen] = useState(false);

  function handleIconClick() {
    // console.log("clicked");
    setModalOpen(true);
  };

  function handleCloseModal() {
    setModalOpen(false);
  };

  return (

    <div>
      <header>
        <h1>{applicationName}</h1>
        {/* <InfoIcon id="info" /> */}
        <div className="rhscontainer">
          <IconButton onClick={handleIconClick}>
            <InfoIcon id="info" />
          </IconButton>
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <div className="modal-content">
              <h2>About this system</h2>

              <p>This system is intended to facilitate the re-use of publicly available data. Available data comes from many sources. 
                The application authors <b> make no guarantees </b> as to the correctness of these data or the suitability of these data for any particular project.</p>

              <p>Use the inputs to search for studies matching your research interests and needs. These studies can be added to your cart and downloaded as a ZIP file.</p>

              <p>If you are interested in creating a new instance of this system specific to your research domain or contributing processed data to the project,
                please consult the system documentation [LINK]
              </p>

              <button onClick={handleCloseModal}>Close</button>
            </div>
          </Modal>
          {/* <InfoIcon id="info" onClick={console.log("clicked")}/>  */}
          <div className="dropdown">
            <button className="dropbtn">
              <span>Studies</span>
              <div className="dot">{cart.length}</div>
              <i className="fa fa-caret-down"></i>
            </button>
            <Cart />
          </div>
        </div>

      </header>
      <div>
        <Loader />
        <div className={`bg ${transform ? 'transfm' : ''}`}></div>
        <div className="main-container" id="main">
          <div id="searchBar" className={`searchBar ${searchFlag ? 'sideBar' : ''}`}>
            <h3>Search {applicationName} Database</h3>
            <div>
              <form onSubmit={handleSubmit}>
                <label className="cb">
                  Select data module:
                  <select className="select" onChange={handleModuleSelect}>
                    {modules['modules'].map((module) => {
                      // return an option for each module
                      return <option key={module['module_name']} value={module['module_name']}>{module['module_name']}</option>
                    })}
                  </select>
                </label> 
                {renderInputComponents(config, handleChange)}
                <button type="submit" id="submit" disabled={loading} >Search</button>
              </form>
            </div>
          </div>
          <ResultInterface searchedFlag={searchFlag} />
        </div>

      </div>
    </div>
  );
}

export default App;


