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
import { MessageCirclePlus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import { Meet } from "@/types";

type GuestModalProps = {
  squads: string[];
  meet: Meet;
  submit: (data: any) => void;
};

export const GuestModal = ({ squads, meet, submit }: GuestModalProps) => {
  const { register, handleSubmit, watch, reset, getValues } = useForm({
    defaultValues: {
      name: "",
      squad: "",
      answers: meet?.form.map((form: any) => ({
        question: form.question,
        answer: "",
      })),
    },
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = (data: any) => {
    submit(data);
  };

  return (
    <>
      <Button radius="md" size="md" variant="faded" onClick={() => onOpen()}>
        <MessageCirclePlus size={20} />
        {" Enviar resposta"}
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
                Responder formulário
              </ModalHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ModalBody>
                  <Input
                    label="Nome"
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
                        type="textarea"
                        variant="bordered"
                        {...register(`answers.${index}.answer`, {
                          required: true,
                        })}
                        placeholder={`Pergunta ${index + 1}`}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            e.preventDefault();
                          }
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const textarea = e.target as HTMLTextAreaElement;
                            const { selectionStart, selectionEnd } = textarea;
                            const value = textarea.value;

                            textarea.value =
                              value.substring(0, selectionStart) +
                              "\n" +
                              value.substring(selectionEnd);
                            textarea.selectionStart = textarea.selectionEnd =
                              selectionStart + 1;
                          }
                        }}
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
                    onPress={() => {
                      onClose(), submit(getValues());
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
    </>
  );
};
