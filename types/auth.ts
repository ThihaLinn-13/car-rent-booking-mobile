export type GoogleUser = {
  id: string;
  aud: "authenticated";
  role: "authenticated";
  email: string;
  phone: string | null;
  is_anonymous: boolean;

  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;

  app_metadata: {
    provider: "google";
    providers: string[];
  };

  user_metadata: {
    full_name: string;
    name: string;
    email: string;
    email_verified: boolean;
    avatar_url: string;
    picture: string;
    phone_verified: boolean;
    iss: string;
    provider_id: string;
    sub: string;
  };

  identities: unknown[][];
};
