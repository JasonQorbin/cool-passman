import loadingImage from '../assets/loading.gif';
/**
 *  Component that shows a loading throbber.
 */
export default function LoadingWidget() {
    return (
        <div className="loading-div">
            <img className="loading-throbber" src={loadingImage} />
        </div>
    )
}

