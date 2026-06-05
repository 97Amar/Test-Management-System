import { useState, useCallback, useEffect, useRef } from 'react';
import { apiCallGet, apiCallPost } from '../services/axios';
import { API_URLS } from '../constants/constants';
import { StatusCodes } from '../constants/status';
import type { TestData, IQuestion } from '../features/tests/questionCreations/interface';

/**
 * Hook to fetch a single test by its ID
 */
export const useTestById = (testId?: string) => {
    const [testData, setTestData] = useState<TestData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    const fetchTest = useCallback(async (id: string) => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiCallGet(`${API_URLS.GET_TEST_BY_ID}/${id}`,{},false);
            if (response.status === StatusCodes.SUCCESS) {
                setTestData(response.data as TestData);
            } else {
                setError(response.message || 'Failed to fetch test');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching test');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (testId && !hasFetched.current) {
            hasFetched.current = true;
            fetchTest(testId);
        }
    }, [testId, fetchTest]);

    return {
        testData,
        isLoading,
        error,
        refetch: () => {
            if (testId) fetchTest(testId);
        },
        setTestData
    };
};

/**
 * Hook to fetch questions in bulk for a given set of IDs
 */
export const useBulkQuestions = (questionIds?: string[]) => {
    const [questionsData, setQuestionsData] = useState<IQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastFetchedIds = useRef<string[]>([]);

    const fetchQuestions = useCallback(async (ids: string[]) => {
        if (!ids || ids.length === 0) {
            setQuestionsData([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await apiCallPost(API_URLS.GET_QUESTIONS_BY_TEST_ID, {
                question_ids: ids
            });

            if (response.status === StatusCodes.SUCCESS) {
                setQuestionsData(response.data as IQuestion[]);
                lastFetchedIds.current = ids;
            } else {
                setError(response.message || 'Failed to fetch questions');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching questions');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Only fetch if IDs have changed and are not empty
        if (questionIds && questionIds.length > 0) {
            const isSame =
                questionIds.length === lastFetchedIds.current.length &&
                questionIds.every((id, index) => id === lastFetchedIds.current[index]);

            if (!isSame) {
                fetchQuestions(questionIds);
            }
        }
    }, [questionIds, fetchQuestions]);

    return {
        questionsData,
        isLoading,
        error,
        refetch: () => {
            if (questionIds) fetchQuestions(questionIds);
        },
        setQuestionsData
    };
};
