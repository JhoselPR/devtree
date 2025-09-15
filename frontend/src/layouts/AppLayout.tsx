import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeAPI";
import { Navigate } from "react-router-dom";
import DevTree from "../components/DevTree";

export default function AppLayout() {
    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        refetchOnWindowFocus: false,
    })

    if (isLoading) return <div>Cargando...</div>
    if (isError) return <Navigate to="/auth/login" />
    if (data) return (
        <DevTree data={data} />
    )
}