import LoginForm from "@features/auth/components/LoginForm";
import "@features/auth/LoginPages.scss";
import logo from "@assets/images/loginPageLogo.png";
import AuthLayout from "@/features/auth/layouts/AuthLayout";


const LoginPage = () => {
    return (
        <AuthLayout>
            <div className="login-page">
                <div className="inner-container">
                    <div className="logo">
                        <img
                            src={logo}
                            alt="Authentication Illustration"
                            className="auth-illustration__image"
                        />
                    </div>

                    <div className="login-page__header">
                        <h2 className="login-page__title">Login</h2>
                        <p className="login-page__subtitle">
                            Use your company provided Login credentials
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;