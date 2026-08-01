import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import { Mail, Compass, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../api/auth'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [sent, setSent] = useState(false)

  const onSubmit = async ({ email }) => {
    try {
      await authService.forgotPassword(email)
    } catch {
      /* still show confirmation to avoid leaking account existence */
    }
    setSent(true)
    toast.success('If that email exists, a reset link is on its way')
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-dusk-gradient px-5 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-glass-lg dark:bg-ink-800">
        <NavLink to="/login" className="mb-4 flex items-center gap-1 text-sm text-ink/60 dark:text-sand-300/70">
          <ArrowLeft size={14} /> Back to login
        </NavLink>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-horizon-gradient text-white">
            <Compass size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink dark:text-sand">Reset your password</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-sand-300/70">
            Enter your email and we'll send a link to reset it.
          </p>
        </div>

        {sent ? (
          <div className="mt-8 rounded-xl bg-horizon-50 p-4 text-center text-sm text-horizon-700 dark:bg-white/5 dark:text-horizon-300">
            Check your inbox for a reset link.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
                <Mail size={16} className="text-ink/40" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-sunset-500">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-horizon-gradient py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
