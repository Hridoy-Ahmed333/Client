import {Toast, ToastBody, ToastContainer} from "react-bootstrap";
import {ToastContextConsumer} from "../context/ToastContext.tsx";

export const ToastComponent = () => {
    return (
        <ToastContextConsumer>
            {({show, msg, bg}) => (
                <ToastContainer position="top-end" className="mt-5">
                    <Toast bg={bg} show={show}>
                        <ToastBody>
                            <span className="text-zinc-200">{msg}</span>
                        </ToastBody>
                    </Toast>
                </ToastContainer>)}
        </ToastContextConsumer>
    );
};
