import useAxios from "axios-hooks";

interface Location {
  id: number;
  name: string;
}

interface LocationTableFromAPIProps {
  apiURL?: string
}

interface GetLocationsLocation {
  id: number;
  name: string;
}

export const useLocation = ({ apiURL = "http://localhost:8088/locations" }) => {
  const [
    { data: locationsData, loading: locationsLoading, error: locationsError },
    refetchGet
  ] = useAxios<GetLocationsLocation[]>(
    apiURL
  )
  const getLocationsData = () => {
    refetchGet()
  }
  return { getLocationsData, locationsData, locationsLoading, locationsError }
}