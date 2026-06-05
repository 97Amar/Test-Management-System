import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import * as CryptoJS from 'crypto-js';

import { toasts } from '../components/common/Toast/toasts';
export { toasts };
const BASE_URL = import.meta.env.VITE_APP_AUTH_URL;
const IS_ENCRYPTION = import.meta.env.VITE_APP_ENCRYPT === 'true';
const key = import.meta.env.VITE_APP_ENCRYPT_KEY;

interface ApiResponse<R> {
    status: string;
    data: null | R;
    message: string;
    error: boolean;
}

import { StatusCodes } from '../constants/status';

export type ApiCallReq<T> = {
    url: string;
    data?: T;
    toastOn?: boolean;
    loader?: boolean;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
    headers?: Record<string, string>;
    isFormData?: boolean;
    params?: Record<string, unknown>;
};

export const axiosApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosApi.interceptors.request.use(
    (config: any) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (config?.headers?.noAuth === 'true') {
            config.headers['api-access-token'] = `${token}`;
            delete config.headers.noAuth;
        } else if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // standard for the app
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response?.status === StatusCodes.UNAUTHORIZED) {
            if (typeof window !== 'undefined') {
                localStorage.clear();
                localStorage.removeItem('persist:root');
            }
        }
        return Promise.reject(error);
    },
);

function decryption(payload: string): string | undefined {
    try {
        if (payload) {
            const decryptedText = CryptoJS.AES.decrypt(payload, key);
            const decryptData = decryptedText.toString(CryptoJS.enc.Utf8);
            return decryptData || undefined;
        }
    } catch (error) {
        console.error('Decryption error:', error);
        return undefined;
    }
}

function encryption(payload: any) {
    try {
        if (payload != undefined || payload != null) {
            const ciphertext = CryptoJS.AES.encrypt(payload, key).toString();
            return ciphertext;
        }
    } catch (error) {
        return error;
    }
}

const encryptionFilter = (data: any) => {
    if (!data?.entries && data?.entries === undefined) {
        const encD = IS_ENCRYPTION ? encryption(JSON.stringify(data)) : data;
        return IS_ENCRYPTION ? { reqData: encD } : data;
    } else {
        return data;
    }
};

const decryptionFilter = (data: any) => {
    if (data && typeof data === 'string') {
        const decrypted = IS_ENCRYPTION ? decryption(data) : data;

        if (IS_ENCRYPTION && decrypted) {
            return JSON.parse(decrypted);
        }
        return data;
    }
    return data;
};

function handleSuccess<T>(res: ApiResponse<T>, toastOn: boolean = true): void {
    if ((res?.status === StatusCodes.SUCCESS || res?.status === StatusCodes.CREATED) && toastOn) {
        res?.message && toasts?.success(res?.message);
    }
}

function handleError(
    error: any,
    toastOn: boolean = true
) {
    const status = error?.response?.status || error?.status;
    const result = error?.response?.data;

    if (status === StatusCodes.UNAUTHORIZED || status === StatusCodes.FORBIDDEN) {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            localStorage.removeItem('persist:root');
            window.dispatchEvent(new Event('storage'));
            window.location.href = '/login';
        }
    }

    if (toastOn && (result?.message || error?.message === 'Network Error')) {
        toasts.error(result?.message || error?.message || 'Something went wrong');
    }

    return {
        status: status || 500,
        data: null,
        message: result?.message || error?.message || 'Something went wrong',
        error: true,
    };
}

function objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
            return;
        }
        if (value instanceof FileList) {
            Array.from(value).forEach((file, index) => {
                formData.append(`${key}[${index}]`, file);
            });
            return;
        }
        if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
            return;
        }
        if (value === null || value === undefined) {
            formData.append(key, '');
            return;
        }
        if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
            return;
        }
        formData.append(key, String(value));
    });

    return formData;
}

async function apiRequest<T, R>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    options: ApiCallReq<T>
): Promise<ApiResponse<R>> {
    const {
        url,
        data,
        toastOn = true,
        responseType = 'json',
        headers = {},
        isFormData = false,
        params,
    } = options;

    let requestData: any = data;
    const requestHeaders = { ...headers };

    if (isFormData && data && method !== 'get') {
        if (!(data instanceof FormData)) {
            requestData = objectToFormData(data as Record<string, any>);
        }
        delete requestHeaders['Content-Type'];
    }

    const config: AxiosRequestConfig = {
        method,
        url,
        headers: requestHeaders,
        responseType,
        params,
    };

    if (method !== 'get' && requestData) {
        config.data = encryptionFilter(requestData);
    }
    if (params) {
        config.params = encryptionFilter(params);
    }

    try {
        const response: AxiosResponse = await axiosApi(config);
        const result = response?.data;
        if (result && typeof result === 'object') {
            result.data = decryptionFilter(result.data);
        }

        if (toastOn) {
            handleSuccess(result as ApiResponse<R>, toastOn);
        }

        return result as ApiResponse<R>;
    } catch (error: any) {
        let decryptData = decryptionFilter(error);
        return handleError(decryptData, toastOn);
    }
}

async function apiCallGet<R>(
    url: string,
    config: {
        headers?: Record<string, string>;
        responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
        params?: Record<string, unknown>;
    } = {},
    toastOn?: boolean
): Promise<ApiResponse<R>> {
    const { headers = {}, responseType = 'json', params } = config;
    return apiRequest<null, R>(
        'get',
        { url, toastOn, headers, responseType, params }
    );
}

async function apiCallPost<T, R>(
    url: string,
    data: T,
    config: {
        headers?: Record<string, string>;
        responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
        isFormData?: boolean;
    } = {},
    toastOn?: boolean
): Promise<ApiResponse<R>> {
    const { headers = {}, responseType = 'json', isFormData = false } = config;
    return apiRequest<T, R>(
        'post',
        { url, data, toastOn, headers, responseType, isFormData }
    );
}

async function apiCallPut<T, R>(
    url: string,
    data: T,
    config: {
        headers?: Record<string, string>;
        responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
        isFormData?: boolean;
    } = {},
    toastOn?: boolean
): Promise<ApiResponse<R>> {
    const { headers = {}, responseType = 'json', isFormData = false } = config;
    return apiRequest<T, R>(
        'put',
        { url, data, toastOn, headers, responseType, isFormData }
    );
}

async function apiCallDelete<T, R>(
    url: string,
    data: T,
    config: {
        headers?: Record<string, string>;
        responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
        params?: Record<string, unknown>;
    } = {},
    toastOn?: boolean
): Promise<ApiResponse<R>> {
    const { headers = {}, responseType = 'json', params } = config;
    return apiRequest<T, R>(
        'delete',
        { url, data, toastOn, headers, responseType, params }
    );
}

async function apiCallPatch<T, R>(
    url: string,
    data: T,
    config: {
        headers?: Record<string, string>;
        responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
        isFormData?: boolean;
    } = {},
    toastOn?: boolean
): Promise<ApiResponse<R>> {
    const { headers = {}, responseType = 'json', isFormData = false } = config;
    return apiRequest<T, R>(
        'patch',
        { url, data, toastOn, headers, responseType, isFormData }
    );
}

export { apiCallGet, apiCallPost, apiCallPut, apiCallDelete, apiCallPatch };
