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
