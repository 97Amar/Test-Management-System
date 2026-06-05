import React from 'react';

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="login-container">
            <div className="login-container__content">
                {children}
            </div>
        </div>
    );
};

export default AuthContainer;