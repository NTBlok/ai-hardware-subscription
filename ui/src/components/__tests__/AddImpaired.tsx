// /* eslint-env jest */
import { render, screen, waitFor } from '@testing-library/react'
import AddImpaired from "../add-impaired";


function Wrapper(props:any) {
  return <AddImpaired open={true} handleClose={jest.fn} {...props} />
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    };
  },
}));

describe('<AddImpaired', () => {
  it('should render a button to open modal to add impaired', () => {
    render(<Wrapper />);
    expect(screen.queryByTestId('header-container-add-button')).toBeInTheDocument();
    expect(screen.queryByTestId('add-impaired-modal')).toBeInTheDocument();
    // screen.debug();
  });

});
