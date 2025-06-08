import {GalleryVerticalEnd} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Link, useNavigate} from "react-router";
import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useLoginMutation} from "@/app/authApi";
import {toast} from "sonner";
import {setUser} from "@/app/appSlice";
import {useAppDispatch} from "@/app/hooks";
import {useAuth} from "@/hooks/use-auth";

const loginForm = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(5, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginForm>;

export function LoginPage() {
  useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, {isLoading}] = useLoginMutation();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await login(data).unwrap();
      toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <GalleryVerticalEnd className="size-6"/>
                    </div>
                    <span className="sr-only">Tikera</span>
                  </a>
                  <h1 className="text-xl font-bold">Welcome to Tikera</h1>
                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem className={"grid gap-3"}>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                      <FormItem className={"grid gap-3"}>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="********" type="password" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <div
            className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}