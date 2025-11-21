import { useAuth } from "@/hooks/useAuth";
import { getStudents as getStudentsAPI } from "@/utils/api/app";
import { createContext, ReactNode, useEffect, useState } from "react";

interface Student {
    id: string;
    fullName: string;
    regNo: string;
    email: string;
    phone: string;
    course: string;
    year: number;
    level: string;
}

interface AppContextType {
    students: Student[];
    loading: boolean;
    loadStudents: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const { user, authChecked, logout } = useAuth();

    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const loadStudents = async () => {
        if (!user) return;

        setLoadingStudents(true);

        try {
            const res = await getStudentsAPI();
            setStudents(res.data || []);
            // console.log("Students loaded:", res.data);
            if (res.data) console.log('loading studnts')
        } catch (err: any) {
            console.error("Error loading students:", err);

            if (err.response?.status === 401) {
                console.log("Unauthorized → logging out");
                // logout(); // Uncomment if you want to auto-logout
            }
        } finally {
            console.log('finally completed')
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        if (authChecked && user) {
            loadStudents();
        }
    }, [authChecked, user]);

    return (
        <AppContext.Provider value={{ students, loadingStudents, loadStudents }}>
            {children}
        </AppContext.Provider>
    );
}
