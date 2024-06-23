export default function TransparentTextInputOverlay(props) {
    function submitValue(event) {
        event.preventDefault();
        const textField = document.getElementById("text-input-field");
        props.submitCallback(textField.value);
    };

    function cancelInput() {
        props.closeCallback();
    }

    return (
        <div className="transparent-layer">
            <div className="centre-container">
                <div id="input-window">
                    <p>{props.title}</p>
                    <form onSubmit={submitValue}>
                        <input
                            id="text-input-field"
                            type="text"
                            defaultValue={props.defaultValue}
                            required
                        />
                        <div className="form-row">
                            <input type="submit" value="Submit" />
                            <button onClick={cancelInput}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
