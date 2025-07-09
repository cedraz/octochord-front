import { useState } from "react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { EyeOff, Eye, Github } from "lucide-react"
import Cookies from "js-cookie"

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()

        console.log(email, password)
        try {
            const res = await fetch("https://octochord.onrender.com/auth/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                alert("Invalid login credentials.")
                return
            }

            const data = await res.json()

            // js-cookies
            Cookies.set("accessToken", data.accessToken),
                Cookies.set("refreshToken", data.refreshToken)

            console.log("Login succeeded.")
        } catch (err) {
            console.log("Login failed.", err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Github className="h-12 w-12 text-gray-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">GitTracker</h1>
                    <p className="text-muted-foreground">Track your GitHub activity in real-time</p>
                </div>

                <section className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <header className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter">Welcome</h1>
                        <p className="text-muted-foreground">Sign in to your account or create a new one</p>
                    </header>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                            <TabsTrigger value="register">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-4">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                    />

                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="remember" />
                                        <Label htmlFor="remember">Remember me</Label>
                                    </div>
                                    <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Forgot password?</a>
                                </div>
                                <Button type="submit" className="w-full">Sign In</Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form className="space-y-4">
                                <div className="space-y-4">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="password"
                                        placeholder="Enter your full name"
                                        required />

                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                    />

                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Create a password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            required
                                        />
                                    </div>
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm your password"
                                        required
                                    />

                                </div>
                                <Button type="submit" className="w-full mt-4">Create Account</Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </section >
            </div >
        </div >
    )
}