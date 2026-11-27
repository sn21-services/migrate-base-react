export type TypeAuthProfile = {
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other';
};

export type UserInfoType = Omit<TypeAuthProfile, 'password'> & {
  accessToken: string;
  refreshToken: string;
};

export type TypeLogin = {
  username: string;
  password: string;
  expiresInMins: number;
};

export type LoginResponseType = {
  id: number;
  username: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  image: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
  expiresInMins?: number;
};
