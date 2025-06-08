import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {useEffect} from "react";
import {AuthResponse} from "@/app/authApi";
import {setUser} from "@/app/appSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.app);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser: AuthResponse = JSON.parse(storedUser || "{}");
      if (storedUser) {
        dispatch(setUser(parsedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, [dispatch]);

  return {
    isLoggedIn: user && (user.token !== null),
    name: user?.name,
    email: user?.email,
  }
}