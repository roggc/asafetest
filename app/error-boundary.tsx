import React, { ReactNode, ErrorInfo } from "react";
import MyError from "@/app/my-error";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Si deseas registrar el error, puedes descomentar este método
  // componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  //   console.error("ErrorBoundary caught an error", error, errorInfo);
  // }

  render() {
    if (this.state.hasError) {
      return (
        <MyError
          errorMessage={this.state.error ? this.state.error.toString() : ""}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
