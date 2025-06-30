import React from "react";

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // يمكنك تسجيل الخطأ هنا إذا أردت
    // console.error("Chart error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger text-center my-4">
          Sorry, there was a problem displaying the chart.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ChartErrorBoundary;
