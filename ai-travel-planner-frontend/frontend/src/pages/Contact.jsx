import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { contactService } from '../api/trips'

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await contactService.send(data)
      toast.success('Message sent — we will get back to you soon')
      reset()
    } catch {
      toast.error('Could not send right now — please try again later')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">Get in touch</h1>
      <p className="mt-2 max-w-lg text-ink/60 dark:text-sand-300/70">
        Questions about a trip in progress, a bug, or a partnership — send it over.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          <ContactRow icon={Mail} label="Email" value="hello@aitravelplanner.app" />
          <ContactRow icon={Phone} label="Phone" value="+1 (415) 555-0134" />
          <ContactRow icon={MapPin} label="Office" value="San Francisco, CA" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <input placeholder="Your name" className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-horizon-500 dark:border-white/15 dark:text-sand" {...register('name', { required: true })} />
              {errors.name && <p className="mt-1 text-xs text-sunset-500">Name is required</p>}
            </div>
            <div>
              <input type="email" placeholder="Your email" className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-horizon-500 dark:border-white/15 dark:text-sand" {...register('email', { required: true })} />
              {errors.email && <p className="mt-1 text-xs text-sunset-500">Email is required</p>}
            </div>
          </div>
          <input placeholder="Subject" className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-horizon-500 dark:border-white/15 dark:text-sand" {...register('subject')} />
          <textarea rows={5} placeholder="Your message" className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-horizon-500 dark:border-white/15 dark:text-sand" {...register('message', { required: true })} />
          {errors.message && <p className="-mt-2 text-xs text-sunset-500">Message is required</p>}
          <button disabled={isSubmitting} className="flex items-center gap-2 rounded-full bg-sunset-gradient px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            <Send size={15} /> {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 dark:border-white/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-horizon-50 text-horizon-600 dark:bg-white/5 dark:text-horizon-300">
        <Icon size={17} />
      </span>
      <div>
        <p className="text-xs text-ink/50 dark:text-sand-300/60">{label}</p>
        <p className="text-sm font-medium text-ink dark:text-sand">{value}</p>
      </div>
    </div>
  )
}
