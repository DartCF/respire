import ResultCard from "./ResultCard"
import {useSelector} from "react-redux"

function ResultInterface({searchedFlag}){

    const sr = useSelector((state) => {
        return state.searchResults[state.modules.active.module_name]
    })
    if (!searchedFlag){
        return(
            <div className="no-res"></div>
        )
    }

    if (sr.length === 0){
        return(
            <div className="no-res transfm">
                <h3>No matching results</h3>
            </div>
        )
    }

    return(
        <div className="scroll-container">
            {sr.map((elem, index) => <ResultCard result={elem} key={index} index= {index}/>)}
        </div>
    )
}

export default ResultInterface