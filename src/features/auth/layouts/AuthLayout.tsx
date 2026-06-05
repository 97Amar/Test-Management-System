import { Row, Col } from "react-bootstrap";

import "./AuthLayout.scss";
import AuthCard from "../sections/AuthContainer/AuthContainer";
import LoginBanner from "../sections/AuthBanner/AuthBanner";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="auth-layout">
            <Row className="auth-layout__row">
                <Col lg={6} md={6} sm={6} xs={6} className="auth-layout__left">
                    <LoginBanner />
                </Col>

                <Col lg={6} md={6} sm={6} xs={6} className="auth-layout__right">
                    <AuthCard>
                        {children}
                    </AuthCard>
                </Col>
            </Row>
        </div>
    );
};

export default AuthLayout;