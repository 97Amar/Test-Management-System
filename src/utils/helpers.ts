/**
 * src/utils/helpers.ts
 * ─────────────────────────────────────────────────────────────────────────
 * General-purpose utility helpers
 *
 * EXPORTS
 *   debounce   – delays execution until after `delay` ms of silence
 *   throttle   – ensures fn fires at most once per `limit` ms
 *   useDebounce   – React hook: debounced value
 *   useThrottle   – React hook: throttled callback (stable ref)
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Plain utility functions ──────────────────────────────────────────────

/**
 * Returns a debounced version of `fn`.
 * The debounced function will only call `fn` after it hasn't been
 * called for `delay` milliseconds.
 *
 * @example
 * const debouncedSearch = debounce((q: string) => fetchResults(q), 400);
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;

    return function (...args: Parameters<T>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

/**
 * Returns a throttled version of `fn`.
 * `fn` is called immediately on the first invocation and then at most
 * once every `limit` ms thereafter (leading edge).
 *
 * @example
 * const throttledSubmit = throttle(() => submitForm(), 2000);
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return function (...args: Parameters<T>) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            fn(...args);
        }
    };
}

// ─── React Hooks ─────────────────────────────────────────────────────────

/**
 * `useDebounce` — returns a debounced copy of `value`.
 * Useful for delaying API calls triggered by user input (e.g. search).
 *
 * @param value  The live value (e.g. search string state)
 * @param delay  Milliseconds to wait before updating (default 400 ms)
 *
 * @example
 * const debouncedQuery = useDebounce(searchQuery, 400);
 * useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delay = 400): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * `useThrottle` — returns a stable throttled version of `callback`.
 * Ideal for preventing rapid duplicate form submissions or API calls.
 *
 * @param callback  The function to throttle
 * @param limit     Minimum ms between calls (default 2000 ms)
 *
 * @example
 * const handleSubmit = useThrottle(() => submitTest(values), 2000);
 * <button onClick={handleSubmit}>Submit</button>
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    limit = 2000
): (...args: Parameters<T>) => void {
    const lastCall = useRef<number>(0);
    const callbackRef = useRef<T>(callback);

    // Always keep the ref in sync so we call the latest version
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastCall.current >= limit) {
                lastCall.current = now;
                callbackRef.current(...args);
            }
        },
        [limit]
    );
}

/**
 * Restricts input to characters (a-z, A-Z) and spaces only.
 * Designed to be used in onKeyDown event.
 */
export const allowOnlyChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation and control keys
    const allowedKeys = [
        'Backspace',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Delete',
        'Enter',
        ' ',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
    ];

    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
        return;
    }

    // Only allow letters
    if (!/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
    }
};

/**
 * Restricts input to positive numbers only (prevents '-' and 'e').
 * Designed to be used in onKeyDown event for type="number" inputs.
 */
export const allowOnlyPositive = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
        e.preventDefault();
    }
};
