import { useState } from "react";
import { apiFetch } from "@/utils/apiFetch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { InputOTP } from "../ui/input-otp";


export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [code, setCode] = useState("")
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const baseUrl = import.meta.env.VITE_API_URL
    // 1st step: sending one-time-code
    async function handleOneTimeCode(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true)

        try {

            //Ícaro - start
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 5 segundos

            const response = await fetch(`${baseUrl}/one-time-code/create-one-time-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: email, type: "PASSWORD_RESET" }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            //Ícaro - end
            const data = await response.json();

            if (!response.ok) {
                alert("Invalid credentials. Check your email and try again.")
                console.log(response)
                return
            }
            console.log('resposta do back-end:', data)

            alert("Code sent! Check your email.")
            setStep(2)

        } catch (err) {
            console.log(err);
            alert("Something went wrong.")
        } finally {
            setIsSubmitting(false);
        }
    }

    // 2nd step: validating code
    async function handleCodeValidation(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true)

        try {

            const response = await fetch(`${baseUrl}/one-time-code/validate-one-time-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: email, type: "PASSWORD_RESET", code })
            })

            const data = await response.json();

            if (!response.ok) {
                alert("Invalid code. Try again.");
                return;
            }

            // saving JWT token with sessionStorage instead of useState (safier)
            if (data?.token) {
                sessionStorage.setItem("resetToken", data.token);
                alert("Code validated! You can now reset your password.");
                setStep(3);
            } else {
                alert("No token received.")
                console.log(data)
            }

        } catch (err) {
            console.log(err)
            alert("Something went wrong.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // 3rd step: reseting password
    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        try {

            const resetToken = sessionStorage.getItem("resetToken");

            if (!resetToken) {
                alert("Token is missing. Please start over.");
                setStep(1)
                return;
            }

            const response = await fetch(`${baseUrl}/user/recover-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resetToken}`,
                },
                body: JSON.stringify({ email, password: newPassword })
            })

            if (!response.ok) {
                alert("Password reset failed. Try again.");
                return;
            }

            alert("New password has successfully been set! You can now login.")
            setEmail("");
            setCode("");
            setNewPassword("");
            sessionStorage.removeItem("resetToken");
            setStep(1);

        } catch (err) {
            console.log(err)
            alert("Something went wrong.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {step === 1 && (
                        <form onSubmit={handleOneTimeCode} className="space-y-4 max-w-sm mx-auto mt-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
                            <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset code.</p>
                            <Input
                                type="email"
                                placeholder="Enter your email."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                            <Button type="submit" className="w-full mt-4">  {isSubmitting ? "Sending..." : "Submit"}</Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleCodeValidation} className="space-y-4 max-w-sm mx-auto mt-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter your code</h2>
                            <Input
                                type="text"
                                placeholder="Enter your code."
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required />
                            <Button type="submit" className="w-full mt-4">  {isSubmitting ? "Validating..." : "Submit"}</Button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4 max-w-sm mx-auto mt-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a new password</h2>
                            <Input
                                type="password"
                                placeholder="Enter your new password."
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Reseting..." : "Reset password"}
                            </Button>
                        </form>
                    )}
                </section>
            </div>
        </div>
    )
}