import { expect } from 'chai';
import cenarios from '../fixtures/cenarios.json' with { type: 'json' };
import { loginAdmin, loginAluno } from '../helpers/login.js';

describe('POST /api/auth/login como administrador', () => {
  cenarios.loginAdmin.forEach((caso) => {
    it(caso.descricao, async () => {
      const resposta = await loginAdmin({ email: caso.email, senha: caso.senha });
      expect(resposta.status).to.equal(caso.status);
      expect(resposta.body).to.have.property('token');
      expect(resposta.body.usuario.email).to.equal(caso.email);
      expect(resposta.body.usuario.role).to.equal(caso.role);
    });
  });
});

describe('POST /api/auth/login como aluno', () => {
  cenarios.loginAluno.forEach((caso) => {
    it(caso.descricao, async () => {
      const resposta = await loginAluno({ email: caso.email, senha: caso.senha });
      expect(resposta.status).to.equal(caso.status);
      expect(resposta.body).to.have.property('token');
      expect(resposta.body.usuario.email).to.equal(caso.email);
      expect(resposta.body.usuario.role).to.equal(caso.role);
    });
  });
});
