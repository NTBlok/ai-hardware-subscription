/* eslint-env jest */
import { render, screen } from '@testing-library/react'
import AddAsset from '../add-asset';


function Wrapper(props:any) {
  return <AddAsset open={true} handleClose={jest.fn} {...props} />
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    };
  },
}));

describe('<AddAsset', () => {
  it('should render a button to open modal to add asset', () => {
    render(<Wrapper />);
    expect(screen.queryByTestId('header-container-add-button')).toBeInTheDocument();
    expect(screen.queryByTestId('add-asset-modal')).toBeInTheDocument();
    // screen.debug();
  });

})