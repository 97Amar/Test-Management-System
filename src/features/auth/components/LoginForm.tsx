import { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../login.schema";
import FormControl from "@components/common/formik/FormControl";
import CommonButton from "@components/common/Button/CommonButton";
import { apiCallPost } from "@services/axios";
import { StatusCodes } from "@constants/status";
import { useDispatch } from "react-redux";
import { setCredentials } from "@redux/slices/authSlice";
import type { LoginData, LoginPayload } from "../interface";
import { API_URLS, ROUTES } from "@constants/constants";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (values: LoginPayload) => {
    setLoginError('');

    const payload: LoginPayload = {
      userId: values.userId,
      password: values.password,
    };

    try {
      const response = await apiCallPost<LoginPayload, LoginData>(
        API_URLS.LOGIN,
        payload
      );

      if (response.status === StatusCodes.SUCCESS && response.data) {
        const { token, user } = response.data;

        // Persist token for PrivateRoute check
        localStorage.setItem('token', token);

        dispatch(
          setCredentials({
            token,
            user,
          })
        );

        navigate(ROUTES.DASHBOARD);
      } else {
        setLoginError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setLoginError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-form-wrapper">
      <Formik
        initialValues={{
          userId: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="login-form">
            {loginError && (
              <div className="alert alert-danger mb-3">{loginError}</div>
            )}

            <FormControl
              control="input"
              label="User ID"
              name="userId"
              placeholder="Enter User ID"
              value={formik.values.userId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userId && formik.errors.userId}
            />

            <FormControl
              control="input"
              label="Password"
              name="password"
              type="password"
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
            />

            <div className="forgot-password">
              Forgot Password?
            </div>

            <CommonButton
              type="submit"
              fullWidth
              loading={formik.isSubmitting}
              className="login-button"
              label="Login"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
