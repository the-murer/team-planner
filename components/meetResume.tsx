import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { BrainCircuit } from "lucide-react";
import OpenAI from "openai";
import { toast } from "react-toastify";

const generateInput = (forms: any[]) => {
  return `
  Preciso que voce gere um resumo do que foi discutido no encontro.
  Abaixo estão as respostas do formulário:
  ${forms.map((form) => `${form.name} Squad ${form.squad}: ${form.answers.map((answer: any) => `${answer.question}: ${answer.answer}`).join("\n")}`).join("\n")}
  Meu objetivo é gerar um resumo do que foi discutido no encontro.
  Meu resumo deve ser em português do Brasil.

  Divida o resumo em partes, cada parte deve ter no máximo 1000 caracteres.

  Na primeira parte, me fale sobre o que foi discutido no encontro de forma geral, generalizando basicamente o que foi discutido.
  Na segunda parte, me fale sobre o que foi discutido no encontro de forma mais detalhada, com mais detalhes sobre o que foi discutido, separando por setores.
  Na terceira parte, aponte melhorias que podem ser feitas para as atividades da equipe para a próxima reunião.
  `;
};

type MeetResumeProps = {
  forms: any[];
};

export const MeetResume = ({ forms }: MeetResumeProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [openai, setOpenai] = useState<OpenAI | null>(null);
  const [thread, setThread] = useState<any | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

  useEffect(() => {
    initChatBot();
  }, []);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setThread(thread);
  };

  const generateResume = async () => {
    const assistantId = process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID;

    if (!openai || !thread || !assistantId) return;

    setLoading(true);
    setCurrentMessage("");
    // Send a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: generateInput(forms),
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the response to be ready
    while (response.status === "in_progress" || response.status === "queued") {
      const messageList = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messageList.data
        .filter(
          (message) =>
            message.run_id === run.id && message.role === "assistant",
        )
        .pop();

      if (lastMessage?.content[0]?.type === "text") {
        const text = lastMessage.content[0].text.value;

        // Update the message word by word
        for (let i = currentMessage.length; i < text.length; i++) {
          setCurrentMessage((prev) => prev + text[i]);
          await new Promise((resolve) => setTimeout(resolve, 50)); // Delay for visual effect
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setLoading(false);
  };

  const copyResume = () => {
    navigator.clipboard.writeText(currentMessage);
    toast.success("Resumo copiado com sucesso");
  };

  // if (!forms.length) return null;

  if (!apiKey) return null;

  return (
    <>
      <Button
        className="ml-5 mt-2"
        radius="md"
        size="md"
        variant="faded"
        onClick={() => onOpen()}
      >
        <BrainCircuit size={20} />
        {" Gerar resumo"}
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
                <div className="flex justify-between mt-6">
                  Resumo gerado por inteligência artificial
                  {!!currentMessage && (
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={copyResume}
                    >
                      Copiar
                    </Button>
                  )}
                </div>
              </ModalHeader>

              <ModalBody>
                <div>
                  {loading && <Spinner />}
                  {currentMessage || "Clique em 'Gerar resumo' para começar"}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="solid" onPress={onClose}>
                  Fechar
                </Button>

                <Button
                  color="primary"
                  isDisabled={loading || !!currentMessage}
                  variant="solid"
                  onPress={generateResume}
                >
                  Gerar resumo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
