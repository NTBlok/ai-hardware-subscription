import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useAxios from 'axios-hooks';
import axios, { AxiosError } from 'axios';

interface Asset {
    id: number;
    name: string;
    serial: string;
    subscription_name: string;
    location_name: string;
    impaired: 'NO' | 'YES';
}

interface AssetTableFromAPIProps {
    apiURL?: string;
    getData: GetAssetsAsset[] | undefined;
    getLoading: boolean | undefined;
    getError: AxiosError<any, any> | null;
}

interface GetAssetsAsset {
    id: number;
    name: string;
    serial: string;
    subscription_name: string;
    location_name: string;
    impaired: 0 | 1;
}

interface PostAssetProps {
  subscription_id: number | undefined;
  location_id: number | undefined;
  name: string;
  serial: string;
}

export const useAssets = ({ apiURL = "http://localhost:8088/assets" }) => {
  const [
    { data:assetsData, loading: getAssetsLoading, error: getAssetsError },
    refetchGet
  ] = useAxios<GetAssetsAsset[]>(
    apiURL
  )
  const getAssetsData = () => {
    refetchGet()
  }

  return { getAssetsData, assetsData, getAssetsLoading, getAssetsError }
}

export const usePostAsset = ({ apiURL = "http://localhost:8088/asset"  }) => {
  const [
    { data: postAsset, loading: postAssetLoading, error: postAssetError },
    executePost
  ] = useAxios(
    {
      url: apiURL,
      method: 'POST'
    },
    { manual: true }
  )
  const postAssetData = (assetData:PostAssetProps) => {
    executePost({
      data: {
        ...assetData
      }
    })
  }

  return { postAssetData, postAsset, postAssetLoading, postAssetError }
}

export default function AssetTableFromAPI(
  { 
    getData,
    getLoading,
    getError 
  }: AssetTableFromAPIProps) {

    if (getLoading) return <p>Loading...</p>
    if (getError) return <p>Error!</p>
    if (getData) {
        const assets: Asset[] =
            getData.map(asset => (
                {
                    id: asset.id,
                    name: asset.name,
                    serial: asset.serial,
                    subscription_name: asset.subscription_name,
                    location_name: asset.location_name,
                    impaired: asset.impaired === 0 ? 'NO' : 'YES'
                }
            ))
        return (
            <AssetTable assets={assets} />
        );
    }

    return (
        <p>Loading...</p>
    );
}

interface AssetTableProps {
    assets: Asset[];
}

export function AssetTable({ assets }: AssetTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{
                        backgroundColor: "#80808033"
                    }}>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Serial</TableCell>
                        <TableCell>Subscription</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Impaired?</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assets.map((asset) => (
                        <TableRow
                            key={asset.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {asset.id}
                            </TableCell>
                            <TableCell>{asset.name}</TableCell>
                            <TableCell>{asset.serial}</TableCell>
                            <TableCell>{asset.subscription_name}</TableCell>
                            <TableCell>{asset.location_name}</TableCell>
                            <TableCell>{asset.impaired}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
