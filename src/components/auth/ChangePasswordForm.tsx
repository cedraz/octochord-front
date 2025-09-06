import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function ChangePasswordForm() {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const baseUrl = import.meta.env.VITE_API_URL

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault()
        setIsSubmitting(true)

        if (newPassword != confirmPassword) {
            toast.error("Your passwords don't match.");
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/auth/change-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
                body: JSON.stringify({ oldPassword, newPassword })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error("API error:", errorData)
                throw new Error("Password change failed.")
            }

            toast.success("Password changed successfully!")
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")

        } catch (err) {
            toast.error("Unexpected error.")
            console.error(err)

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div>
                <Label htmlFor="oldPassword">Current password</Label>
                <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="newPassword">New password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}> {isSubmitting ? "..." : "Change password"}</Button>
        </form>
    )
}