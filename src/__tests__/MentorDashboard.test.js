import React from 'react';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import HomeContainer from '../components/pages/Home/HomeContainer';
import createTestStore from '../__mocks__/CreateTestStore';
import { Provider } from 'react-redux';
import SkeletonLoadingComponent from '../components/common/SkeletonLoading';
import Sidebar from '../components/common/Sidebar/Sidebar.js';

afterEach(cleanup);
let store;
jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true,
      },
      authService: {
        getUser: jest.fn(() => {
          return Promise.resolve({
            sub: '00ultwqjtqt4VCcS24x6',
            name: 'Test004 User',
            email: 'llama004@maildrop.cc',
            preferred_username: 'llama004@maildrop.cc',
            role: 3,
          });
        }),
      },
    };
  },
}));
jest.mock('../state/actions/index', () => ({
  getUserProfile: jest.fn(() => {
    return {
      type: 'USER_PROFILE',
      payload: {
        sub: '00ultwqjtqt4VCcS24x6',
        name: 'Test004 User',
        email: 'llama004@maildrop.cc',
        preferred_username: 'llama004@maildrop.cc',
        role: 3,
      },
    };
  }),
}));

describe('<HomeContainer /> test suite for mentee role', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  beforeEach(() => {
    localStorage.clear();
    store = createTestStore();
    localStorage.setItem('theme', 'dark');
  });
  test('it renders Mentor Dashboard and Sidebar if role_id is 3', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <HomeContainer
            LoadingComponent={() => <SkeletonLoadingComponent />}
            Sidebar={() => <Sidebar />}
          />
        </Provider>
      );
    });
    const schedule = await screen.findByText(/Schedule/i);
    expect(schedule).toBeTruthy();
  });
  test('it renders Calendar component', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <HomeContainer
            LoadingComponent={() => <SkeletonLoadingComponent />}
            Sidebar={() => <Sidebar />}
          />
        </Provider>
      );
    });
    await waitFor(() => {
      const calendar = document.getElementsByClassName('calendar');
      expect(calendar).toBeTruthy();
    });
  });
  test('Sidebar dropdown menu displays proper menus on click', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <HomeContainer
            LoadingComponent={() => <SkeletonLoadingComponent />}
            Sidebar={() => <Sidebar />}
          />
        </Provider>
      );
    });
    const schedule = await screen.findByText(/Schedule/i);
    userEvent.click(schedule);
    const account = await screen.findByText(/Account/i);
    userEvent.click(account);
    const resources = await screen.findByText(/Resources/i);
    userEvent.click(resources);


    const calendar = await screen.findByText(/Calendar/i);
    const scheduleMeeting = await screen.findByText(/Schedule Meeting/i);

    const requestResources = await screen.findByText(/Request Resources/i);
    const trackResources = await screen.findByText(/Track Resources/i);


    const profileSettings = await screen.findByText(/Profile Settings/i);
    const accountSettings = await screen.findByText(/Account Settings/i);
    const logout = await screen.findByText(/Log Out/i);


    expect(calendar).toBeTruthy();
    expect(scheduleMeeting).toBeTruthy();
    expect(requestResources).toBeTruthy();
    expect(trackResources).toBeTruthy();
    expect(profileSettings).toBeTruthy();
    expect(accountSettings).toBeTruthy();
    expect(logout).toBeTruthy();
  });
  test('Proper component renders on click', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <HomeContainer
            LoadingComponent={() => <SkeletonLoadingComponent />}
            Sidebar={() => <Sidebar />}
          />
        </Provider>
      );
    });

    const schedule = await screen.findByText(/Schedule/i);
    userEvent.click(schedule);
    const account = await screen.findByText(/Account/i);
    userEvent.click(account);
    const resources = await screen.findByText(/Resources/i);
    userEvent.click(resources);

    // testing for Schedule Meeting comp to render
    const scheduleMeeting = await screen.findByText(/Schedule Meeting/i);
    userEvent.click(scheduleMeeting);
    
    await waitFor(() => {
      const scheduleMeetingComponent = screen.findByText(
        /"Schedule Meeting"/i
      );
      expect(scheduleMeetingComponent).toBeTruthy();
    });

    // testing for my mentees comp to render
    const myMentees = await screen.findByText(/My Mentees/i);
    userEvent.click(myMentees);

    await waitFor(() => {
      const myMenteesComponent = screen.findByText(
        /"My Mentees" Component goes here/i
      );
      expect(myMenteesComponent).toBeTruthy();
    });

    // testing for request resources comp to render
    const requestResources = await screen.findByText(/Request Resources/i);
    userEvent.click(requestResources);

    await waitFor(() => {
      const requestResourcesComponent = screen.findByText(
        /"Request Resources" Component goes here/i
      );
      expect(requestResourcesComponent).toBeTruthy();
    });

    const trackResources = await screen.findByText(/Track Resources/i);
    userEvent.click(trackResources);

    await waitFor(() => {
      const trackResourcesComponent = screen.findByText(
        /"Track Resources" Component goes here/i
      );
      expect(trackResourcesComponent).toBeTruthy();
    });

    //tests for profile settings comp to render
    //TODO: FOR SOME REASON THERE IS A MEMORY LEAK HERE, NOT SURE HOW TO FIX
    const profileSettings = await screen.findByText(/Profile Settings/i);
    await waitFor(() => {
      userEvent.click(profileSettings);
      const profileSettingsComponent = document.getElementsByClassName(
        'flexContainer'
      );
      expect(profileSettingsComponent).toBeTruthy();
    });

    //tests for account settings comp to render
    const accountSettings = await screen.findByText(/Account Settings/i);
    userEvent.click(accountSettings);

    const accountSettingsComponent = await screen.findByText(
      /Do we need Account settings?/i
    );
    expect(accountSettingsComponent).toBeTruthy();
  });

  test('Tests darkmode functionallity for user role', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <HomeContainer
            LoadingComponent={() => <SkeletonLoadingComponent />}
          />
        </Provider>
      );
    });
      const darkModeToggleBtn = await screen.findByRole("switch");
      const darkModeToggleBtnClass = document.getElementsByClassName("ant-switch ant-switch-small ant-switch-checked");
      expect(darkModeToggleBtn).toBeInTheDocument();
      expect(darkModeToggleBtnClass).toBeTruthy();
      expect(localStorage.theme).toBe('dark');

      userEvent.click(darkModeToggleBtn);

      await waitFor(()=> {
        const darkModeToggleBtnClass = document.getElementsByClassName("ant-switch ant-switch-small ant-switch");
        expect(darkModeToggleBtnClass).toBeTruthy();
        expect(localStorage.theme).toBe('light');
      });
  });
});
