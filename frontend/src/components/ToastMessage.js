import '../styles/ToastMessage.css'; 

import Toast from 'react-bootstrap/Toast';

/**
  * Wrapper component for the Bootstrap toast message. Displays message with a configurable title,
  * body and colour variant and automatically disappears after 3 seconds.
  */
function ToastMessage(props) {
    return (
        <Toast 
            onClose={() => props.setShow(false)}
            show={props.show} 
            delay={3000} 
            autohide
            bg={props.variant}
        >
            <Toast.Header>
                <strong className="me-auto">{props.title}</strong>
            </Toast.Header>
            <Toast.Body>{props.message}</Toast.Body>
        </Toast>
    );
}

export default ToastMessage;
