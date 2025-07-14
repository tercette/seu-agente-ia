import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const { token } = router.query

    useEffect(() => {
        if (token === undefined) return // ainda carregando
        if (!token) {
            setError('Link de recuperação inválido')
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword: password }),
        })

        const data = await res.json()

        if (res.ok) {
            setMessage(data.message)
            setError('')
        } else {
            setError(data.error)
            setMessage('')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-extrabold mb-6">Redefinir Senha</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-700 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-semibold text-white">Nova Senha</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-4 py-2 mt-2 rounded-md border border-slate-500 bg-slate-600 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white">Confirmar Nova Senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full px-4 py-2 mt-2 rounded-md border border-slate-500 bg-slate-600 text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4"
                >
                    Alterar Senha
                </button>
            </form>

            {message && <p className="mt-4 text-green-400">{message}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    )
}
