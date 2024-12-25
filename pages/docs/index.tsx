import { getSession } from "next-auth/react";

import DefaultLayout from "@/components/default";
import { title } from "@/components/primitives";

type DocsPageProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
};

export default function DocsPage({ user }: DocsPageProps) {
  return (
    <DefaultLayout user={user}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>
        </div>
      </section>
    </DefaultLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: {
      user: session?.user,
    },
  };
}
