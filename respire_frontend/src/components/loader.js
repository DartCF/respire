import { useSelector } from "react-redux";

function Loader() {
    const loading = useSelector((state) => {
        return state.loading
    })

    if (loading) {
        return (
            <div className="loader"></div>
        )
    }
    
    return <div></div>
}

export default Loader