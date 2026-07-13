export type TypeAuthProfile = {
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other';
};

export type UserInfoType = Omit<TypeAuthProfile, 'password'> & {
  accessToken: string;
};
