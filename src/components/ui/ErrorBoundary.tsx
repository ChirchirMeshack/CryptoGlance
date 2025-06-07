import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Props for the ErrorBoundary component.
 * - children: The React nodes that the boundary will wrap and monitor for errors.
 */
interface Props {
    children: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 * - hasError: Indicates if an error has been caught.
 * - error: The error object that was caught, if any.
 */
interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary is a React class component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
    // Initialize state to track if an error has occurred and store the error object.
    public state: State = {
        hasError: false,
        error: null,
    };

    /**
     * Updates state when an error is thrown in a child component.
     * This lifecycle method is invoked after an error has been thrown by a descendant component.
     * @param error The error that was thrown.
     * @returns Updated state with error information.
     */
    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    /**
     * Lifecycle method that is called after an error has been thrown by a descendant component.
     * Used here to log error details for debugging.
     * @param error The error that was thrown.
     * @param errorInfo Additional information about the error.
     */
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error details to the console (could also send to an error reporting service)
        console.error('Uncaught error:', error, errorInfo);
    }

    /**
     * Renders the fallback UI if an error has been caught, otherwise renders children as usual.
     */
    public render() {
        if (this.state.hasError) {
            // Render a user-friendly error message and a button to reload the page.
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        {/* Error icon */}
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        {/* Error title */}
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Something went wrong
                        </h1>
                        {/* Error message */}
                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        {/* Button to reload the page */}
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        // If no error, render children components as usual.
        return this.props.children;
    }
}