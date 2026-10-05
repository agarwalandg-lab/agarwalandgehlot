import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled runtime error in A&G application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center text-text-primary">
          <div className="max-w-md w-full bg-surface border border-stroke rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stroke/50 flex items-center justify-center text-accent font-display text-2xl">
              A&G
            </div>
            <h1 className="text-3xl font-display mb-3">Something went wrong</h1>
            <p className="text-sm text-muted mb-8 leading-relaxed">
              We encountered an unexpected technical issue. Our team has been notified. Please try refreshing the page or return home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full bg-text-primary px-6 py-3 text-xs uppercase tracking-[0.14em] text-bg transition-transform hover:scale-[1.02]"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="rounded-full border border-stroke px-6 py-3 text-xs uppercase tracking-[0.14em] text-text-primary transition-colors hover:bg-stroke/40"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
