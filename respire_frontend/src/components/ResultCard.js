import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, addSelectedId } from "../store"

function ResultCard({ result, index }) {
    const dispatch = useDispatch();

    const activeModule = useSelector((state) => {
        return state.modules.active.module_name
    })

    const selectedIds = useSelector((state) => {
        return state.selectedIds
    })

    const stringifiedSearch = useSelector((state) => {
        return JSON.stringify(state.search)
    })

    const searchKeys = useSelector((state) => {
        const selectedElems = [];

        for (const item of state.config) {
            if (item.split_download) {
                selectedElems.push(state.search[item.searchField])
            }
        }
        return selectedElems.join("-");
    })

    function handleSelect(study) {
        // console.log(study)
        dispatch(addSelectedId(activeModule.concat(String(study.study.accession_number))))
        dispatch(addToCart(study));

    }

    return (
        <div className="result-card">
            <h3>Title:</h3> {result.title}

            <h3>Description:</h3>
            <blockquote>
                {result.description}
            </blockquote>
            <div className="card-footer">
                <h4> {result.n_samples} Samples</h4>
                <button className="select-study"
                    disabled={selectedIds.includes(activeModule.concat(String(result.accession_number)))}
                    onClick={() => handleSelect({
                        searchKey: [activeModule, searchKeys].join("-"),
                        module: activeModule,
                        study: { accession_number: result.accession_number, studyTitle: result.title, samplecount: result.n_samples }
                    })}>
                    Select
                </button>
            </div>
        </div >
    )
}

export default ResultCard