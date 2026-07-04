import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Oops! A Micro Frontend failed to load.</h2>
          <p className="text-red-600 mb-4">{this.state.error?.message || "Make sure the remote server is running."}</p>
          <pre className="text-xs text-left bg-white p-4 rounded border overflow-x-auto text-gray-700">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
