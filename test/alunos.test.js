import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import cenarios from '../fixtures/cenarios.json' with { type: 'json' };
import { loginAdmin } from '../helpers/login.js';

describe('POST /api/admin/alunos', () => {
  let token;
  const alunosCriados = [];

  before(async () => {
    const resposta = await loginAdmin();
    token = resposta.body.token;
  });

  after(async () => {
    for (const id of alunosCriados) {
      await request(app)
        .delete(`/api/admin/alunos/${id}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  cenarios.cadastroAluno.forEach((caso) => {
    it(caso.descricao, async () => {
      const resposta = await request(app)
        .post('/api/admin/alunos')
        .set('Authorization', `Bearer ${token}`)
        .send(caso.aluno);

      expect(resposta.status).to.equal(caso.status);
      
      alunosCriados.push(resposta.body.id);
      expect(resposta.body).to.have.property('id');
      expect(resposta.body.nome).to.equal(caso.aluno.nome);
      expect(resposta.body.email).to.equal(caso.aluno.email);
      expect(resposta.body.matricula).to.equal(caso.aluno.matricula);
    });
  });
});
