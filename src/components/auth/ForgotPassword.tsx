import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch("https://octochord.onrender.com/user/recover-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            if (!res.ok) {
                alert("Invalid email.")
                return
            }

            alert("Check your email.")

        } catch (err) {
            console.log("Something went wrong.")
            alert("Something went wrong.")

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and we'll send you a reset link.
                        </p>

                        <Input
                            type="email"
                            placeholder="Enter your email."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                        <Button type="submit" className="w-full mt-4">  {isSubmitting ? "Sending..." : "Submit"}</Button>
                    </form>
                </section>

            </div>

        </div>
    )
}