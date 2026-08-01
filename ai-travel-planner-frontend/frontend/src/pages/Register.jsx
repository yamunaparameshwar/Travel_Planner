import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Compass } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (data) => {
    const res = await registerUser(data)
    if (res.success) navigate('/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-dusk-gradient px-5 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-glass-lg dark:bg-ink-800">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sunset-gradient text-white">
            <Compass size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink dark:text-sand">Create your account</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-sand-300/70">Start planning trips with AI in a minute.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">Full name</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
              <User size={16} className="text-ink/40" />
              <input
                placeholder="Jordan Lee"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-sunset-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">Username</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
              <User size={16} className="text-ink/40" />
              <input
                placeholder="jordanlee"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
                {...register('username', { required: 'Username is required' })}
              />
            </div>
            {errors.username && <p className="mt-1 text-xs text-sunset-500">{errors.username.message}</p>}
          </div>

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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
              <Lock size={16} className="text-ink/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={16} className="text-ink/40" /> : <Eye size={16} className="text-ink/40" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-sunset-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">Confirm password</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
              <Lock size={16} className="text-ink/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-sunset-500">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-sunset-gradient py-3 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60 dark:text-sand-300/70">
          Already have an account?{' '}
          <NavLink to="/login" className="font-semibold text-horizon-500">
            Log in
          </NavLink>
        </p>
      </div>
    </div>
  )
}
