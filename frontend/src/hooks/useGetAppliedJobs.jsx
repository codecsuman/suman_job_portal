import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;

        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(
                    APPLICATION_API_END_POINT,
                    {
                        withCredentials: true,
                    }
                );

                if (isMounted && res.data.success) {
                    dispatch(
                        setAllAppliedJobs(res.data.applications)
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to fetch applied jobs:",
                    error?.response?.data?.message || error.message
                );
            }
        };

        fetchAppliedJobs();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);
};

export default useGetAppliedJobs;