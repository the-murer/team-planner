import { Button, ModalFooter, useDisclosure } from "@nextui-org/react";
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
  const { register, handleSubmit, watch, reset, control } = useForm({
    defaultValues: {
      name: "",
      timeOfDay: "",
      weekDay: "",
      local: "",
      form: [{ question: "", type: "string" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "form", // Nome do array no formulário
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/meet", {
        method: "POST",
        body: JSON.stringify({ ...data, userId }),
      });

      console.log("🚀 ~ res => ", res);
    } catch (error) {
      console.log("🚀 ~ error => ", error);
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
        isOpen={isOpen}
        placement="top-center"
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Criar reunião
              </ModalHeader>
              <form
                className="flex flex-col gap-4 h-[300px]"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ModalBody>
                  <Input
                    label="Nome"
                    placeholder="Nome da reunião"
                    variant="bordered"
                    {...register("name", { required: true })}
                  />
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
                    // className="max-w-xs"
                    label="Dia da semana"
                    placeholder="Selecione o dia da reunião"
                    variant="bordered"
                    {...register("weekDay", { required: true })}
                  >
                    {weekDays.map((time) => (
                      <SelectItem key={time.key}>{time.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Nome"
                    placeholder="Local da reunião"
                    variant="bordered"
                    {...register("local", { required: false })}
                  />
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      style={{
                        marginBottom: "10px",
                        width: "80%",
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
                        onClick={() => remove(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}

                  <Button
                    color="primary"
                    style={{ marginBottom: "10px" }}
                    variant="bordered"
                    onClick={() => append({ question: "", type: "string" })}
                  >
                    + Adicionar Pergunta
                  </Button>
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
