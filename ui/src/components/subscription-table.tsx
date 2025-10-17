import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useAxios from 'axios-hooks';

interface Subscription {
    id: number;
    name: string;
    num_assets: number;
}

interface SubscriptionTableFromAPIProps {
    apiURL?: string
}

interface GetSubscriptionsSubscription {
    id: number;
    name: string;
    num_assets: number;
}

export const useSubscription = ({ apiURL = "http://localhost:8088/subscriptions" }) => {
  const [
    { data: subscriptionsData, loading: subscriptionsLoading, error: subscriptionsError },
    refetchGet
  ] = useAxios<GetSubscriptionsSubscription[]>(
    apiURL
  )
  const getSubscriptionsData = () => {
    refetchGet()
  }
  return { getSubscriptionsData, subscriptionsData, subscriptionsLoading, subscriptionsError }
}


export default function SubscriptionTableFromAPI(
  {
   apiURL = "http://localhost:8088/subscriptions" 
  }: SubscriptionTableFromAPIProps) {
    const { getSubscriptionsData, subscriptionsData, subscriptionsLoading, subscriptionsError } = useSubscription({});
    
    if (subscriptionsLoading) return <p>Loading...</p>
    if (subscriptionsError) return <p>Error!</p>
    if (subscriptionsData) {
        const subscriptions: Subscription[] =
            subscriptionsData.map(subscription => (
                {
                    id: subscription.id,
                    name: subscription.name,
                    num_assets: subscription.num_assets,
                }
            ))
        return (
            <SubscriptionTable subscriptions={subscriptions} />
        );
    }

    return (
        <p>Loading...</p>
    );
}

interface SubscriptionTableProps {
    subscriptions: Subscription[];
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{
                        backgroundColor: "#80808033"
                    }}>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right"># Assets</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subscriptions.map((subscription) => (
                        <TableRow
                            key={subscription.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {subscription.id}
                            </TableCell>
                            <TableCell>{subscription.name}</TableCell>
                            <TableCell align="right">{subscription.num_assets}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
