/* eslint-disable @typescript-eslint/naming-convention */
export type GetAccessTokenOpts = {
  waitForToken?: boolean;
};

export type LoginStep = 'init';

export type RequestSignInOpts = {
  identifier?: string;
  auto_sign_in?: boolean;
  init_data?: Record<string, any>;
  post_login_redirect?: string;
  login_step?: LoginStep;
  include_user_data?: boolean;
};

export type RequestFieldsOpts = {
  fields: string[];
  buttonText: string;
  questionText: string;
};

export type ExternalApiSpec = {
  [key: string]: any;
  requestSignIn: (opts: RequestSignInOpts) => void;
  requestFields: (opts: RequestFieldsOpts) => void;
  signOut: () => void;
  getAccessToken: (opts: GetAccessTokenOpts) => Promise<string | null | undefined>;
  acls: {
      get: () => any;
  };
  events: any;
  auth: {
      token: () => string;
      isVerifiedUser: () => boolean;
  };
  user: {
      get: () => any;
      getValue: (key: string) => any;
      set: (data: {[key: string]: any}) => Promise<any>;
      setValue: (key: string, value: any) => Promise<any>;
      uploadFile: (field: string, file: File) => Promise<any>;
      manageAccount: () => void;
  };
  questions: {
      trigger: (questionId: string) => void;
  };
  LoginStep: Record<string, LoginStep>;
};

export type PostAuthApiSpec = {
  method: 'post' | 'put';
  url: string;
  extra_headers: { [key: string]: string };
  timeout: number;
};

export type PostSignOutApiSpec = {
  method: 'post' | 'put';
  url: string;
  extra_headers: { [key: string]: string };
};

export type PostUserDataUpdateApiSpec = {
  method: 'post' | 'put';
  url: string;
  extra_headers: { [key: string]: string };
};

export interface IRowndClient {
  requestSignIn(opts?: RequestSignInOpts): void;
  signOut(): void;
  getAccessToken(opts?: GetAccessTokenOpts): Promise<string | null | undefined>;
}
