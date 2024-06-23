import '../styles/SimpleItemTable.css';

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

