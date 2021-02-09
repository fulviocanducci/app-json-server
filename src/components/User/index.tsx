import React, { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface IUser {
  id?: number;
  name?: string;
  age?: number;
  company?: string;
  phone?: string;
}

function User() {
  const [usuarios, setUsuarios] = useState<IUser[]>([]);

  const inputNome = useRef<HTMLInputElement>(null);
  const inputIdade = useRef<HTMLInputElement>(null);
  const inputEmpresa = useRef<HTMLInputElement>(null);
  const inputTelefone = useRef<HTMLInputElement>(null);

  const mostraUsuarios = () => {
    axios
      .get('http://localhost:4000/usuarios')
      .then((resposta) => setUsuarios(resposta.data));
  };

  const deleteUsuario = (id?: number) => {
    axios.delete(`http://localhost:4000/usuarios/${id}`).then(() => {
      setUsuarios(usuarios.filter((x) => x.id !== id));
    });
  };

  const enviarCadastro = (e: FormEvent) => {
    e.preventDefault();
    const requisicao: IUser = {
      name: inputNome.current?.value,
      age: parseInt(inputIdade.current?.value || '0'),
      company: inputEmpresa.current?.value,
      phone: inputTelefone.current?.value,
    };
    axios
      .post('http://localhost:4000/usuarios', requisicao)
      .then((response) => {
        if (response.status === 201) {
          setUsuarios((state) => [...state, { ...response.data }]);
        }
      });
  };

  useEffect(() => {
    mostraUsuarios();
  }, []);

  return (
    <div>
      <form>
        <input type="text" placeholder="Nome" ref={inputNome} />
        <input type="text" placeholder="Idade" ref={inputIdade} />
        <input type="text" placeholder="Empresa" ref={inputEmpresa} />
        <input type="text" placeholder="Telefone" ref={inputTelefone} />
        <button onClick={enviarCadastro}>Cadastrar</button>
      </form>
      <div>
        {usuarios &&
          usuarios.map((u, i) => (
            <div key={i}>
              {u.name} - {u.company} - {u.age} - {u.phone}
              <button onClick={() => deleteUsuario(u.id)}>Excluir</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default User;
