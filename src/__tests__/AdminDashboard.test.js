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
            sub: '00ultx74kMUmEW8054x6',
            name: 'Test003 User',
            email: 'llama003@maildrop.cc',
            preferred_username: 'llama003@maildrop.cc',
            role: 2,
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
        sub: '00ultx74kMUmEW8054x6',
        name: 'Test003 User',
        email: 'llama003@maildrop.cc',
        preferred_username: 'llama003@maildrop.cc',
        role: 2,
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
  test('it renders Mentor Dashboard and Sidebar if role_id is 2', async () => {
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
    const scheduleInterview = await screen.findByText(/Schedule Interview/i);

    const assignResources = await screen.findByText(/Assign Resources/i);
    const trackResources = await screen.findByText(/Track Resources/i);

    const PendingApplications = await screen.findByText(/Pending Applications/i);
    const manageUsers = await screen.findByText(/Manage Users/i);
    const viewSupportRequests = await screen.findByText(/View Support Requests/i);
    const viewAllMeetings = await screen.findByText(/View All Meetings/i);



    const profileSettings = await screen.findByText(/Profile Settings/i);
    const accountSettings = await screen.findByText(/Account Settings/i);
    const logout = await screen.findByText(/Log Out/i);


    expect(calendar).toBeTruthy();
    expect(scheduleInterview).toBeTruthy();
    expect(assignResources).toBeTruthy();
    expect(trackResources).toBeTruthy();
    expect(PendingApplications).toBeTruthy();
    expect(manageUsers).toBeTruthy();
    expect(viewSupportRequests).toBeTruthy();
    expect(viewAllMeetings).toBeTruthy();
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
    const resources = await screen.findByText(/Resources/i);
    userEvent.click(resources);
    const account = await screen.findByText(/Account/i);
    userEvent.click(account);

    // testing for Schedule Interview comp to render
    const scheduleInterview = await screen.findByText(/Schedule Interview/i);
    userEvent.click(scheduleInterview);
    
    await waitFor(() => {
      const scheduleInterviewComponent = screen.findByText(
        /"Schedule Interview" Component goes here/i
      );
      expect(scheduleInterviewComponent).toBeTruthy();
    });

    // testing for Access Resources comp to render
    const assignResources = await screen.findByText(/Assign Resources/i);
    userEvent.click(assignResources);

    await waitFor(() => {
      const assignResourcesComponent = screen.findByText(
        /"Assign Resources" Component goes here/i
      );
      expect(assignResourcesComponent).toBeTruthy();
    });

    // testing for tracking res comp to render
    const trackResources = await screen.findByText(/Track Resources/i);
    userEvent.click(trackResources);

    await waitFor(() => {
      const trackResourcesComponent = screen.findByText(
        /"Track Resources" Component goes here/i
      );
      expect(trackResourcesComponent).toBeTruthy();
    });




    // testing for pending applications comp to render

    const pendingApplications = await screen.findByText(/Pending Applications/i);
    userEvent.click(pendingApplications);

    await waitFor(() => {
      const pendingApplicationsComponent = screen.findByText(
        /"Pending Applications" Component goes here/i
      );
      expect(pendingApplicationsComponent).toBeTruthy();
    });

    // testing for manage users comp to render
    const manageUsers = await screen.findByText(/Manage Users/i);
    userEvent.click(manageUsers);

    await waitFor(() => {
      const manageUsersComponent = screen.findByText(
        /"Manage Users" Component goes here/i
      );
      expect(manageUsersComponent).toBeTruthy();
    });

    // testing for view support request comp to render
    const supportRequests = await screen.findByText(/View Support Requests/i);
    userEvent.click(supportRequests);

    await waitFor(() => {
      const supportRequestsComponent = screen.findByText(
        /"Support Requests" Component goes here/i
      );
      expect(supportRequestsComponent).toBeTruthy();
    });

    // testing for view all meetings comp to render
    const viewAllMeetings = await screen.findByText(/View All Meetings/i);
    userEvent.click(viewAllMeetings);

    await waitFor(() => {
      const viewAllMeetingsComponent = screen.findByText(
        /"View Meetings" Component goes here/i
      );
      expect(viewAllMeetingsComponent).toBeTruthy();
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
