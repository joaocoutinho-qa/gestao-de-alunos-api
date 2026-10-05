import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import cenarios from '../fixtures/cenarios.json' with { type: 'json' };
import { loginAdmin, loginAluno } from '../helpers/login.js';

describe('POST /api/alunos/:alunoId/trabalhos', () => {
  let tokenAdmin;
  let tokenAluno;
  let alunoId;
  const trabalhosCriados = [];

  before(async () => {
    const respostaAdmin = await loginAdmin();
    tokenAdmin = respostaAdmin.body.token;

    const respostaAluno = await loginAluno();
    tokenAluno = respostaAluno.body.token;
    alunoId = respostaAluno.body.usuario.id;
  });

  after(async () => {
    for (const id of trabalhosCriados) {
      await request(app)
        .delete(`/api/admin/trabalhos/${id}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);
    }
  });

  cenarios.entregaTrabalho.forEach((caso) => {
    it(caso.descricao, async () => {
      const resposta = await request(app)
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send(caso.trabalho);

      expect(resposta.status).to.equal(caso.status);

      trabalhosCriados.push(resposta.body.id);
      expect(resposta.body).to.have.property('id');
      expect(resposta.body.alunoId).to.equal(alunoId);
      expect(resposta.body.disciplinaId).to.equal(caso.trabalho.disciplinaId);
      expect(resposta.body.titulo).to.equal(caso.trabalho.titulo);
      expect(resposta.body.status).to.equal('entregue');
    });
  });
});
