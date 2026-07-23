import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    let isMounted = true;

    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          params: {
            keyword: searchedQuery || "",
          },
          withCredentials: true,
        });

        if (isMounted && res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error(
          "Failed to fetch jobs:",
          error?.response?.data?.message || error.message,
        );
      }
    };

    fetchAllJobs();

    return () => {
      isMounted = false;
    };
  }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;
