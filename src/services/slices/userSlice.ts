import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';

import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

type RejectValue = SerializedError | string;

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: RejectValue }
>('user/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(loginData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    } else {
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
});

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/registerUser',
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;

    localStorage.setItem('refreshToken', String(refreshToken));
    setCookie('accessToken', String(accessToken));

    return user;
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: RejectValue }
>('user/updateUser', async (user, { rejectWithValue }) => {
  try {
    const accessToken = getCookie('accessToken');
    const response = await updateUserApi(user);
    return response.user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    } else {
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectValue }
>('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    } else {
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
});

type TUserState = {
  isAuthenticated: boolean;
  loginError?: RejectValue;
  registerError?: RejectValue;
  data: TUser;
};

export const initialState: TUserState = {
  isAuthenticated: false,
  data: {
    name: '',
    email: ''
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerError = undefined;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.registerError = undefined;
          state.isAuthenticated = true;
          state.data = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.payload || action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loginError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.payload || action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.data = {
          email: '',
          name: ''
        };
      })

      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.data = action.payload;
      });
  }
});

export default userSlice.reducer;
