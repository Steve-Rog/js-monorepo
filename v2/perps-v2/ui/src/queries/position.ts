import { useQuery } from '@tanstack/react-query';
import { PERPS_V2_DASHBOARD_GRAPH_URL } from '../utils/constants';
import { FuturePosition } from './positions';

const gql = (data: TemplateStringsArray) => data[0];
const query = gql`
  query FuturesPosition($id: String) {
    futuresPosition(id: $id) {
      id
      account
      isLiquidated
      market
      isOpen
      openTimestamp
      closeTimestamp
      margin
      initialMargin
      entryPrice
      lastPrice
      pnl
      exitPrice
      leverage
      size
      long
      trades
      totalVolume
      feesPaidToSynthetix
    }
  }
`;

export function useGetPosition(id: string) {
  return useQuery(
    ['position', id],
    async () => {
      const response = await fetch(PERPS_V2_DASHBOARD_GRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { id },
        }),
      });
      const {
        data,
      }: {
        data: {
          futuresPosition: FuturePosition;
        };
      } = await response.json();
      return data;
    },
    { enabled: !!id }
  );
}
