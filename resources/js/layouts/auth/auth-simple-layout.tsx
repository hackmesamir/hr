import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 dark:from-indigo-800 dark:via-purple-900 dark:to-pink-800">
            <div className="w-full max-w-md backdrop-blur-sm">
                {/* Simplified header without logo */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-white drop-shadow-md">{title}</h1>
                    {description && (
                        <p className="mt-2 text-sm text-white text-opacity-90">
                            {description}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
