import '../styles/ToastMessage.css'; 

import Toast from 'react-bootstrap/Toast';

function ToastMessage(props) {
    return (
        <Toast 
            onClose={() => props.setShow(false)}
            show={props.show} 
            delay={25000} 
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
