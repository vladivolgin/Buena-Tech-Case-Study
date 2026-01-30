import WizardForm from "@/components/wizard/WizardForm";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

export default function Page() {
  return (
    <div>
      <Link href="/dashboard">
        <Button m="4" variant="outline">
          <RiArrowLeftLine /> Dashboard
        </Button>
      </Link>
      <WizardForm />
    </div>
  );
}
