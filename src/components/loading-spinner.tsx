"use client"

import { useLoading } from "@/context/loading-context"

export function LoadingSpinner() {
    const { isLoading } = useLoading()

    if (!isLoading) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative flex flex-col items-center gap-4">

                <div className="relative h-24 w-24">

                    <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>


                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-l-purple-500 animate-spin bg-gradient-to-tr from-indigo-500 to-purple-500 [mask-image:linear-gradient(transparent,white)]"></div>


                    <div className="absolute inset-4 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]"></div>
                    </div>


                    <div className="absolute inset-0 animate-spin [animation-duration:3s]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 h-3 w-3 rounded-full bg-indigo-400 blur-[1px] shadow-[0_0_10px_#818cf8]"></div>
                    </div>
                    <div className="absolute inset-0 animate-spin [animation-duration:2s] [animation-direction:reverse]">
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-purple-400 blur-[1px]"></div>
                    </div>
                </div>


                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold text-white tracking-widest animate-pulse">Procesando...</h3>
                    <p className="text-xs text-indigo-200/70 font-mono">Obteniendo datos del video...</p>
                </div>
            </div>
        </div>
    )
}
