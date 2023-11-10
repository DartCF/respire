import axios from 'axios'
import { clearCart } from '..'
import { setLoading } from '..'
import { setProcessing, incrementProcessing } from '..'
import { clearSelectedIds } from '..'

function downloadFile() {
    return function (dispatch, getState) {
        dispatch(setLoading(true))

        const cart = selectCart(getState())

        let downloads = {}
        // for each study in the cart if study.module is not in downloads add it
        // creates an object that looks like this:
        // {'gene_expression': ['GSE123', 'GSE456'],
        //  'microbiome': ['GSE1011', 'GSE1213'],
        //   ...
        // }
        // cart.forEach((study) => {
        //     if (!(study.module in downloads)){
        //         downloads[study.module] = []
        //     }
        //     downloads[study.module].push(study.study.accession_number)
        // })

        cart.forEach((study) => {
            if (!(study.searchKey in downloads)) {
                downloads[study.searchKey] = {
                    module: study.module,
                    studies: []
                }
            }

            downloads[study.searchKey]['studies'].push(study.study.accession_number)
        });

        dispatch(setProcessing({ to_process: Object.keys(downloads).length, processed: 0 }))
        const modules = selectModules(getState())

        for (const [key, downloadBatch] of Object.entries(downloads)) {

            const selectedModule = modules['modules'].find(
                (module) => module['module_name'] === downloadBatch.module
            );

            let path = selectedModule['module_api'].concat("data/download")
            let skey = key.split(" ").join("_")

            axios.post(
                path,
                downloadBatch.studies,
                { responseType: 'blob' }
            ).then((res) => {
                const blob = new Blob([res.data], { type: 'application/octet-stream' })
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${skey}_respire_data_download.zip`;
                link.click();
            }).catch((error) => {
                // eslint-disable-next-line
                console.error(error)
            }).finally(() => {
                dispatch(incrementProcessing('processed'))
                dispatch(resetAfterDownload())

            })

        };

        // for (const [module_name, studies_for_download] of Object.entries(downloads)){

        //     const selectedModule = modules['modules'].find(
        //         (module) => module['module_name'] === module_name
        //       );

        //     let path = selectedModule['module_api'].concat("data/download")

        //     axios.post(
        //         path,
        //         studies_for_download,
        //         { responseType: 'blob' }
        //     ).then((res) => {
        //         const blob = new Blob([res.data], { type: 'application/octet-stream' })
        //         const link = document.createElement('a');
        //         link.href = window.URL.createObjectURL(blob);
        //         link.download = `${selectedModule['module_name']}_respire_data_download.zip`;
        //         link.click();
        //     }).catch((error) => {
        //         // eslint-disable-next-line
        //         console.error(error)
        //     }).finally(() => {
        //         dispatch(incrementProcessing('processed'))
        //         dispatch(resetAfterDownload())

        //     })

        // };


    }
}

function resetAfterDownload() {
    return function (dispatch, getState) {
        if (selectFinishedProcessing(getState())) {
            dispatch(clearCart())
            dispatch(setLoading(false))
            dispatch(clearSelectedIds())
        }
    }
}

function selectCart(state) {
    return state.cart
}

function selectModules(state) {
    return state.modules
}

function selectFinishedProcessing(state) {
    return state.processing.to_process === state.processing.processed
}

export default downloadFile