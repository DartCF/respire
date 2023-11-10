import axios from "axios"
import { useEffect, useState } from "react"
// import ResultInterface from "./ResultInterface"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSearchResults, setSearchFlag } from "../store";

function GeneExpressionInterface({ handleTransform, applicationName }) {
    const dispatch = useDispatch();

    // move these to config.js
    const organisms_path = "http://localhost:8000/v1/studies/organisms"
    const profiling_method_path = "http://localhost:8000/v1/studies/profilingMethod"
    const search_path = "http://localhost:8000/v1/studies/searchMetadata"

    // const loading = useSelector((state) => {
    //     return state.loading
    // });
    
    // const [searchedFlag, setSearchedFlag] = useState(false)
    // const [searchResults, setSearchResults] = useState([])
    // const searchResults = useSelector((state) => {
    //     return state.searchResults
    // });
    
    function handleSearchResults(results) {
        // console.log('Dispatching search results')
        // console.log(results)
        dispatch(setSearchResults(results));
        
    }

    function handleSearchFlag() {
        dispatch(setSearchFlag());
    }
    // options state
    const [hasData, setHasData] = useState(1)
    const [organisms, setOrganisms] = useState([])
    const [profilingMethods, setProfilingMethods] = useState([])

    // input state 
    const [searchTerm, setSearchTerm] = useState('')
    const [minSamp, setMinSamp] = useState(0)

    // set organism options
    useEffect(() => {
        axios.post(
            organisms_path.concat('?has_data=', hasData),
        ).then((res) => {
            setOrganisms(res.data);
        }).catch((error) => {
            // eslint-disable-next-line
            console.error(error)
        });
    }, [hasData])

    // set profiling method options
    useEffect(() => {
        axios.post(
            profiling_method_path.concat('?has_data=', hasData),
        ).then((res) => {
            setProfilingMethods(res.data);
        }).catch((error) => {
            // eslint-disable-next-line
            console.error(error)
        });
    }, [hasData])

    const [organismSelected, setOrganismSelected] = useState(organisms[0])
    const [profilingMethodSelected, setProfilingMethodSelected] = useState(profilingMethods[0])

    // function to flip value of hasData
    function toggleHasData() {
        setHasData(hasData === 1 ? 0 : 1)
    }

    // event handlers

    function handleSearchText(event) {
        setSearchTerm(event.target.value);
    }

    function handleMinSamp(event) {
        setMinSamp(event.target.value)
    }

    function handleOrganismSelect(event) {
        setOrganismSelected(event.target.value)
    }

    function handleProfilingMethodSelect(event) {
        setProfilingMethodSelected(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(organismSelected)
        const query_body = JSON.stringify({
            search_string: searchTerm,
            n_samples: minSamp,
            organism: organismSelected === undefined ? organisms[0] : organismSelected,
            profiling_method: profilingMethodSelected === undefined ? profilingMethods[0] : profilingMethodSelected,
            has_data: hasData
        })
        
        console.log(query_body)

        axios.post(search_path, query_body, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            handleSearchResults(res.data);
        }).catch((error) => {
            // eslint-disable-next-line
            console.error(error)
        });

        handleSearchFlag();
        handleTransform()

    }


    // ui
    return (
        <div>
                <form onSubmit={handleSubmit}>
                    <label className="cb">
                        Data Available
                        <input type="checkbox" onClick={toggleHasData} defaultChecked></input>
                    </label>
                    <br></br><br></br>
                    <label className="cb">
                        Search terms
                        <input value={searchTerm} type="text" onChange={handleSearchText}
                            placeholder="Enter one or more search terms" required="required">
                        </input>
                    </label>
                    <br></br>
                    <label className="cb">
                        Select organism:
                        <select className="select" value={organismSelected} onChange={handleOrganismSelect}>
                            {organisms.map((x) => <option key={x}>{x}</option>)}
                        </select>
                    </label>
                    <br></br>
                    <label className="cb">
                        Select data profiling method:
                        <select className="select" value={profilingMethodSelected} onChange={handleProfilingMethodSelect}>
                            {profilingMethods.map((x) => <option key={x}>{x}</option>)}
                        </select>
                    </label>
                    <label className="cb">
                        Minimum number of samples:
                        <input type="number" value={minSamp} onChange={handleMinSamp}>
                        </input>
                    </label>
                    <button type="submit" id="submit">Search</button>
                </form>
        </div>
    )
}

export default GeneExpressionInterface