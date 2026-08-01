import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertTriangle className="text-sunset-500" size={36} />
          <h2 className="font-display text-xl font-bold text-ink dark:text-sand">Something broke on this page</h2>
          <p className="max-w-sm text-sm text-ink/60 dark:text-sand-300/70">
            Try reloading. If it keeps happening, head back home and try again.
          </p>
          <button
            onClick={() => window.location.assign('/')}
            className="mt-2 rounded-full bg-horizon-gradient px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
