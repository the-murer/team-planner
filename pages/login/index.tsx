import {
  Button,
  Card,
  CardBody,
  Input,
  Link,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

import DefaultLayout from "@/components/default";

export default function DocsPage() {
  const [selected, setSelected] = useState<React.Key>("login");
  const { register, handleSubmit, watch, reset } = useForm();
  const router = useRouter();
  const { companyId, isAdmin } = router.query;

  const enableRegister = companyId && isAdmin;

  const onSubmit = async (data: any) => {
    if (selected === "login") {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (res?.error) {
          throw new Error(res.error);
        }
        if (res?.ok) {
          router.push("/dash");
        }
        toast.success("Login realizado com sucesso");
      } catch (error) {
        console.log("🚀 error => ", error);
        toast.error("Erro ao fazer login");
      }
    } else {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({
            ...data,
            companyId,
            isAdmin: isAdmin === "true",
          }),
        });

        const res = await response.json();

        if (res.error) {
          throw new Error(res.error);
        }

        toast.success("Cadastro realizado com sucesso");
        if (res.data.success) {
          router.push("/");
        }
      } catch (error) {
        console.error("🚀 error => ", error);
        toast.error("Erro ao fazer cadastro");
      }
    }
  };

  const onSelectionChange = (key: React.Key) => {
    reset();
    setSelected(key);
  };

  return (
    <DefaultLayout user={null}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <div className="flex w-full justify-center">
            <Card
              className={`max-w-full w-[340px] h-[${selected === "login" ? 300 : 400}px]`}
            >
              <CardBody className="overflow-hidden">
                <Tabs
                  fullWidth
                  aria-label="Tabs form"
                  selectedKey={selected as any}
                  size="md"
                  onSelectionChange={onSelectionChange}
                >
                  <Tab key="login" title="Login">
                    <form className="flex flex-col gap-4">
                      <Input
                        {...register("email", { required: true })}
                        isRequired
                        label="Email"
                        placeholder="Insira seu email"
                        type="email"
                      />
                      <Input
                        {...register("password", { required: true })}
                        isRequired
                        label="Senha"
                        placeholder="Insira sua senha"
                        type="password"
                      />
                      <p className="text-center text-small">
                        Ainda não tem uma conta?{" "}
                        <Link size="sm" onPress={() => setSelected("sign-up")}>
                          Criar
                        </Link>
                      </p>
                      <div className="flex gap-2 justify-end">
                        <Button
                          fullWidth
                          color="primary"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            onSubmit(watch());
                          }}
                        >
                          Login
                        </Button>
                      </div>
                    </form>
                  </Tab>
                  {enableRegister && (
                    <Tab key="sign-up" title="Criar conta">
                      <form
                        className="flex flex-col gap-4 h-[300px]"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <Input
                          {...register("name", { required: true })}
                          isRequired
                          label="Nome"
                          placeholder="Insira seu nome"
                          type="name"
                        />
                        <Input
                          {...register("email", { required: true })}
                          isRequired
                          label="Email"
                          placeholder="Insira seu email"
                          type="email"
                        />
                        <Input
                          {...register("password", { required: true })}
                          isRequired
                          label="Senha"
                          placeholder="Insira sua senha"
                          type="password"
                        />
                        <p className="text-center text-small">
                          Já tem uma conta?{" "}
                          <Link size="sm" onPress={() => setSelected("login")}>
                            Fazer login
                          </Link>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button
                            fullWidth
                            color="primary"
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              onSubmit(watch());
                            }}
                          >
                            Cadastrar
                          </Button>
                        </div>
                      </form>
                    </Tab>
                  )}
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
