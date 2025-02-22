import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

import TableComponent from "@/components/table";
import DefaultLayout from "@/components/default";

const columns = [
  { key: "name", label: "Nome" },
  { key: "email", label: "Email" },
];

type UserPageProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
  companyId: string;
};

export default function UserPage({ user, companyId }: UserPageProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [permission, setPermission] = useState<string>("false");
  const [users, setUsers] = useState<any[]>([]);
  const handleCopyLink = () => {
    const inviteLink = `http://localhost:3000/invite?companyId=${companyId}&isAdmin=${permission}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast.success("Link copiado com sucesso!");
      })
      .catch((err) => {
        console.log("🚀 ~ handleCopyLink ~ err => ", err);
        toast.error("Falha ao copiar o link!");
      });
  };

  const changePermission = (e: any) => {
    setPermission(e.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`/api/users`, {
        method: "PATCH",
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.status !== 200) {
        toast.error("Falha ao buscar usuários");

        return;
      }

      const resp = await response.json();

      setUsers(resp.users);
    };

    fetchUsers();
  }, []);

  return (
    <DefaultLayout user={user}>
      <h1 className="text-[3rem] lg:text-5xl font-semibold tracking-tight">
        Usuários
        <Button
          isIconOnly
          className="ml-auto"
          hidden={!companyId}
          radius="md"
          size="md"
          style={{ marginLeft: "10px", marginTop: "-10px" }}
          variant="faded"
          onPress={onOpen}
        >
          <Plus size={20} />
        </Button>
      </h1>
      {/* <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"> */}
      <div className="mt-10">
        <TableComponent columns={columns} rows={users} />
      </div>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Convidar usuário
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  label="Com qual permissão você deseja compartilhar este link?"
                  value={permission}
                  onChange={changePermission}
                >
                  <Radio value="true">Administrador</Radio>
                  <Radio value="false">Membro</Radio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={handleCopyLink}>
                  Copiar link de convite
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const userIsAdmin = (session?.user as any)?.companies?.find(
    (company: any) => company.isAdmin === true,
  );

  if (!session || !userIsAdmin) {
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
      companyId: userIsAdmin?._id || false,
    },
  };
}
