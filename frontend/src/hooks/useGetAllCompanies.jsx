import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          {
            withCredentials: true,
          }
        );

        if (isMounted && res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.error(
          "Failed to fetch companies:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchCompanies();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useGetAllCompanies;