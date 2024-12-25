import { getSession } from "next-auth/react";

import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/components/default";

type IndexPageProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
};

export default function IndexPage({ user }: IndexPageProps) {
  return (
    <DefaultLayout user={user}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Gerencie seu&nbsp;</span>
          <span className={title({ color: "violet" })}>Time&nbsp;</span>
          <br />
          <span className={title()}>
            tenha controle total sobre suas agendas
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Gerencie suas weeklys com a plataforma Team Planner.
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: {
      user: session?.user || null,
    },
  };
}
