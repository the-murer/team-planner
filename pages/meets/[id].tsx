import { Button, Card } from "@nextui-org/react";
import { RefreshCcw, Share } from "lucide-react";
import { addDays, formatISO, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { Form, Meet } from "@/types";
import DefaultLayout from "@/components/default";
import { GuestModal } from "@/components/guest";
import { LoadComponent } from "@/components/loadComponent";
import { MeetResume } from "@/components/meetResume";
import { NotFoundComponent } from "@/components/notFoundComponent";
import { Timer } from "@/components/timer";
import { WeekDatePicker } from "@/components/weekDatePicker";

type MeetsPageProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
  isGuest: boolean;
};

export default function MeetsPage({ user, isGuest }: MeetsPageProps) {
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<any[]>([]);
  const [meet, setMeet] = useState<Meet | undefined>(undefined);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const [currentSquad, setCurrentSquad] = useState<string | undefined>(
    undefined,
  );
  const router = useRouter();

  const fetchForms = async (startDate: string, endDate: string) => {
    const response = await fetch(
      `/api/form/${router.query.id}?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
      },
    );

    const resp = await response.json();

    setForms(resp.forms);
  };

  useEffect(() => {
    const fetchMeet = async () => {
      const response = await fetch(`/api/meet/${router.query.id}`, {
        method: "GET",
      });

      const resp = await response.json();

      setMeet(resp.meet);

      setLoading(false);
    };

    fetchMeet();
  }, [router.query.id]);

  const handleSquadClick = (squad: string) => {
    setCurrentSquad(squad);
    setCurrentFormIndex(0);
  };

  const handleNextForm = () => {
    setCurrentFormIndex(currentFormIndex + 1);
  };

  const handlePreviousForm = () => {
    setCurrentFormIndex(currentFormIndex - 1);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    fetchForms(startDate, endDate);
  };

  const handleNextSquad = () => {
    setCurrentSquad(meet?.squads[meet?.squads.indexOf(currentSquad || "") + 1]);
    setCurrentFormIndex(0);
  };

  const copyMeetLink = () => {
    const link =
      process.env.NEXT_PUBLIC_HOST || "https://team-planner.vercel.app";
    const inviteLink = `${link}/meets/${meet?._id}?isGuest=true`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast.success("Link copiado com sucesso!");
      })
      .catch((err) => {
        toast.error("Erro ao copiar link");
        console.error("Erro ao copiar link ", err);
      });
  };

  const submit = async (data: any) => {
    if (!meet) {
      return;
    }

    try {
      await fetch("/api/form", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userId: user.id,
          meetId: meet._id,
          companyId: meet.companyId,
        }),
      });

      setForms([...forms, data]);
      toast.success("Resposta enviada com sucesso");
    } catch (error) {
      toast.error("Erro ao enviar resposta");
      console.error("Erro ao enviar resposta ", error);
    }
  };

  const refreshForms = () => {
    if (!currentDate) return;

    const date = new Date(currentDate);

    const startDate = formatISO(subDays(date, 1));
    const endDate = formatISO(addDays(date, 1));

    fetchForms(startDate, endDate);
  };

  const currentForm = forms?.filter(
    (form: Form) => form.squad === currentSquad,
  )?.[currentFormIndex];

  const filteredForms = forms?.filter(
    (form: Form) => form.squad === currentSquad,
  );
  const hasNextSquad =
    meet?.squads?.indexOf(currentSquad || "") ||
    0 < (meet?.squads.length || 0) - 1;

  if (loading) return <LoadComponent />;

  if (!meet) return <NotFoundComponent message="Reunião não encontrada" />;

  return (
    <DefaultLayout user={user}>
      <div className="flex flex-col lg:flex-row tracking-tight gap-4">
        <h1 className="text-4xl lg:text-5xl font-semibold">{meet.name}</h1>
        <Button radius="md" size="md" variant="ghost" onPress={refreshForms}>
          <RefreshCcw size={20} />
        </Button>
        <Timer />
        {isGuest && (
          <GuestModal meet={meet} squads={meet.squads} submit={submit} />
        )}
        <MeetResume forms={forms} />
        <Button radius="md" size="md" variant="faded" onPress={copyMeetLink}>
          <Share size={20} />
          {" Compartilhar"}
        </Button>
        <WeekDatePicker
          currentDate={currentDate}
          handleDateChange={handleDateChange}
          meet={meet}
          setCurrentDate={setCurrentDate}
        />
      </div>

      <div className="flex flex-col lg:flex-row w-100%">
        <div className="mt-10 flex flex-col gap-4 mr-10">
          {meet.squads.map((squad) => (
            <Button
              key={squad}
              className="flex flex-col items-start h-22 w-21% mb-4 p-4"
              color={currentSquad === squad ? "primary" : "default"}
              isDisabled={currentSquad === squad}
              variant="solid"
              onPress={() => handleSquadClick(squad)}
            >
              <h2 className="text-lg font-medium">{squad}</h2>
              <p className="text-sm text-gray-300">
                {`${forms?.filter((form: any) => form.squad === squad).length} Respostas`}
              </p>
            </Button>
          ))}
        </div>
        <div className="w-full">
          <Card className="mt-10 w-70%">
            {currentSquad ? (
              <div className="text-lg font-medium mb-4 p-4 items-start">
                {currentForm ? (
                  <>
                    <div className="flex flex-row justify-between">
                      <h2 className="font-bold text-2xl mb-4">
                        {currentForm?.name}
                      </h2>
                      <div className="flex flex-row gap-2">
                        <Button
                          color={currentFormIndex === 0 ? "default" : "primary"}
                          isDisabled={currentFormIndex === 0}
                          onPress={handlePreviousForm}
                        >
                          Anterior
                        </Button>
                        <Button
                          color={
                            currentFormIndex === filteredForms.length - 1
                              ? "default"
                              : "primary"
                          }
                          isDisabled={
                            currentFormIndex === filteredForms.length - 1
                          }
                          onPress={handleNextForm}
                        >
                          Próximo
                        </Button>
                        {hasNextSquad &&
                          currentFormIndex === filteredForms.length - 1 && (
                            <Button color="primary" onPress={handleNextSquad}>
                              Próxima Squad
                            </Button>
                          )}
                      </div>
                    </div>

                    {currentForm?.answers.map((answer: any) => (
                      <div key={answer.id} className="flex flex-col gap-2 mb-5">
                        <p className="text-xl font-medium">{answer.question}</p>
                        <p className="text-md font-medium text-gray-300">
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-row justify-between">
                    <h2 className="text-center text-2xl font-medium mb-4">
                      Nenhum formulário encontrado
                    </h2>
                    <Button
                      className="w-50px"
                      color="primary"
                      onPress={handleNextSquad}
                    >
                      Próxima Squad
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <h2 className="text-center text-lg font-medium mb-4">
                Selecione uma squad
              </h2>
            )}
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const isGuest = context.params || false;

  if (!session && !isGuest) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = session?.user || false;

  return {
    props: {
      user,
      isGuest,
    },
  };
}
