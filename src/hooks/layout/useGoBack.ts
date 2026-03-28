import { ROUTES } from "@/common/constants/routes";
import { useRouter } from "@/routers/hooks";

const useGoBack = () => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.MAIN.HOME.path);
    }
  };

  return goBack;
};

export default useGoBack;
