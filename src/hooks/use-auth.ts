import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {useEffect} from "react";
import {AuthResponse} from "@/app/authApi";
import {setUser} from "@/app/appSlice";
import {useLocation, useNavigate, useSearchParams} from "react-router";

const protectedPaths = [
  '/bookings'
]

export function useAuth() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.app);

  useEffect(() => {
    const isLoggedIn = !!user && !!user.token;
    const redirect = searchParams.get("redirect");
    if(isLoggedIn && redirect !== null) {
      navigate(redirect);
    }

    for (const path of protectedPaths) {
      if (pathname.includes(path) && !isLoggedIn) {
        navigate(`/login?redirect=${path}`);
        break;
      }
    }
  }, [user, pathname, navigate, searchParams]);


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
    isAdmin: user?.role === "admin",
  }
}