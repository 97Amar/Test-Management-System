import { Row, Col } from "react-bootstrap";

import "./AuthLayout.scss";
import AuthCard from "../sections/AuthContainer/AuthContainer";
import LoginBanner from "../sections/AuthBanner/AuthBanner";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="auth-layout">
            <Row className="auth-layout__row">
                {/* <Col lg={6} className="auth-layout__left"> */}
                <Col lg={6} md={6} sm={6} xs={6}>
                    <LoginBanner />
                </Col>

                {/* <Col lg={6} xs={12} className="auth-layout__right"> */}
                <Col lg={6} md={6} sm={6} xs={6}>
                    <AuthCard>
                        {children}
                    </AuthCard>
                </Col>
            </Row>
        </div>
    );
};

export default AuthLayout;