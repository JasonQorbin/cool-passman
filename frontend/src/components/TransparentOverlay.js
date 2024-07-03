/**
 * A component that wraps around something else, usually some input form.
 * It will display that form in the centre of the screen and with the rest of the content
 * darkened behind it.
 */
export default function TransparentOverlay(props) {
    const { children } = props;
    
    return (
        <div className="transparent-layer">
            <div className="centre-container">
                <div id="input-window">
                    {children}
                </div>
            </div>
        </div>
    );
}
