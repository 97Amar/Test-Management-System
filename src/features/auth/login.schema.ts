import * as Yup from 'yup';

export const loginSchema = Yup.object({
    userId: Yup.string().required('User ID is required'),
    password: Yup.string().required('Password is required'),
});
