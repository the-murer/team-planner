import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { MeetForm, weekDays } from "@/components/forms/meet";
import DefaultLayout from "@/components/default";
import { LoadComponent } from "@/components/loadComponent";
import { Meet } from "@/types";
import TableComponent from "@/components/table";

const columns = [
  { key: "name", label: "Nome" },
  { key: "timeOfDay", label: "Horário" },
  {
    key: "weekDay",
    label: "Dia da semana",
    modifier: (value: string) =>
      weekDays.find((day: any) => day.key === value)?.label,
  },
  { key: "local", label: "Local" },
  { key: "actions", label: "Ações" },
];

type MeetsPageProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
  userIsAdmin: boolean;
};

export default function MeetsPage({ user, userIsAdmin }: MeetsPageProps) {
  const router = useRouter();
  const [meets, setMeets] = useState([]);

  useEffect(() => {
    const fetchMeets = async () => {
      await fetch(`/api/meet`, {
        method: "PATCH",
        body: JSON.stringify({ userId: user.id }),
      })
        .then(async (result) => {
          const response = await result.json();

          setMeets(response.meets);
        })
        .catch((error) => {
          toast.error("Falha ao buscar reuniões");
          console.error("Falha na request: ", error.message);
        });
    };

    fetchMeets();
  }, []);

  const onDoubleClickEvent = (e: Meet) => {
    router.push(`/meets/${e._id}`);
  };

  if (!meets) return <LoadComponent />;

  return (
    <DefaultLayout user={user}>
      <h1 className="text-[3rem] lg:text-5xl font-semibold tracking-tight">
        Reuniões
        <MeetForm userId={user.id} userIsAdmin={userIsAdmin} />
      </h1>
      <div className="mt-10">
        <TableComponent
          columns={columns}
          rows={meets}
          onDoubleClickEvent={onDoubleClickEvent}
        />
      </div>
    </DefaultLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const userIsAdmin = !!(session?.user as any)?.companies?.find(
    (company: any) => company.isAdmin === true,
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = session.user as any;

  return {
    props: {
      user,
      userIsAdmin,
    },
  };
}
