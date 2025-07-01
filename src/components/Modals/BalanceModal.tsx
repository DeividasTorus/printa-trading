import React from 'react';

type ModalProps = {
    title?: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

export default function Modal({ title, isOpen, onClose, children, footer }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 text-3xl font-bold"
                >
                    &times;
                </button>
                {title && (
                    <h2 className="w-[300px] mx-auto text-center font-semibold text-xl mb-10 whitespace-pre-line">
                        {title}
                    </h2>
                )}
                <div className="mb-6">{children}</div>
                {footer && <div>{footer}</div>}
            </div>
        </div>

    );
}
