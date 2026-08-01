import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Compass } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../api/auth'

export default function ResetPassword() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      await authService.resetPassword({ token: params.get('token'), password: data.password })
      toast.success('Password updated — please log in')
      navigate('/login')
    } catch {
      toast.error('That reset link is invalid or expired')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-dusk-gradient px-5 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-glass-lg dark:bg-ink-800">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-horizon-gradient text-white">
            <Compass size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink dark:text-sand">Set a new password</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">New password</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
              <Lock size={16} className="text-ink/40" />
              <input
                type="password"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
                {...register('password', { required: true, minLength: 8 })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">Confirm password</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
              <Lock size={16} className="text-ink/40" />
              <input
                type="password"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
                {...register('confirmPassword', { validate: (v) => v === password || 'Passwords do not match' })}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-sunset-500">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-horizon-gradient py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
