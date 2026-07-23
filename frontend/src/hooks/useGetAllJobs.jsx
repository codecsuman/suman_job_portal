import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery, jobFilters } = useSelector((store) => store.job);

  useEffect(() => {
    let isMounted = true;

    const fetchAllJobs = async () => {
      try {
        // 🔧 FIXED: previously only ever sent `keyword`. Now also sends the
        // structured filters from FilterCard.jsx, matching exactly what the
        // backend's getAllJobs controller expects.
        const params = { keyword: searchedQuery || "" };

        if (jobFilters.location) params.location = jobFilters.location;
        if (jobFilters.category) params.category = jobFilters.category;
        if (jobFilters.jobType) params.jobType = jobFilters.jobType;
        if (jobFilters.experienceMin != null)
          params.experienceMin = jobFilters.experienceMin;
        if (jobFilters.experienceMax != null)
          params.experienceMax = jobFilters.experienceMax;
        if (jobFilters.salaryMin != null)
          params.salaryMin = jobFilters.salaryMin;
        if (jobFilters.salaryMax != null)
          params.salaryMax = jobFilters.salaryMax;

        const res = await axios.get(`${JOB_API_END_POINT}/get`, {
          params,
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
  }, [dispatch, searchedQuery, jobFilters]);
};

export default useGetAllJobs;
