import {useNavigate} from "react-router";
import {useEffect} from "react";

export const RedirectToToday = () => {
  const navigate = useNavigate();

  const getTodayName = () => {
    const today = new Date();
    const options = {weekday: 'long'} as const;
    return today.toLocaleDateString('en-US', options);
  }

  useEffect(() => {
    const todayName = getTodayName();
    const path = `/${todayName.toLowerCase()}`;
    navigate(path);
  }, [navigate]);

  return null;
}