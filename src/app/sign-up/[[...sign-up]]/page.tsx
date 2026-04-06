import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      {/* 背景 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oracle-900/60 via-oracle-950 to-oracle-950"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[500px] w-[500px] rounded-full
          bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.06)_0%,transparent_70%)]"
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">天職神託</h1>
          <p className="mt-2 text-sm text-divine-300/60">星の導きとともに、新たな旅を始める</p>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorPrimary: '#d4a853',
              colorBackground: '#050b14',
              colorText: '#eef0fc',
              colorTextSecondary: '#dde1f8',
              colorInputBackground: '#0a1628',
              colorInputText: '#eef0fc',
              borderRadius: '0.75rem',
            },
            elements: {
              card: 'bg-oracle-900/80 border border-gold-700/30 shadow-[0_0_40px_rgba(212,168,83,0.1)] backdrop-blur-md',
              headerTitle: 'text-divine-100 font-serif',
              headerSubtitle: 'text-divine-300/60',
              formButtonPrimary: 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-oracle-950 font-semibold hover:opacity-90',
              formFieldInput: 'bg-oracle-800/80 border-oracle-600 text-divine-100 focus:border-gold-500',
              footerActionLink: 'text-gold-400 hover:text-gold-300',
              identityPreviewText: 'text-divine-200',
              identityPreviewEditButton: 'text-gold-400',
            },
          }}
        />
      </div>
    </main>
  );
}
