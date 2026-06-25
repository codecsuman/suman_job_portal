import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!companyId) return;

    let isMounted = true;

    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${companyId}`,
          {
            withCredentials: true,
          }
        );

        if (isMounted && res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.error(
          "Failed to fetch company:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchSingleCompany();

    return () => {
      isMounted = false;
    };
  }, [companyId, dispatch]);
};

export default useGetCompanyById;