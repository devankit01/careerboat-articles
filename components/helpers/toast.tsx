import { toast, ToastOptions } from "react-toastify";

export const SuccessToast = ({ title, message }: { title: string; message: string }) => (
    <div className="flex flex-col">
        <span style={{ color: '#1CBA2F', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
            {title}
        </span>
        <span className="font-normal text-sm leading-5 tracking-normal" style={{ color: '#333' }}>
            {message}
        </span>
    </div>
);

export const showSuccessToast = (title: string, message: string, position: ToastOptions['position'] = 'top-right') => {
    return toast(<SuccessToast title={title} message={message} />, {
        position: position,
        className: 'toast-custom-success',
        progressClassName: 'toast-progress-success',
    });
};


export const ErrorToast = ({ title, message }: { title: string; message: string }) => (
    <div className="flex flex-col">
        <span style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
            {title}
        </span>
        <span className="font-normal text-sm leading-5 tracking-normal" style={{ color: '#333' }}>
            {message}
        </span>
    </div>
);

export const showErrorToast = (title: string, message: string, position: ToastOptions['position'] = 'top-right') => {
    return toast(<ErrorToast title={title} message={message} />, {
        position: position,
        className: 'toast-custom-error',
        progressClassName: 'toast-progress-error',
    });
};

const InfoToast = ({ title, message }: { title: string, message: string }) => (
    <div className="flex flex-col">
        <span style={{ color: '#b38813', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
            {title}
        </span>
        <span className="font-normal text-sm leading-5 tracking-normal" style={{ color: '#333' }}>
            {message}
        </span>
    </div>
);

export const showInfoToast = (title: string, message: string, options?: ToastOptions) => {
    toast(<InfoToast title={title} message={message} />, {
        className: 'toast-custom-info',
        progressClassName: 'toast-progress-info',
        ...options
    });
};
