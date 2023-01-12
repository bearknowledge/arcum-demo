import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "src/contexts/AuthUserContext";

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { authUser, authLoading } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (router.isReady && !authLoading) {
            if (authUser) {
                setLoading(false);
            } else {
                router.push(`/login`);
            }
        }
    }, [router, router.isReady, authUser, authLoading]);

    if (loading) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
