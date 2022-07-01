import { useState, useEffect } from "react";
import { Loading } from "notiflix";

const useLoading = (initial?: boolean): [boolean, (status: boolean) => void] => {
    const [loading, setLoading] = useState(!!initial);

    const updateLoading = (status: boolean) => setLoading(status);

    useEffect(() => {
        if (loading) return Loading.circle('Loading...');

        Loading.remove();
    }, [loading]);

    return [loading, updateLoading]
};

export default useLoading;