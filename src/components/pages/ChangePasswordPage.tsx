import ChangePasswordForm from "../auth/ChangePasswordForm";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function ChangePasswordPage() {
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    )
}
