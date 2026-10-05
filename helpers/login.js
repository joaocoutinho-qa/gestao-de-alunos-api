import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import usuarios from '../fixtures/usuarios.json' with { type: 'json' };

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestao-de-alunos';

async function garantirConexao() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function loginAdmin(credenciais = usuarios.admin) {
  await garantirConexao();
  return request(app).post('/api/auth/login').send(credenciais);
}

export async function loginAluno(credenciais = usuarios.aluno) {
  await garantirConexao();
  return request(app).post('/api/auth/login').send(credenciais);
}