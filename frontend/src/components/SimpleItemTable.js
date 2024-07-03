import '../styles/SimpleItemTable.css';

/**
 * Reusable component for easily display a table with a single column of items.
 *
 * Also allows a callback function to be passed in that will be applied as a onClick handler
 * for each row. Items should have a _id property that will be passed into the callback function.
 */
export default function SimpleItemTable(props) {
    const tableRows = props.items.map( item => {
        return (
            <tr 
                key={item._id}
                onClick={() => {props.setSelectedCb(item._id);}}
                className={item._id === props.selected ? "selected" :""}

            >
                <td>{item.name}</td>    
            </tr>
        );
    });

    return (
        <table className="simple-table">
            <thead>
                <tr>
                    <th>{props.title}</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </table>
    );
}

