import { Button, Card } from "@nextui-org/react";
import { RefreshCcw, Share } from "lucide-react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import DefaultLayout from "@/components/default";
import { GuestModal } from "@/components/guest";
import { LoadComponent } from "@/components/loadComponent";
import { Meet } from "@/types";
import { MeetResume } from "@/components/meetResume";
import { NotFoundComponent } from "@/components/notFoundComponent";
import { Timer } from "@/components/timer";

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
  const [currentSquad, setCurrentSquad] = useState<string | undefined>(
    undefined,
  );
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const router = useRouter();

  const fetchForms = async () => {
    const response = await fetch(`/api/form/${router.query.id}`, {
      method: "GET",
    });

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
    fetchForms();
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

  const copyMeetLink = () => {
    const inviteLink = `${process.env.NEXT_PUBLIC_HOST}/invite?companyId=${meet?.companyId}&isGuest=true`;

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
    } catch (error) {
      toast.error("Erro ao enviar resposta");
      console.error("Erro ao enviar resposta ", error);
    }
  };

  const currentForm = forms?.filter(
    (form: any) => form.squad === currentSquad,
  )?.[currentFormIndex];

  const filteredForms = forms?.filter(
    (form: any) => form.squad === currentSquad,
  );

  if (loading) return <LoadComponent />;

  if (!meet) return <NotFoundComponent message="Reunião não encontrada" />;

  return (
    <DefaultLayout user={user}>
      <h1 className="text-[3rem] lg:text-5xl font-semibold tracking-tight flex flex-row">
        {meet.name}
        <Button
          className="ml-5 mt-2"
          radius="md"
          size="md"
          variant="ghost"
          onClick={fetchForms}
        >
          <RefreshCcw size={20} />
        </Button>
        <Timer />
        {isGuest && (
          <GuestModal meet={meet} squads={meet.squads} submit={submit} />
        )}
        <MeetResume forms={forms} />
        <Button
          className="ml-5 mt-2"
          radius="md"
          size="md"
          variant="faded"
          onClick={copyMeetLink}
        >
          <Share size={20} />
          {" Compartilhar"}
        </Button>
      </h1>

      {/* <section className="flex flex-row w-100%"> */}
      <div className="flex flex-row w-100%">
        <div className="mt-10 w-30% flex flex-col gap-4 mr-10">
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
                    <h2 className="font-bold text-2xl mb-4">
                      {currentForm?.name}
                      <Button
                        className="ml-4"
                        color={currentFormIndex === 0 ? "default" : "primary"}
                        isDisabled={currentFormIndex === 0}
                        onPress={handlePreviousForm}
                      >
                        Anterior
                      </Button>
                      <Button
                        className="ml-4"
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
                    </h2>
                    {currentForm?.answers.map((answer: any) => (
                      <div key={answer.id} className="flex flex-col gap-2 mb-5">
                        <p className="text-xl font-medium">{answer.question}</p>
                        <p className="text-sm font-medium text-gray-300">
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <h2 className="text-center text-lg font-medium mb-4">
                    Nenhum formulário encontrado
                  </h2>
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
        destination: "/auth/signin",
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
