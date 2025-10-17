import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import useAxios, { RefetchFunction } from "axios-hooks";
import { getEnvironmentData } from "worker_threads";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import theme from "src/theme";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface Impaired {
  id: number;
  location_name: string;
  serial: string;
  description: string;
  impaired_date: Date;
  resolved: "1" | "0";
  resolved_date: Date | undefined;
}

interface ImpairedTableFromAPIProps {
  apiURL?: string;
}

interface PatchImpaired {
  id: number;
  apiURL?: string;
}

interface GetImpairedAssetsImpaired {
  id: number;
  location_name: string;
  serial: string;
  description: string;
  impaired_date: Date;
  resolved: "1" | "0";
  resolved_date: Date | undefined;
}

interface PostImpairedAssetProps {
  asset_id: number | undefined;
  description: string;
}

export const useImpaired = ({
  apiURL = "http://localhost:8088/impaired-assets",
}) => {
  const [{ data: getData, loading: getLoading, error: getError }, refetchGet] =
    useAxios<GetImpairedAssetsImpaired[]>(apiURL);
  const getImpairedData = () => {
    refetchGet();
  };
  return { getImpairedData, getData, getLoading, getError };
};

export const usePostImpaired = ({
  apiURL = "http://localhost:8088/impaired",
}) => {
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: apiURL,
      method: "POST",
    },
    { manual: true }
  );
  const postImpairedData = (impairedAssetData: PostImpairedAssetProps) => {
    executePost({
      data: {
        ...impairedAssetData,
      },
    });
  };

  return { postImpairedData, postData, postLoading, postError };
};

export const patchImpairedResolved = async ({
  id,
  apiURL = "http://localhost:8088/impaired",
}: PatchImpaired): Promise<GetImpairedAssetsImpaired> => {
  const url = `${apiURL}/${id}`;
  return await axios.patch(url, { resolved: 1 });
};

export default function ImpairedTableFromAPI() {
  const { getImpairedData, getData, getLoading, getError } = useImpaired({});

  if (getLoading) return <p>Loading...</p>;
  if (getError) return <p>Error!</p>;

  const impairedAssets = getLoading
    ? []
    : getData
        ?.filter((impaired) => !impaired.resolved)
        .map((impaired) => ({
          id: impaired.id,
          location_name: impaired.location_name,
          serial: impaired.serial,
          description: impaired.description,
          impaired_date: impaired.impaired_date,
          resolved: impaired.resolved,
          resolved_date: impaired.resolved_date,
        }));

  if (impairedAssets) {
    return <ImpairedTable impairedAssets={impairedAssets} />;
  }
  return <p>Loading...</p>;
}

interface ImpairedTableProps {
  impairedAssets: Impaired[] | undefined;
}

export function ImpairedTable({ impairedAssets }: ImpairedTableProps) {
  const router = useRouter();

  const handleDeleteClicked = (
    event: React.SyntheticEvent<unknown>,
    id: number
  ) => {
    if (window.confirm("Are you sure you want to delete this impaired?")) {
      patchImpairedResolved({ id });
      router.reload();
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#80808033",
            }}
          >
            <TableCell>ID</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Serial</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {impairedAssets?.map((impaired) => (
            <TableRow
              key={impaired.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {impaired.id}
              </TableCell>
              <TableCell>{impaired.location_name}</TableCell>
              <TableCell>{impaired.serial}</TableCell>
              <TableCell>{impaired.description}</TableCell>
              <TableCell>
                {new Date(
                  new Date(impaired.impaired_date).toLocaleString() + " UTC"
                ).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  sx={{
                    float: "right",
                    color: "#757575",
                    backgroundColor: "white",
                    borderRadius: "50px",
                    "&:hover": {
                      backgroundColor: "white",
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                  onClick={(e) => handleDeleteClicked(e, impaired.id)}
                >
                  <DeleteForeverIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
