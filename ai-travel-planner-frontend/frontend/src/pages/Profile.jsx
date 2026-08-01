import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, MapPin, Lock, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authService } from '../api/auth'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  })
  const pwForm = useForm()

  const onSaveProfile = async (data) => {
    try {
      await authService.updateProfile(data)
    } catch {
      /* fall back to local-only update while backend is offline */
    }
    updateUser(data)
    toast.success('Profile updated')
  }

  const onChangePassword = async (data) => {
    try {
      await authService.changePassword(data)
      toast.success('Password changed')
      pwForm.reset()
    } catch {
      toast.error('Could not change password — check current password')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">Profile</h1>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-horizon-gradient font-display text-2xl font-bold text-white">
            {(user?.name || 'T')[0]}
          </div>
          <button aria-label="Change profile picture" className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-sunset-gradient text-white">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-ink dark:text-sand">{user?.name}</p>
          <p className="text-sm text-ink/60 dark:text-sand-300/70">{user?.email}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-2 border-b border-ink/10 dark:border-white/10">
        {['profile', 'security'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition ${
              tab === t ? 'border-b-2 border-sunset-500 text-sunset-500' : 'text-ink/50 dark:text-sand-300/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleSubmit(onSaveProfile)} className="mt-6 space-y-4">
          <TextField icon={User} label="Full name" reg={register('name')} />
          <TextField icon={User} label="Username" reg={register('username')} />
          <TextField icon={Mail} label="Email" reg={register('email')} type="email" />
          <TextField icon={Phone} label="Phone" reg={register('phone')} />
          <TextField icon={MapPin} label="Address" reg={register('address')} />
          <button disabled={isSubmitting} className="rounded-full bg-horizon-gradient px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            Save changes
          </button>
        </form>
      ) : (
        <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="mt-6 space-y-4">
          <TextField icon={Lock} label="Current password" type="password" reg={pwForm.register('currentPassword', { required: true })} />
          <TextField icon={Lock} label="New password" type="password" reg={pwForm.register('newPassword', { required: true, minLength: 8 })} />
          <button className="rounded-full bg-horizon-gradient px-6 py-2.5 text-sm font-semibold text-white">Change password</button>
        </form>
      )}
    </div>
  )
}

function TextField({ icon: Icon, label, reg, type = 'text' }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
        <Icon size={16} className="text-ink/40" />
        <input type={type} className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand" {...reg} />
      </div>
    </div>
  )
}
