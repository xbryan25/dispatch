// Shared by the auth forms so login, register and resend stay visually identical.
export const authPageClass =
  'min-h-screen bg-background px-5 text-foreground selection:bg-indigo-200 selection:text-indigo-950 sm:px-8 dark:selection:bg-indigo-500/40 dark:selection:text-white';

export const authMainClass = 'flex w-full flex-1 justify-center pb-16 pt-12 sm:pt-20';

export const authInputClass =
  'h-11 rounded-xl border-border bg-background px-3.5 shadow-none placeholder:text-muted-foreground focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:bg-input/30 dark:focus-visible:border-indigo-400';

export const authLabelClass = 'font-medium text-foreground';

export const authSubmitClass =
  'h-12 w-full cursor-pointer rounded-xl bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:bg-stone-200 disabled:text-stone-500 disabled:opacity-100 dark:disabled:bg-stone-800 dark:disabled:text-stone-400';

// The vertical padding (cancelled by the negative margin) gives inline links a ~36px tap target.
export const authTextLinkClass =
  '-my-2 inline-block cursor-pointer py-2 rounded-sm font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background';
