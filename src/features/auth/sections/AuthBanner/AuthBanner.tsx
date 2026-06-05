import "./AuthBanner.scss";
import loginIllustration from "@assets/images/Frame.png";

const AuthBanner = () => {
    return (
        <div className="auth-banner">
            <img
                src={loginIllustration}
                alt="Authentication Illustration"
                className="auth-banner__image"
            />
        </div>
    );
};

export default AuthBanner;