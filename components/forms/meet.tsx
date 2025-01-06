import {
  Accordion,
  AccordionItem,
  Button,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  Input,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useFieldArray, useForm } from "react-hook-form";
import { Modal } from "@nextui-org/react";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

interface FormValues {
  name: string;
  timeOfDay: string;
  weekDay: string;
  local: string;
  squads: string[];
  form: { question: string; type: string }[];
}

const timeOfDays = [
  { key: "Manhã", label: "Manhã" },
  { key: "Tarde", label: "Tarde" },
  { key: "Noite", label: "Noite" },
];

const weekDays = [
  { key: "0", label: "Domingo" },
  { key: "1", label: "Segunda-feira" },
  { key: "2", label: "Terça-feira" },
  { key: "3", label: "Quarta-feira" },
  { key: "4", label: "Quinta-feira" },
  { key: "5", label: "Sexta-feira" },
  { key: "6", label: "Sábado" },
];

interface MeetFormProps {
  userId: string;
  userIsAdmin: boolean;
}

export const MeetForm = ({ userId, userIsAdmin }: MeetFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit, watch, reset, control } = useForm<FormValues>(
    {
      defaultValues: {
        name: "",
        timeOfDay: "",
        weekDay: "",
        local: "",
        squads: [""],
        form: [{ question: "", type: "string" }],
      },
    },
  );

  const {
    fields: squads,
    append: appendSquad,
    remove: removeSquad,
  } = useFieldArray({
    control,
    name: "squads" as any,
  });

  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "form",
  });

  const onSubmit = async (data: any) => {
    try {
      await fetch("/api/meet", {
        method: "POST",
        body: JSON.stringify({ ...data, userId }),
      });

      toast.success("Reunião criada com sucesso");
    } catch (err) {
      toast.error("Erro ao criar reunião");
    }
  };

  return (
    <>
      <Button
        isIconOnly
        className="ml-auto"
        hidden={!userIsAdmin}
        radius="md"
        size="md"
        style={{ marginLeft: "10px", marginTop: "-10px" }}
        variant="faded"
        onPress={onOpen}
      >
        <Plus size={20} />
      </Button>

      <Modal
        // className="w-[800px] max-w-full mx-auto p-4"
        isOpen={isOpen}
        placement="top-center"
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-[800px] max-w-full mx-auto p-4">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Criar reunião
              </ModalHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ModalBody className="h-[500px]">
                  {/* ======= 1 COLUNA ======= */}
                  <Input
                    label="Nome"
                    placeholder="Nome da reunião"
                    variant="bordered"
                    {...register("name", { required: true })}
                  />
                  {/* ======= 2 COLUNA ======= */}
                  <div className="flex flex-row gap-4">
                    <Select
                      // className="max-w-xs"
                      label="Período do dia"
                      placeholder="Selecione o período do dia"
                      variant="bordered"
                      {...register("timeOfDay", { required: true })}
                    >
                      {timeOfDays.map((time) => (
                        <SelectItem key={time.key}>{time.label}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Dia da semana"
                      placeholder="Selecione o dia da reunião"
                      variant="bordered"
                      {...register("weekDay", { required: true })}
                    >
                      {weekDays.map((time) => (
                        <SelectItem key={time.key}>{time.label}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Accordion>
                    {/* ======= 3 COLUNA ======= */}
                    <AccordionItem key="1" aria-label="Setores" title="Setores">
                      <div className="flex flex-row gap-4 justify-between">
                        <p className="text-xl text-gray-500 mt-2">Setores</p>
                        <Button
                          color="primary"
                          style={{ marginBottom: "10px" }}
                          variant="solid"
                          onClick={() => appendSquad("")}
                        >
                          + Adicionar Setor
                        </Button>
                      </div>
                      {squads.map((field, index) => (
                        <div
                          key={field.id}
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Input
                            label="Setor"
                            variant="bordered"
                            {...register(`squads.${index}`, {
                              required: true,
                            })}
                            placeholder={`Setor ${index + 1}`}
                            style={{ marginRight: "10px" }}
                          />
                          <Button
                            className="mt-2 ml-5"
                            color="danger"
                            variant="solid"
                            onClick={() => removeSquad(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </AccordionItem>
                    {/* ======= 4 COLUNA ======= */}
                    <AccordionItem
                      key="2"
                      aria-label="Perguntas"
                      title="Perguntas"
                    >
                      <div className="flex flex-row gap-4 justify-between">
                        <p className="text-xl text-gray-500 mt-2">
                          Perguntas da reunião
                        </p>
                        <Button
                          color="primary"
                          style={{ marginBottom: "10px" }}
                          variant="solid"
                          onClick={() =>
                            appendQuestion({ question: "", type: "string" })
                          }
                        >
                          + Adicionar Pergunta
                        </Button>
                      </div>
                      {questions.map((field, index) => (
                        <div
                          key={field.id}
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Input
                            label="Pergunta"
                            variant="bordered"
                            {...register(`form.${index}.question`, {
                              required: true,
                            })}
                            placeholder={`Pergunta ${index + 1}`}
                            style={{ marginRight: "10px" }}
                          />
                          <Button
                            className="mt-2 ml-5"
                            color="danger"
                            variant="solid"
                            onClick={() => removeQuestion(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </AccordionItem>
                  </Accordion>

                  {/* ======= 5 COLUNA ======= */}
                  <Input
                    label="Local"
                    placeholder="Local da reunião"
                    variant="bordered"
                    {...register("local", { required: false })}
                  />
                </ModalBody>
                <ModalFooter className="flex flex-row justify-between">
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
                    Criar reunião
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
