import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import TableComponent from "@/components/table";
import DefaultLayout from "@/components/default";

const columns = [
  { key: "name", label: "Name" },
  { key: "weekDay", label: "Dia da semana" },
  { key: "timeOfDay", label: "Período do dia" },
];

type DashPageProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
};

export default function DashPage({ user }: DashPageProps) {
  const [meets, setMeets] = useState<any[]>([]);
  const [squads, setSquads] = useState<string[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit, watch, reset, control, setValue, getValues } =
    useForm();
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      if (!user) return;

      const response = await fetch(`/api/meet/pendents?id=${user.id}`, {
        method: "GET",
      });

      const resp = await response.json();

      setMeets(resp.meets);
    };

    fetchForms();
  }, []);

  const openModal = (item: any) => {
    console.log("🚀 ~ item => ", item);
    setValue(
      "answers",
      item.form.map((answer: any) => ({ ...answer })),
    );
    setValue("meetId", item._id);
    setValue("companyId", item.companyId);
    setValue("userId", user.id);
    setValue("name", user.name);

    setSquads(item.squads);

    onOpenChange();
  };

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/form", {
        method: "POST",
        body: JSON.stringify({ ...data, userId: user.id }),
      });

      setMeets(
        meets.map((meet: any) => {
          if (meet._id === data.meetId) {
            return {
              ...meet,
              isPending: false,
            };
          }

          return meet;
        }),
      );

      console.log("🚀 ~ res => ", res);
    } catch (error) {
      console.log("🚀 ~ error => ", error);
    }
  };

  return (
    <DefaultLayout user={user}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <img alt="Logo" className="w-132" src="/planner.png" />
        <div className="text-center">
          <h1 className="text-[3rem] lg:text-5xl font-semibold tracking-tight">
            Seja bem vindo <span className="uppercase">{user.name}</span>
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
          <div className="flex-1 p-6 rounded-lg shadow-md">
            <h2 className="text-center text-lg font-medium mb-4">
              {`${meets.length} Reuniõe(s) marcada(s)`}
            </h2>
            <div className="overflow-hidden rounded-md">
              <TableComponent
                columns={columns}
                rows={meets}
                onClickEvent={(item) => router.push(`/meets/${item._id}`)}
                // onClickEvent={(item) => openModal(item)}
              />
            </div>
          </div>
          <div className="flex-1 p-6 rounded-lg shadow-md">
            <h2 className="text-center text-lg font-medium mb-4">
              {`${meets.filter((meet: any) => meet.isPending).length} Formulário(s) pendente(s)`}
            </h2>
            <div className="overflow-hidden rounded-md">
              <TableComponent
                columns={columns}
                rows={meets.filter((meet: any) => meet.isPending)}
                onClickEvent={(item) => openModal(item)}
              />
            </div>
          </div>
        </div>
      </section>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Responder formulário
              </ModalHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ModalBody>
                  <Input
                    label="nome"
                    variant="bordered"
                    {...register(`name`, {
                      required: true,
                    })}
                    placeholder={`Nome`}
                  />
                  <Select
                    label="Squad"
                    placeholder="Selecione a squad"
                    variant="bordered"
                    {...register("squad", {
                      required: true,
                    })}
                    className="mb-2"
                  >
                    {squads.map((squad) => (
                      <SelectItem key={squad}>{squad}</SelectItem>
                    ))}
                  </Select>
                  {getValues("answers")?.map((answer: any, index: number) => (
                    <div key={index}>
                      <Input
                        label={answer.question}
                        variant="bordered"
                        {...register(`answers.${index}.answer`, {
                          required: true,
                        })}
                        placeholder={`Pergunta ${index + 1}`}
                      />
                    </div>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      onClose(), reset();
                    }}
                  >
                    Fechar
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    onPress={() => {
                      onClose(), watch();
                    }}
                  >
                    Enviar Formulário
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}
