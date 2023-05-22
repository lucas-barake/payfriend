import { type FC } from "react";
import { useRouter } from "next/router";
import { Button, type ButtonProps } from "$/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "$/lib/utils/cn";

type Props = ButtonProps;

const GoBackButton: FC<Props> = ({ className, ...rest }) => {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      onClick={() => {
        router.back();
      }}
      className={cn("rounded-full p-2.5", className)}
      {...rest}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export { GoBackButton };
