import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@features/dashboard/pages/Dashboard';
import CreateTest from '@features/tests/createTests/pages/CreateTest';
import Confirmation from '@features/tests/publish/pages/Confirmation';
import LoginPage from '@features/auth/pages/LoginPage';
import QuestionCreationContainer from '@features/tests/questionCreations/pages/QuestionCreationContainer';
import PrivateRoute from './PrivateRoute';
import { ROUTES } from '@constants/constants';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            {/* Protected */}
            <Route path={ROUTES.DASHBOARD} element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path={ROUTES.CREATE_TEST} element={<PrivateRoute><CreateTest /></PrivateRoute>} />
            <Route path={ROUTES.EDIT_TEST} element={<PrivateRoute><CreateTest /></PrivateRoute>} />
            <Route path={ROUTES.QUESTION_CREATION} element={<PrivateRoute><QuestionCreationContainer /></PrivateRoute>} />
            <Route path={ROUTES.CONFIRMATION} element={<PrivateRoute><Confirmation /></PrivateRoute>} />

            {/* Fallback */}
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
    );
};

export default AppRoutes;
