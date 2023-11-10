import axios from "axios"
import { useEffect, useState } from "react"

import { useDispatch } from "react-redux";
import { setSearchResults, setSearchFlag } from "../store";

function MicrobiomeInterface({ handleTransform }) {
    const dispatch = useDispatch();
    
    const host_path = "http://localhost:8001/v1/studies/host"
    const method_path = "http://localhost:8001/v1/studies/method"
    const search_path = "http://localhost:8001/v1/studies/searchMetadata"

    function handleSearchResults(results) {
        // console.log('Dispatching search results')
        // console.log(results)
        dispatch(setSearchResults(results));
        
    }

    function handleSearchFlag() {
        dispatch(setSearchFlag());
    }
    // options state
    const [hasData, setHasData] = useState(0)
    const [hosts, setHosts] = useState([])
    const [method, setMethods] = useState([])

    // input state 
    const [searchTerm, setSearchTerm] = useState('')
    const [minSamp, setMinSamp] = useState(0)

    // // set host options
    useEffect(() => {
        axios.post(
            host_path.concat('?has_data=', hasData),
        ).then((res) => {
            setHosts(res.data);
        }).catch((error) => {
            // eslint-disable-next-line
            console.error(error)
        });
    }, [hasData])

    // set method options
    useEffect(() => {
        axios.post(
            method_path.concat('?has_data=', hasData),
        ).then((res) => {
            setMethods(res.data);
        }).catch((error) => {
            // eslint-disable-next-line
            console.error(error)
        });
    }, [hasData])

    const [hostSelected, setHostSelected] = useState(hosts[0])
    const [methodSelected, setMethodSelected] = useState(method[0])

    // function to flip value of hasData
    function toggleHasData() {
        // setHasData(hasData === 1 ? 0 : 1)
        console.log(hasData)
    }

    // event handlers

    function handleSearchText(event) {
        setSearchTerm(event.target.value);
    }

    function handleMinSamp(event) {
        setMinSamp(event.target.value)
    }

    function handleHostSelect(event) {
        setHostSelected(event.target.value)
    }

    function handleMethodSelect(event) {
        setMethodSelected(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('Submitting search')
        // console.log(organismSelected)
        const query_body = JSON.stringify({
            search_string: searchTerm,
            n_samples: minSamp,
            host: hostSelected === undefined ? hosts[0] : hostSelected,
            data_type: methodSelected === undefined ? method[0] : methodSelected,
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
        {/* <div className="main-container" id="main">
            <div id="searchBar" className={`searchBar ${searchedFlag ? 'sideBar' : ''}`}> */}
                <form onSubmit={handleSubmit}>
                    <label className="cb">
                        Data Available
                        <input type="checkbox" onClick={toggleHasData}></input>
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
                        Select host:
                        <select className="select" value={hostSelected} onChange={handleHostSelect}>
                            {hosts.map((x) => <option key={x}>{x}</option>)}
                        </select>
                    </label>
                    <br></br>
                    <label className="cb">
                        Select method:
                        <select className="select" value={methodSelected} onChange={handleMethodSelect}>
                            {method.map((x) => <option key={x}>{x}</option>)}
                        </select>
                    </label>
                    <label className="cb">
                        Minimum number of samples:
                        <input type="number" value={minSamp} onChange={handleMinSamp}>
                        </input>
                    </label>
                    <button type="submit" id="submit">Search</button>
                </form>
            {/* </div >
            <ResultInterface searchResults={searchResults} searchedFlag={searchedFlag}/>
        </div> */}
        </div>
    )
}

export default MicrobiomeInterface