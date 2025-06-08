import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {ApiResponse} from "@/types";

type LoginPayload = {
  email: string;
  password: string;
}

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    updated_at: string;
    created_at: string;
  },
  token: string
};

export type LoginResponse = {
  user: {
    id: number;
    role: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    updated_at: string;
    created_at: string;
  },
  token: string
};

export type AuthResponse = {
  name: string;
  email: string;
  role: string;
  id: number;
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': "application/json"
    }
  }),
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        }
      }),
      transformResponse: (response: ApiResponse<LoginResponse>) => {
        if (response.status !== 'success') {
          throw new Error(response.message);
        }
        return {
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          id: response.data.user.id,
          token: response.data.token,
        }
      },
    }),
    register: build.mutation<AuthResponse, RegisterPayload>({
      query: (credentials) => ({
        url: 'register',
        method: 'POST',
        body: {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          password_confirmation: credentials.password,
        }
      }),
      transformResponse: (response: ApiResponse<RegisterResponse>) => {
        if (response.status !== 'success') {
          throw new Error(response.message);
        }
        return {
          name: response.data.user.name,
          email: response.data.user.email,
          role: 'user',
          id: response.data.user.id,
          token: response.data.token,
        }
      },
    }),
  }),
});

export const {useLoginMutation, useRegisterMutation} = authApi;