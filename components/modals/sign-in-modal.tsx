import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { MailIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/shared/icons";

function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [signInClicked, setSignInClicked] = useState(false);
  const [signInWithGitHubClicked, setSignInWithGitHubClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
      
      });

      if (result?.error) {
        toast.error("Failed to send magic link");
      } else {
        toast.success("Magic link sent to your email!");
        setTimeout(() => setShowSignInModal(false), 400);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <VisuallyHidden>
        <DialogTitle>Sign In</DialogTitle>
        <DialogDescription>
          Sign in to your account to continue.
        </DialogDescription>
      </VisuallyHidden>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="size-10" />
          </a>
          <h3 className="font-urban text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Ready to ace your next interview?
          </p>
        </div>

        <div className="flex flex-col space-y-4 px-4 py-8 md:px-16">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isEmailLoading}>
              {isEmailLoading ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : (
                <MailIcon className="mr-2 size-4" />
              )}{" "}
              Sign in with Email
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="default"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              signIn("google", { redirect: false }).then(() =>
                setTimeout(() => {
                  setShowSignInModal(false);
                }, 400),
              );
            }}
          >
            {signInClicked ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 size-4" />
            )}{" "}
            Sign In with Google
          </Button>

          {/* GitHub sign-in button */}
          <Button
            variant="default"
            disabled={signInWithGitHubClicked}
            onClick={() => {
              setSignInWithGitHubClicked(true);
              signIn("github", { redirect: false }).then(() =>
                setTimeout(() => {
                  setShowSignInModal(false);
                }, 400),
              );
            }}
          >
            {signInWithGitHubClicked ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 size-4" />
            )}{" "}
            Sign In with GitHub
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({
      setShowSignInModal,
      SignInModal: SignInModalCallback,
    }),
    [setShowSignInModal, SignInModalCallback],
  );
}
