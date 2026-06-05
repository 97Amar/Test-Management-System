import React from 'react';

interface Props {
    show: boolean;
    onHide: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'lg' | 'xl';
}

const CommonModal = ({ show, onHide, title, children, footer, size }: Props) => {
    if (!show) return null;

    return (
        <>
            <div
                className="modal fade show"
                style={{ display: 'block' }}
                tabIndex={-1}
                onClick={(e) => {
                    if ((e.target as HTMLElement).classList.contains('modal')) onHide();
                }}
            >
                <div className={`modal-dialog modal-dialog-centered${size ? ` modal-${size}` : ''}`}>
                    <div
                        className="modal-content"
                        style={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}
                    >
                        <div
                            className="modal-header"
                            style={{ borderBottom: '1px solid #E5E7EB', padding: '1rem 1.5rem' }}
                        >
                            <h5 className="modal-title fw-semibold">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onHide}
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body" style={{ padding: '1.5rem' }}>
                            {children}
                        </div>
                        {footer && (
                            <div
                                className="modal-footer"
                                style={{ borderTop: '1px solid #E5E7EB', padding: '1rem 1.5rem' }}
                            >
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onHide} />
        </>
    );
};

export default CommonModal;
