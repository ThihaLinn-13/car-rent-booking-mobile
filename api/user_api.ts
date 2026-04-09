import { superbase } from "@/lib/superbase";
import { AddUser, User } from "@/types/user";

export const addUser = async (user: AddUser): Promise<User | null> => {
  const { data, error } = await superbase
    .from("user")
    .insert([
      {
        name: user.name,
        email: user.email,
        img_url: user.img_url,
      },
    ])
    .select("id, name, email, img_url")
    .single();

  if (error) {
    console.error("Error Creating user:", error.message);
    return null;
  }

  return data as User;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data: user, error: userError } = await superbase
    .from("user")
    .select(
      `
      id,
      name,
      email,
      img_url,
      user_role (
        role:role_id (
          name
        )
      )
    `,
    )
    .eq("email", email)
    .maybeSingle();

  if (userError) {
    console.error("Error fetching user by email:", userError.message);
    return null;
  }

  if (!user) return null;

  const roles =
    user.user_role?.map((ur: any) => ur.role?.name).filter(Boolean) || [];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    img_url: user.img_url,
    role: roles,
  } as User;
};
