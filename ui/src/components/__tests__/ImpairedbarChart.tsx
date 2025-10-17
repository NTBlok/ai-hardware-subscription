import { render, screen } from '@testing-library/react';
import ImpairedBarChart from '../impaired-barChart';
import { useImpaired } from '../impaired-table';

function Wrapper(props:any) {
  return <ImpairedBarChart />
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    };
  },
}));


const mockedGetData = [
  {
    description: "Not powering up.",
    id: 1,
    impaired_date: "2022-12-27T18:00:00",
    location_name: "Lear Labs West Colorado Warehouse",
    resolved: false,
    resoved_date: null,
    serial: "SHAPE-0042"
  },
  {
    description: "Screen flickering.",
    id: 2,
    impaired_date: "2022-12-28T18:30:00",
    location_name: "Lear Labs West Colorado Warehouse",
    resolved: false,
    resoved_date: null,
    serial: "SHAPE-0043"
  }
];
const mockGetLoading = true;
const mockConfig = {
  getImpairedData: jest.fn(() => ({ mockedGetData, mockGetLoading, undefined })),
  getData: mockedGetData,
  getLoading: mockGetLoading,
  getError: undefined
};
jest.mock("../impaired-table", () => ({
  useImpaired: () => mockConfig
}));

describe('Impaired Bar Chart', () => {
  it('should render in a loading state', () => {
      render(<ImpairedBarChart />);
      const loadingElement = screen.queryByText('Chart Loading...');
      expect(loadingElement).toBeInTheDocument();
  });
});

