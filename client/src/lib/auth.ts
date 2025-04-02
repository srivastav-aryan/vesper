import supabase from "@/config/supabase";

export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout Error:", error);
};

// export const signInWithGoogle = async () => {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
    
//   });
//   if (error) console.error("Google Auth Error:", error);
//   return data;
// };