import { useSelector } from "react-redux";
import { removeFromCart } from "../store";
import { useDispatch } from "react-redux";
import downloadFile from "../store/thunk/downloadFiles";
import { removeId } from "../store";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function CartTable(rows, handleRemove) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Module</TableCell>
                        <TableCell align="right">Title</TableCell>
                        <TableCell align="right">Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.module}
                            </TableCell>
                            <TableCell align="right">{row.title}</TableCell>
                            <TableCell align="right"><button onClick={() => handleRemove(row.index, row.module, row.accession_number)}>X</button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


function DownloadButton({ studiesSelected }) {
    const dispatch = useDispatch();
    const loading = useSelector((state) => {
        return state.loading
    });

    function handleDownload(event) {
        // console.log("download button clicked");
        event.preventDefault();
        dispatch(downloadFile())

    }
    if (studiesSelected) {
        return (
            <button className="download"
                onClick={handleDownload}
                disabled={loading}
            >Download Data</button>
        )
    };

    return (
        <div></div>
    );

};

function Cart() {
    const cart = useSelector((state) => {
        return state.cart
    });
    const searchResults = useSelector((state) => {
        return state.searchResults
    });

    const dispatch = useDispatch();

    function handleRemove(index, module_name, id) {
        dispatch(removeFromCart(index));
        dispatch(removeId(module_name.concat(String(id))));
        // console.log(id, resultIndex, module_name);
    }

    if (cart.length === 0) {
        return (
            <div>
                
            </div>
        )
    }

    return (
        <div className="dropdown-content">
            {CartTable(cart.map((study, index) => {
                return({ module: study.module, title: study.study.studyTitle, accession_number: study.study.accession_number, index: index })
            }), handleRemove)}
            <DownloadButton studiesSelected={cart.length > 0} />
        </div >


    );
};

export default Cart;