import SignIn from "@/components/ui/signin";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}

[
  {
    resource: "/c:/code/vesper/client/src/app/forms/signin/page.tsx",
    owner: "typescript",
    code: "2552",
    severity: 8,
    message: "Cannot find name 'SignIn'. Did you mean 'Signin'?",
    source: "ts",
    startLineNumber: 6,
    startColumn: 8,
    endLineNumber: 6,
    endColumn: 14,
  },
];