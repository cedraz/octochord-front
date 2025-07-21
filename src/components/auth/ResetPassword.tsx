import { useSearchParams } from "react-router"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export default function ResetPassword() {
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token")

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handlePassword(e: React.FormEvent) {
        e.preventDefault();

        if (!token) {
            alert("Missing token.")
            return
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch("https://octochord.onrender.com/user/profile/change-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: newPassword })
            })

            if (!res.ok) {
                alert("Error setting new password.")
                return
            }

            alert("Password updated successfully!")

        } catch (err) {
            console.error(err)
            alert("Something went wrong.")

        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <form onSubmit={handlePassword} className="space-y-4 max-w-sm mx-auto mt-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
                        <p className="text-sm text-gray-900">Enter your new password below:</p>
                        <Input
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required />
                        <p className="text-sm text-gray-900">Confirm your password below:</p>
                        <Input
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required />

                        <Button type="submit" className="w-full mt-4">
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </section>
            </div>
        </div>
    )
}